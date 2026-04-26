from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, RefreshView, MeView,
    UpdateProfileView, ChangePasswordView,
    ShippingAddressListCreateView, ShippingAddressDetailView,
    WishlistView,
    DeliveryPersonnelListView,
    AdminUserListView, AdminUserRoleUpdateView, AdminUserDeleteView,
)

urlpatterns = [
    path("register/",         RegisterView.as_view()),
    path("login/",            LoginView.as_view()),
    path("logout/",           LogoutView.as_view()),
    path("refresh/",          RefreshView.as_view()),
    path("me/",               MeView.as_view()),
    path("profile/",          UpdateProfileView.as_view()),
    path("password/",         ChangePasswordView.as_view()),
    path("addresses/",        ShippingAddressListCreateView.as_view()),
    path("addresses/<int:pk>/", ShippingAddressDetailView.as_view()),
    path("wishlist/",         WishlistView.as_view()),
    path("delivery-personnel/",          DeliveryPersonnelListView.as_view()),
    path("admin/users/",                 AdminUserListView.as_view()),
    path("admin/users/<int:user_id>/",   AdminUserRoleUpdateView.as_view()),
    path("admin/users/<int:user_id>/delete/", AdminUserDeleteView.as_view()),
]
