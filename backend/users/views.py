from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import User, ShippingAddress
from .serializers import (
    RegisterSerializer, UserSerializer,
    UserProfileUpdateSerializer, ChangePasswordSerializer,
    ShippingAddressSerializer,
)


def _set_auth_cookies(response, refresh):
    """Helper: stamp both JWT cookies onto a response object."""
    access = str(refresh.access_token)
    opts = dict(
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(settings.AUTH_COOKIE_ACCESS, access, max_age=60 * 30, **opts)
    response.set_cookie(
        settings.AUTH_COOKIE_REFRESH, str(refresh), max_age=60 * 60 * 24 * 7, **opts
    )


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        _set_auth_cookies(response, refresh)
        return response


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials."}, status=400)

        if not user.check_password(password):
            return Response({"detail": "Invalid credentials."}, status=400)

        refresh = RefreshToken.for_user(user)
        response = Response(UserSerializer(user).data)
        _set_auth_cookies(response, refresh)
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response({"detail": "Logged out."})
        response.delete_cookie(settings.AUTH_COOKIE_ACCESS)
        response.delete_cookie(settings.AUTH_COOKIE_REFRESH)
        return response


class RefreshView(APIView):
    """
    Silent token refresh — the frontend calls this when a 401 is received.
    Reads the refresh cookie, issues a new access token cookie.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        raw = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if not raw:
            return Response({"detail": "No refresh token."}, status=401)
        try:
            refresh = RefreshToken(raw)
        except TokenError:
            return Response({"detail": "Invalid refresh token."}, status=401)

        response = Response({"detail": "Token refreshed."})
        _set_auth_cookies(response, refresh)
        return response


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UpdateProfileView(APIView):
    """
    Authenticated users update their own profile.
    Supports multipart/form-data for avatar upload.
    """
    def patch(self, request):
        serializer = UserProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["current_password"]):
            return Response({"detail": "Current password is incorrect."}, status=400)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password updated successfully."})


class ShippingAddressListCreateView(APIView):
    """List all saved addresses or create a new one."""

    def get(self, request):
        addresses = ShippingAddress.objects.filter(user=request.user)
        return Response(ShippingAddressSerializer(addresses, many=True).data)

    def post(self, request):
        serializer = ShippingAddressSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)


class ShippingAddressDetailView(APIView):
    """Retrieve, update or delete a single address."""

    def _get_address(self, request, pk):
        try:
            return ShippingAddress.objects.get(pk=pk, user=request.user)
        except ShippingAddress.DoesNotExist:
            return None

    def patch(self, request, pk):
        address = self._get_address(request, pk)
        if not address:
            return Response(status=404)
        serializer = ShippingAddressSerializer(address, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        address = self._get_address(request, pk)
        if not address:
            return Response(status=404)
        address.delete()
        return Response(status=204)


class DeliveryPersonnelListView(APIView):
    """Admin-only: list all delivery users for the assignment dropdown."""

    def get(self, request):
        if not request.user.is_admin_role:
            return Response(status=403)
        qs = User.objects.filter(role=User.Role.DELIVERY)
        return Response(UserSerializer(qs, many=True).data)


class AdminUserListView(APIView):
    """Admin-only: list every user on the platform with their role."""

    def get(self, request):
        if not request.user.is_admin_role:
            return Response(status=403)
        qs = User.objects.all().order_by("date_joined")
        return Response(UserSerializer(qs, many=True).data)


class AdminUserRoleUpdateView(APIView):
    """
    Admin-only: change a user's role or active status.
    Deliberately separate from the register flow — role assignment
    is a privileged action, not something users do themselves.
    """

    def patch(self, request, user_id):
        if not request.user.is_admin_role:
            return Response(status=403)
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        # Only allow updating role, phone, and is_active — nothing else
        allowed = {"role", "phone", "is_active"}
        data = {k: v for k, v in request.data.items() if k in allowed}

        if "role" in data and data["role"] not in User.Role.values:
            return Response({"detail": "Invalid role."}, status=400)

        for field, value in data.items():
            setattr(user, field, value)
        user.save()
        return Response(UserSerializer(user).data)


class AdminUserDeleteView(APIView):
    """Admin-only: delete a user account."""

    def delete(self, request, user_id):
        if not request.user.is_admin_role:
            return Response(status=403)
        if request.user.pk == user_id:
            return Response({"detail": "You cannot delete your own account."}, status=400)
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)
        user.delete()
        return Response(status=204)
