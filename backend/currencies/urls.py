from django.urls import path
from .views import CurrencyListView, AdminCurrencyListCreateView, AdminCurrencyDetailView

urlpatterns = [
    path("",                    CurrencyListView.as_view()),
    path("admin/",              AdminCurrencyListCreateView.as_view()),
    path("admin/<int:pk>/",     AdminCurrencyDetailView.as_view()),
]
