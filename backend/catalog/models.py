from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class AttributeKey(models.Model):
    """e.g. 'Color', 'Size', 'Material' — reusable across products."""
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="products/", null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    tags = models.ManyToManyField(Tag, blank=True, related_name="products")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ProductAttribute(models.Model):
    """
    Flexible key-value attributes per product.
    e.g. Product: 'Silk Scarf' → key: 'Color', value: 'Emerald'
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="attributes")
    key = models.ForeignKey(AttributeKey, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)

    class Meta:
        unique_together = ("product", "key")

    def __str__(self):
        return f"{self.product.name} — {self.key.name}: {self.value}"
