"""
Catalog-only seed — run with: python manage.py shell < seed_catalog.py
Safe to run even if users already exist.
"""
from catalog.models import Category, Tag, AttributeKey, Product, ProductAttribute

# Clean slate for catalog
ProductAttribute.objects.all().delete()
Product.objects.all().delete()
Tag.objects.all().delete()
Category.objects.all().delete()
AttributeKey.objects.all().delete()

# Categories
cats = {}
for name, slug, desc in [
    ("Accessories", "accessories", "Refined everyday carry"),
    ("Apparel",     "apparel",     "Timeless wardrobe essentials"),
    ("Fragrance",   "fragrance",   "Rare olfactory compositions"),
    ("Jewelry",     "jewelry",     "Handcrafted fine jewelry"),
]:
    cats[slug] = Category.objects.create(name=name, slug=slug, description=desc)

# Tags
tags = {}
for name, slug in [
    ("New Arrival",     "new-arrival"),
    ("Bestseller",      "bestseller"),
    ("Limited Edition", "limited-edition"),
    ("Eco-Friendly",    "eco-friendly"),
]:
    tags[slug] = Tag.objects.create(name=name, slug=slug)

# Attribute keys
color_key    = AttributeKey.objects.create(name="Color")
material_key = AttributeKey.objects.create(name="Material")
size_key     = AttributeKey.objects.create(name="Size")
attr_map     = {"Color": color_key, "Material": material_key, "Size": size_key}

# Products
products_data = [
    {
        "name": "Emerald Silk Scarf",
        "slug": "emerald-silk-scarf",
        "price": "289.00", "stock": 15,
        "category": "accessories",
        "tags": ["new-arrival", "limited-edition"],
        "attrs": [("Color", "Emerald"), ("Material", "Pure Silk")],
        "desc": "Hand-rolled edges, woven in Lyon. A statement piece that transcends seasons.",
    },
    {
        "name": "Obsidian Leather Wallet",
        "slug": "obsidian-leather-wallet",
        "price": "195.00", "stock": 30,
        "category": "accessories",
        "tags": ["bestseller"],
        "attrs": [("Color", "Black"), ("Material", "Full-Grain Leather")],
        "desc": "Vegetable-tanned full-grain leather. Ages beautifully, like all great things.",
    },
    {
        "name": "Cashmere Overcoat",
        "slug": "cashmere-overcoat",
        "price": "1250.00", "stock": 8,
        "category": "apparel",
        "tags": ["limited-edition"],
        "attrs": [("Color", "Slate Grey"), ("Material", "100% Cashmere"), ("Size", "M / L / XL")],
        "desc": "Double-faced Mongolian cashmere. Structured silhouette, uncompromising warmth.",
    },
    {
        "name": "Oud Noir Parfum",
        "slug": "oud-noir-parfum",
        "price": "320.00", "stock": 20,
        "category": "fragrance",
        "tags": ["bestseller", "new-arrival"],
        "attrs": [("Size", "100ml")],
        "desc": "Dark oud, smoked vetiver, and a whisper of rose. Bottled in Grasse.",
    },
    {
        "name": "Rose Gold Bracelet",
        "slug": "rose-gold-bracelet",
        "price": "875.00", "stock": 5,
        "category": "jewelry",
        "tags": ["limited-edition", "bestseller"],
        "attrs": [("Material", "18K Rose Gold")],
        "desc": "Handcrafted by Parisian artisans. Each link individually polished.",
    },
    {
        "name": "Merino Turtleneck",
        "slug": "merino-turtleneck",
        "price": "340.00", "stock": 25,
        "category": "apparel",
        "tags": ["eco-friendly"],
        "attrs": [("Color", "Ivory"), ("Material", "Merino Wool"), ("Size", "XS / S / M / L")],
        "desc": "Responsibly sourced New Zealand merino. Feather-light, endlessly versatile.",
    },
    {
        "name": "Amber Crystal Perfume",
        "slug": "amber-crystal-perfume",
        "price": "410.00", "stock": 12,
        "category": "fragrance",
        "tags": ["new-arrival"],
        "attrs": [("Size", "50ml")],
        "desc": "Warm amber, sandalwood, and vanilla absolute. A second skin.",
    },
    {
        "name": "Platinum Chain Necklace",
        "slug": "platinum-chain-necklace",
        "price": "1450.00", "stock": 3,
        "category": "jewelry",
        "tags": ["limited-edition"],
        "attrs": [("Material", "950 Platinum"), ("Size", "45cm")],
        "desc": "Forged in 950 platinum. Minimalist geometry, maximum presence.",
    },
]

for pd in products_data:
    p = Product.objects.create(
        name=pd["name"], slug=pd["slug"],
        description=pd["desc"],
        price=pd["price"], stock=pd["stock"],
        category=cats[pd["category"]], is_active=True,
    )
    for tag_slug in pd["tags"]:
        p.tags.add(tags[tag_slug])
    for key_name, value in pd["attrs"]:
        ProductAttribute.objects.create(product=p, key=attr_map[key_name], value=value)

print("Catalog seeded: %d categories, %d tags, %d products" % (
    Category.objects.count(), Tag.objects.count(), Product.objects.count()
))
