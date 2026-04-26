from django.urls import path
from .views import ShippingAddressListCreateView, ShippingAddressDetailView

urlpatterns = [
    path("",        ShippingAddressListCreateView.as_view()),
    path("<int:pk>/", ShippingAddressDetailView.as_view()),
]
