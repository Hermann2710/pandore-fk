import logging
import markdown
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

from .models import Subscriber, Newsletter
from .serializers import SubscriberSerializer, NewsletterSerializer, NewsletterWriteSerializer
from core.permissions import IsAdminRole

logger = logging.getLogger(__name__)


def _brevo_contacts_api():
    config = sib_api_v3_sdk.Configuration()
    config.api_key["api-key"] = settings.BREVO_API_KEY
    return sib_api_v3_sdk.ContactsApi(sib_api_v3_sdk.ApiClient(config))


def _brevo_email_api():
    config = sib_api_v3_sdk.Configuration()
    config.api_key["api-key"] = settings.BREVO_API_KEY
    return sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(config))


def _sync_contact_to_brevo(email: str, active: bool):
    """Upsert contact in Brevo and add/remove from the configured list."""
    if not settings.BREVO_API_KEY:
        return
    api = _brevo_contacts_api()
    list_ids = [settings.BREVO_LIST_ID] if settings.BREVO_LIST_ID else []
    try:
        body = sib_api_v3_sdk.CreateContact(
            email=email,
            list_ids=list_ids if active else [],
            unlinkListIds=[] if active else list_ids,
            update_enabled=True,
        )
        api.create_contact(body)
    except ApiException as e:
        logger.error("Brevo contact sync failed for %s: %s", email, e)


# ── Public ─────────────────────────────────────────────────────────────────────

class SubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        if not email:
            return Response({"detail": "Email is required."}, status=400)

        subscriber, created = Subscriber.objects.get_or_create(email=email)
        if not created and subscriber.is_active:
            return Response({"detail": "Already subscribed."}, status=400)

        subscriber.is_active = True
        subscriber.save()
        _sync_contact_to_brevo(email, active=True)
        return Response({"detail": "Successfully subscribed!"}, status=201 if created else 200)


class UnsubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        if not email:
            return Response({"detail": "Email is required."}, status=400)
        try:
            subscriber = Subscriber.objects.get(email=email)
            subscriber.is_active = False
            subscriber.save()
            _sync_contact_to_brevo(email, active=False)
            return Response({"detail": "Successfully unsubscribed."})
        except Subscriber.DoesNotExist:
            return Response({"detail": "Email not found."}, status=404)


class CheckSubscriptionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        email = request.query_params.get("email", "").strip().lower()
        if not email:
            return Response({"subscribed": False})
        subscribed = Subscriber.objects.filter(email=email, is_active=True).exists()
        return Response({"subscribed": subscribed})


# ── Admin ──────────────────────────────────────────────────────────────────────

class AdminSubscriberListView(generics.ListAPIView):
    serializer_class = SubscriberSerializer
    permission_classes = [IsAdminRole]
    queryset = Subscriber.objects.all().order_by("-subscribed_at")


class AdminNewsletterListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminRole]
    queryset = Newsletter.objects.all()

    def get_serializer_class(self):
        return NewsletterWriteSerializer if self.request.method == "POST" else NewsletterSerializer


class AdminNewsletterDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminRole]
    queryset = Newsletter.objects.all()

    def get_serializer_class(self):
        return NewsletterWriteSerializer if self.request.method in ("PUT", "PATCH") else NewsletterSerializer


class AdminSendNewsletterView(APIView):
    permission_classes = [IsAdminRole]

    def post(self, request, pk):
        try:
            newsletter = Newsletter.objects.get(pk=pk)
        except Newsletter.DoesNotExist:
            return Response({"detail": "Newsletter not found."}, status=404)

        if newsletter.status == Newsletter.Status.SENT:
            return Response({"detail": "Already sent."}, status=400)

        subscribers = list(Subscriber.objects.filter(is_active=True).values_list("email", flat=True))
        active_count = len(subscribers)

        if not subscribers:
            return Response({"detail": "No active subscribers."}, status=400)

        if not settings.BREVO_API_KEY:
            return Response({"detail": "BREVO_API_KEY is not configured."}, status=503)

        # Convert markdown content to HTML
        html_content = markdown.markdown(newsletter.content, extensions=["extra", "nl2br"])

        sender = {"name": settings.BREVO_SENDER_NAME, "email": settings.BREVO_SENDER_EMAIL}
        to = [{"email": email} for email in subscribers]

        api = _brevo_email_api()
        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            sender=sender,
            to=to,
            subject=newsletter.subject,
            html_content=html_content,
            text_content=newsletter.content,
        )

        try:
            api.send_transac_email(send_smtp_email)
        except ApiException as e:
            logger.error("Brevo send failed — status: %s, reason: %s, body: %s", e.status, e.reason, e.body)
            return Response({"detail": f"Brevo error {e.status}: {e.body}"}, status=502)

        newsletter.status = Newsletter.Status.SENT
        newsletter.sent_at = timezone.now()
        newsletter.save()

        return Response({
            "detail": f"Newsletter sent to {active_count} subscriber(s).",
            "sent_to": active_count,
        })
