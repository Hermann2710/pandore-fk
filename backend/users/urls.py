from django.urls import path
from .views import (
    UpdateProfileView, ChangePasswordView,
    DeliveryPersonnelListView,
    AdminUserListView, AdminUserRoleUpdateView, AdminUserDeleteView,
)

urlpatterns = [
    path("profile/",                          UpdateProfileView.as_view()),
    path("password/",                         ChangePasswordView.as_view()),
    path("delivery-personnel/",               DeliveryPersonnelListView.as_view()),
    path("admin/users/",                      AdminUserListView.as_view()),
    path("admin/users/<int:user_id>/",        AdminUserRoleUpdateView.as_view()),
    path("admin/users/<int:user_id>/delete/", AdminUserDeleteView.as_view()),
]
