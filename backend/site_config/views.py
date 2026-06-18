from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions

from .models import SiteSettings, SocialLink
from .serializers import SiteSettingsSerializer, SiteSettingsWriteSerializer, SocialLinkSerializer
from core.permissions import IsAdminRole


class SiteSettingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = SiteSettings.get()
        return Response(SiteSettingsSerializer(settings, context={"request": request}).data)


class AdminSiteSettingsView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        settings = SiteSettings.get()
        return Response(SiteSettingsSerializer(settings, context={"request": request}).data)

    def patch(self, request):
        settings = SiteSettings.get()
        serializer = SiteSettingsWriteSerializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(SiteSettingsSerializer(settings, context={"request": request}).data)


class AdminDeleteLogoView(APIView):
    permission_classes = [IsAdminRole]

    def delete(self, request):
        settings = SiteSettings.get()
        if settings.logo:
            settings.logo.delete(save=False)
            settings.logo = None # type: ignore
            settings.save()
        return Response({"detail": "Logo removed."})


class AdminSocialLinkListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = SocialLinkSerializer

    def get_queryset(self): # type: ignore
        return SocialLink.objects.filter(site=SiteSettings.get())

    def perform_create(self, serializer):
        serializer.save(site=SiteSettings.get())


class AdminSocialLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminRole]
    serializer_class = SocialLinkSerializer

    def get_queryset(self): # type: ignore
        return SocialLink.objects.filter(site=SiteSettings.get())
