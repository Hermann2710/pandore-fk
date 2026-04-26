from rest_framework import generics, permissions
from .models import Currency
from .serializers import CurrencySerializer
from core.permissions import IsAdminRole


class CurrencyListView(generics.ListAPIView):
    """Public — returns all active currencies."""
    serializer_class = CurrencySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Currency.objects.filter(is_active=True)


class AdminCurrencyListCreateView(generics.ListCreateAPIView):
    serializer_class = CurrencySerializer
    permission_classes = [IsAdminRole]
    queryset = Currency.objects.all()


class AdminCurrencyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CurrencySerializer
    permission_classes = [IsAdminRole]
    queryset = Currency.objects.all()
