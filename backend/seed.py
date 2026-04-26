"""
Run with: python manage.py shell < seed.py
Creates demo users, categories, tags, and products so the app works out of the box.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pandore.settings")
django.setup()

from users.models import User
from catalog.models import Category, Tag, AttributeKey, Product, ProductAttribute

# ── Users ─────────────────────────────────────────────────────────────────────
admin = User.objects.create_superuser("admin", "admin@pandore.com", "admin123")
admin.role = "admin"
admin.save()

delivery1 = User.objects.create_user("delivery1", "d1@pandore.com", "delivery123")
delivery1.role = "delivery"
delivery1.phone = "+1 555 0101"
delivery1.save()

delivery2 = User.objects.create_user("delivery2", "d2@pandore.com", "delivery123")
delivery2.role = "delivery"
delivery2.phone = "+1 555 0202"
delivery2.save()

customer1 = User.objects.create_user("customer1", "c1@pandore.com", "customer123")
customer1.role = "customer"
customer1.save()

print("[OK] Users created")

# ── Categories ────────────────────────────────────────────────────────────────
cats = {}
for name, slug in [("Accessories", "accessories"), ("Apparel", "apparel"), ("Fragrance", "fragrance"), ("Jewelry", "jewelry")]:
    cats[slug] = Category.objects.create(name=name, slug=slug)

print("[OK] Categories created")

# ── Tags ──────────────────────────────────────────────────────────────────────
tags = {}
for name, slug in [("New Arrival", "new-arrival"), ("Bestseller", "bestseller"), ("Limited Edition", "limited-edition"), ("Eco-Friendly", "eco-friendly")]:
    tags[slug] = Tag.objects.create(name=name, slug=slug)

print("[OK] Tags created")

# ── Attribute keys ────────────────────────────────────────────────────────────
color_key = AttributeKey.objects.create(name="Color")
material_key = AttributeKey.objects.create(name="Material")
size_key = AttributeKey.objects.create(name="Size")

# ── Products ──────────────────────────────────────────────────────────────────
products_data = [
    {"name": "Emerald Silk Scarf", "slug": "emerald-silk-scarf", "price": "289.00", "stock": 15, "category": "accessories", "tags": ["new-arrival", "limited-edition"], "attrs": [("Color", "Emerald"), ("Material", "Pure Silk")]},
    {"name": "Obsidian Leather Wallet", "slug": "obsidian-leather-wallet", "price": "195.00", "stock": 30, "category": "accessories", "tags": ["bestseller"], "attrs": [("Color", "Black"), ("Material", "Full-Grain Leather")]},
    {"name": "Cashmere Overcoat", "slug": "cashmere-overcoat", "price": "1250.00", "stock": 8, "category": "apparel", "tags": ["limited-edition"], "attrs": [("Color", "Slate Grey"), ("Material", "100% Cashmere"), ("Size", "M / L / XL")]},
    {"name": "Oud Noir Parfum", "slug": "oud-noir-parfum", "price": "320.00", "stock": 20, "category": "fragrance", "tags": ["bestseller", "new-arrival"], "attrs": [("Size", "100ml")]},
    {"name": "Rose Gold Bracelet", "slug": "rose-gold-bracelet", "price": "875.00", "stock": 5, "category": "jewelry", "tags": ["limited-edition", "bestseller"], "attrs": [("Material", "18K Rose Gold")]},
    {"name": "Merino Turtleneck", "slug": "merino-turtleneck", "price": "340.00", "stock": 25, "category": "apparel", "tags": ["eco-friendly"], "attrs": [("Color", "Ivory"), ("Material", "Merino Wool")]},
]

attr_key_map = {"Color": color_key, "Material": material_key, "Size": size_key}

for pd in products_data:
    p = Product.objects.create(
        name=pd["name"], slug=pd["slug"],
        description=f"A premium {pd['name'].lower()} crafted with exceptional attention to detail.",
        price=pd["price"], stock=pd["stock"],
        category=cats[pd["category"]], is_active=True,
    )
    for tag_slug in pd["tags"]:
        p.tags.add(tags[tag_slug])
    for key_name, value in pd["attrs"]:
        ProductAttribute.objects.create(product=p, key=attr_key_map[key_name], value=value)

print("[OK] Products created")
print("\nSeed complete! Start the server with: python manage.py runserver")
