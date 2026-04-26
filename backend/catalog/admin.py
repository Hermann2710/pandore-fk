from django.contrib import admin
from .models import Category, Tag, AttributeKey, Product, ProductAttribute

admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(AttributeKey)

class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "stock", "is_active"]
    list_filter = ["category", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductAttributeInline]
