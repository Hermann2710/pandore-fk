from django.db import models


class SiteSettings(models.Model):
    """Singleton — only one row ever exists (pk=1)."""
    site_name         = models.CharField(max_length=100, default="Pandore")
    tagline           = models.CharField(max_length=200, blank=True, default="Luxury Store")
    description       = models.TextField(blank=True)
    logo = models.ImageField(upload_to="settings/", null=True, blank=True, max_length=500)
    email             = models.EmailField(blank=True)
    phone             = models.CharField(max_length=30, blank=True)
    address           = models.CharField(max_length=255, blank=True)
    city              = models.CharField(max_length=100, blank=True)
    country           = models.CharField(max_length=100, blank=True, default="Cameroon")
    shipping_price    = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=50000)

    class Meta:
        verbose_name = "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"{self.site_name} Settings"


class SocialLink(models.Model):
    site     = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name="social_links", null=True, blank=True)
    platform = models.CharField(max_length=50, help_text="e.g. Facebook, Instagram, Twitter")
    url      = models.URLField()
    icon     = models.CharField(max_length=50, blank=True, help_text="Lucide icon name e.g. 'facebook'")
    order    = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "platform"]

    def __str__(self):
        return f"{self.platform} — {self.url}"
