from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions

from .models import Subscriber, Newsletter
from .serializers import SubscriberSerializer, NewsletterSerializer, NewsletterWriteSerializer
from core.permissions import IsAdminRole


# ── Public ────────────────────────────────────────────────────────────────────

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


# ── Admin ─────────────────────────────────────────────────────────────────────

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

        active_count = Subscriber.objects.filter(is_active=True).count()

        # Simulation — in production this would trigger an email queue
        newsletter.status = Newsletter.Status.SENT
        newsletter.sent_at = timezone.now()
        newsletter.save()

        return Response({
            "detail": f"Newsletter sent to {active_count} subscriber(s).",
            "sent_to": active_count,
        })
