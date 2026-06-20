from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/",      include("authentication.urls")),
    path("api/users/",     include("users.urls")),
    path("api/addresses/", include("addresses.urls")),
    path("api/wishlist/",  include("wishlist.urls")),
    path("api/payments/",  include("payments.urls")),
    path("api/newsletter/", include("newsletter.urls")),
    path("api/currencies/",   include("currencies.urls")),
    path("api/site-config/",   include("site_config.urls")),
    path("api/catalog/",   include("catalog.urls")),
    path("api/orders/",    include("orders.urls")),
]
