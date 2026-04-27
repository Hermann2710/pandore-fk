from django.urls import path
from .views import (
    CustomerOrderListView, CheckoutView, CustomerCancelOrderView,
    AdminOrderListView, AdminAssignOrderView,
    DeliveryQueueView, DeliveryUpdateStatusView,
)

urlpatterns = [
    # Customer
    path("my-orders/",                        CustomerOrderListView.as_view()),
    path("checkout/",                          CheckoutView.as_view()),
    path("<int:order_id>/cancel/",             CustomerCancelOrderView.as_view()),
    # Admin
    path("admin/",                             AdminOrderListView.as_view()),
    path("admin/<int:order_id>/assign/",       AdminAssignOrderView.as_view()),
    # Delivery
    path("delivery/queue/",                    DeliveryQueueView.as_view()),
    path("delivery/<int:order_id>/status/",    DeliveryUpdateStatusView.as_view()),
]
