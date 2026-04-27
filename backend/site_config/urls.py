from django.urls import path
from .views import (
    SiteSettingsView,
    AdminSiteSettingsView,
    AdminDeleteLogoView,
    AdminSocialLinkListCreateView,
    AdminSocialLinkDetailView,
)

urlpatterns = [
    path("",                        SiteSettingsView.as_view()),
    path("admin/",                  AdminSiteSettingsView.as_view()),
    path("admin/logo/",             AdminDeleteLogoView.as_view()),
    path("admin/social/",           AdminSocialLinkListCreateView.as_view()),
    path("admin/social/<int:pk>/",  AdminSocialLinkDetailView.as_view()),
]
