from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/",      include("authentication.urls")),
    path("api/users/",     include("users.urls")),
    path("api/addresses/", include("addresses.urls")),
    path("api/wishlist/",  include("wishlist.urls")),
    path("api/catalog/",   include("catalog.urls")),
    path("api/orders/",    include("orders.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
