from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, RefreshView, MeView,
    UpdateProfileView, ChangePasswordView,
    ShippingAddressListCreateView, ShippingAddressDetailView,
    DeliveryPersonnelListView,
    AdminUserListView, AdminUserRoleUpdateView, AdminUserDeleteView,
)

urlpatterns = [
    path("register/",         RegisterView.as_view()),
    path("login/",            LoginView.as_view()),
    path("logout/",           LogoutView.as_view()),
    path("refresh/",          RefreshView.as_view()),
    path("me/",               MeView.as_view()),
    # Profile self-service
    path("profile/",          UpdateProfileView.as_view()),
    path("password/",         ChangePasswordView.as_view()),
    # Shipping addresses
    path("addresses/",        ShippingAddressListCreateView.as_view()),
    path("addresses/<int:pk>/", ShippingAddressDetailView.as_view()),
    # Admin
    path("delivery-personnel/",          DeliveryPersonnelListView.as_view()),
    path("admin/users/",                 AdminUserListView.as_view()),
    path("admin/users/<int:user_id>/",   AdminUserRoleUpdateView.as_view()),
    path("admin/users/<int:user_id>/delete/", AdminUserDeleteView.as_view()),
]
