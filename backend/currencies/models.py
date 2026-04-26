from django.db import models


class Currency(models.Model):
    code       = models.CharField(max_length=10, unique=True, help_text="e.g. XAF, USD, EUR")
    name       = models.CharField(max_length=100, help_text="e.g. CFA Franc")
    symbol     = models.CharField(max_length=10, help_text="e.g. FCFA, $, €")
    rate       = models.DecimalField(
        max_digits=18, decimal_places=6, default=1,
        help_text="Exchange rate relative to XAF (base). XAF=1, USD≈600, EUR≈655"
    )
    is_active  = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_default", "code"]
        verbose_name_plural = "currencies"

    def save(self, *args, **kwargs):
        if self.is_default:
            Currency.objects.exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} — {self.name} ({self.symbol})"
