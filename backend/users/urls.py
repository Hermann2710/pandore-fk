from django.urls import path
from .views import RegisterView, LoginView, LogoutView, RefreshView, MeView, DeliveryPersonnelListView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("refresh/", RefreshView.as_view()),
    path("me/", MeView.as_view()),
    path("delivery-personnel/", DeliveryPersonnelListView.as_view()),
]
