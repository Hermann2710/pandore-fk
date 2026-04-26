from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, RefreshView, MeView,
    DeliveryPersonnelListView,
    AdminUserListView, AdminUserRoleUpdateView, AdminUserDeleteView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("refresh/", RefreshView.as_view()),
    path("me/", MeView.as_view()),
    path("delivery-personnel/", DeliveryPersonnelListView.as_view()),
    # Admin — user management
    path("admin/users/", AdminUserListView.as_view()),
    path("admin/users/<int:user_id>/", AdminUserRoleUpdateView.as_view()),
    path("admin/users/<int:user_id>/delete/", AdminUserDeleteView.as_view()),
]
