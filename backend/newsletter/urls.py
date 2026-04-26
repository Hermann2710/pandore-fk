from django.urls import path
from .views import (
    SubscribeView, UnsubscribeView, CheckSubscriptionView,
    AdminSubscriberListView,
    AdminNewsletterListCreateView, AdminNewsletterDetailView, AdminSendNewsletterView,
)

urlpatterns = [
    path("subscribe/",              SubscribeView.as_view()),
    path("unsubscribe/",            UnsubscribeView.as_view()),
    path("check/",                  CheckSubscriptionView.as_view()),
    path("admin/subscribers/",      AdminSubscriberListView.as_view()),
    path("admin/newsletters/",      AdminNewsletterListCreateView.as_view()),
    path("admin/newsletters/<int:pk>/",      AdminNewsletterDetailView.as_view()),
    path("admin/newsletters/<int:pk>/send/", AdminSendNewsletterView.as_view()),
]
