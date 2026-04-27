from rest_framework.views import APIView
from rest_framework.response import Response

from core.permissions import IsAdminRole
from .models import User
from .serializers import UserSerializer, UserProfileUpdateSerializer, ChangePasswordSerializer


class UpdateProfileView(APIView):
    def patch(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class DeleteAvatarView(APIView):
    def delete(self, request):
        user = request.user
        if user.avatar:
            user.avatar.delete(save=False)
            user.avatar = None
            user.save()
        return Response({"detail": "Avatar removed."})


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


class DeliveryPersonnelListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        qs = User.objects.filter(role=User.Role.DELIVERY)
        return Response(UserSerializer(qs, many=True).data)


class AdminUserListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        qs = User.objects.all().order_by("date_joined")
        return Response(UserSerializer(qs, many=True).data)


class AdminUserRoleUpdateView(APIView):
    permission_classes = [IsAdminRole]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        allowed = {"role", "phone", "is_active"}
        data = {k: v for k, v in request.data.items() if k in allowed}
        if "role" in data and data["role"] not in User.Role.values:
            return Response({"detail": "Invalid role."}, status=400)
        for field, value in data.items():
            setattr(user, field, value)
        user.save()
        return Response(UserSerializer(user).data)


class AdminUserDeleteView(APIView):
    permission_classes = [IsAdminRole]

    def delete(self, request, user_id):
        if request.user.pk == user_id:
            return Response({"detail": "You cannot delete your own account."}, status=400)
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)
        user.delete()
        return Response(status=204)
