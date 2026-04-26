from rest_framework.views import APIView
from rest_framework.response import Response

from users.models import ShippingAddress
from .serializers import ShippingAddressSerializer


class ShippingAddressListCreateView(APIView):
    def get(self, request):
        addresses = ShippingAddress.objects.filter(user=request.user)
        return Response(ShippingAddressSerializer(addresses, many=True).data)

    def post(self, request):
        serializer = ShippingAddressSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)


class ShippingAddressDetailView(APIView):
    def _get(self, request, pk):
        try:
            return ShippingAddress.objects.get(pk=pk, user=request.user)
        except ShippingAddress.DoesNotExist:
            return None

    def patch(self, request, pk):
        address = self._get(request, pk)
        if not address:
            return Response(status=404)
        serializer = ShippingAddressSerializer(address, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        address = self._get(request, pk)
        if not address:
            return Response(status=404)
        address.delete()
        return Response(status=204)
