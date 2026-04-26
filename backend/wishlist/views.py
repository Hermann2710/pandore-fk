from rest_framework.views import APIView
from rest_framework.response import Response

from users.models import Wishlist
from catalog.models import Product
from .serializers import WishlistSerializer


class WishlistView(APIView):
    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return Response(WishlistSerializer(wishlist, context={"request": request}).data)

    def post(self, request):
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"detail": "product_id required."}, status=400)
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=404)

        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        if wishlist.products.filter(pk=product_id).exists():
            wishlist.products.remove(product)
            action = "removed"
        else:
            wishlist.products.add(product)
            action = "added"

        return Response({"action": action, **WishlistSerializer(wishlist, context={"request": request}).data})
