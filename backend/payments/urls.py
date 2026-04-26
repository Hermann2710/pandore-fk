from django.urls import path
from .views import (
    PaymentMethodListView,
    ConfirmPaymentView,
    AdminPaymentMethodListCreateView,
    AdminPaymentMethodDetailView,
    AdminPaymentListView,
)

urlpatterns = [
    path("methods/",                        PaymentMethodListView.as_view()),
    path("<int:order_id>/confirm/",         ConfirmPaymentView.as_view()),
    path("admin/methods/",                  AdminPaymentMethodListCreateView.as_view()),
    path("admin/methods/<int:pk>/",         AdminPaymentMethodDetailView.as_view()),
    path("admin/payments/",                 AdminPaymentListView.as_view()),
]
