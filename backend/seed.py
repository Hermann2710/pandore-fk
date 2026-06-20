# -*- coding: utf-8 -*-
"""
Run with: python manage.py shell < seed.py
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pandore.settings")
django.setup()

import cloudinary.uploader
from catalog.models import Category, Tag, AttributeKey, Product, ProductAttribute


def upload_url(url, folder):
    try:
        result = cloudinary.uploader.upload(
            url,
            folder=folder,
            use_filename=False,
            overwrite=True,
            resource_type="image",
        )
        return result["secure_url"]
    except Exception as e:
        print(f"  ⚠ Upload failed: {e}")
        return None


# ── Reset ─────────────────────────────────────────────────────────────────────
ProductAttribute.objects.all().delete()
Product.objects.all().delete()
Tag.objects.all().delete()
Category.objects.all().delete()
AttributeKey.objects.all().delete()

# ── Categories ────────────────────────────────────────────────────────────────
categories = {}
for name, slug, desc in [
    ("Smartphones & Tablettes",      "smartphones-tablettes",      "Smartphones, tablettes et accessoires mobiles."),
    ("Ordinateurs & Périphériques",  "ordinateurs-peripheriques",  "Laptops, claviers, souris, hubs et SSD portables."),
    ("Audio & Son",                  "audio-son",                  "Casques, écouteurs, enceintes et barres de son."),
    ("Photo & Vidéo",                "photo-video",                "Appareils photo, caméras d'action et drones."),
    ("TV & Home Cinéma",             "tv-home-cinema",             "Téléviseurs 4K, projecteurs et barres de son."),
    ("Jeux Vidéo",                   "jeux-video",                 "Consoles, manettes et accessoires gaming."),
    ("Maison Connectée",             "maison-connectee",           "Ampoules connectées, hubs domotiques, thermostats et caméras."),
    ("Accessoires & Câbles",         "accessoires-cables",         "Chargeurs, câbles, protections et adaptateurs."),
]:
    categories[slug] = Category.objects.create(name=name, slug=slug, description=desc)

# ── Tags ──────────────────────────────────────────────────────────────────────
for name, slug in [
    ("Nouveauté",       "new-arrival"),
    ("Bestseller",      "bestseller"),
    ("Édition Limitée", "limited-edition"),
    ("Essentiel Tech",  "tech-essentials"),
    ("Promo",           "promo"),
]:
    Tag.objects.get_or_create(name=name, slug=slug)

tags = {t.slug: t for t in Tag.objects.all()}

# ── Attribute keys ────────────────────────────────────────────────────────────
attr_map = {k: AttributeKey.objects.create(name=k)
            for k in ("Couleur", "Matière", "Stockage", "Marque", "Connectivité")}

# ── Products ──────────────────────────────────────────────────────────────────
products_data = [
    # Smartphones & Tablettes
    {
        "name": "Smartphone Nova Pro X",
        "slug": "smartphone-nova-pro-x",
        "price": "420000",
        "stock": 50,
        "category": "smartphones-tablettes",
        "tags": ["new-arrival", "bestseller"],
        "attrs": [("Marque", "Nova"), ("Couleur", "Noir Minuit"), ("Stockage", "256 Go")],
        "description": "Smartphone haut de gamme avec triple capteur et charge rapide 65 W.",
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200",
    },
    {
        "name": 'Tablette Air S 10"',
        "slug": "tablette-air-s-10",
        "price": "195000",
        "stock": 30,
        "category": "smartphones-tablettes",
        "tags": ["new-arrival"],
        "attrs": [("Marque", "TabNova"), ("Couleur", "Bleu"), ("Stockage", "128 Go")],
        "description": "Tablette légère idéale pour le travail, la lecture et les médias.",
        "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200",
    },
    {
        "name": "Montre Connectée Series 5",
        "slug": "montre-connectee-series-5",
        "price": "89000",
        "stock": 60,
        "category": "smartphones-tablettes",
        "tags": ["tech-essentials", "bestseller"],
        "attrs": [("Marque", "TimeTech"), ("Couleur", "Minuit"), ("Matière", "Titane")],
        "description": "Smartwatch sport avec suivi du sommeil et notifications mobiles.",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
    },
    {
        "name": "Bracelet Connecté FitOne",
        "slug": "bracelet-connecte-fitone",
        "price": "28000",
        "stock": 70,
        "category": "smartphones-tablettes",
        "tags": ["new-arrival"],
        "attrs": [("Marque", "PulseTech"), ("Couleur", "Graphite"), ("Matière", "Silicone")],
        "description": "Tracker bien-être avec fréquence cardiaque et GPS intégré.",
        "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200",
    },
    # Ordinateurs & Périphériques
    {
        "name": "Laptop Ultra 13",
        "slug": "laptop-ultra-13",
        "price": "720000",
        "stock": 25,
        "category": "ordinateurs-peripheriques",
        "tags": ["bestseller"],
        "attrs": [("Marque", "Aceron"), ("Couleur", "Argent"), ("Stockage", "512 Go SSD")],
        "description": "Ultrabook fin et léger pour la productivité et la créativité.",
        "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200",
    },
    {
        "name": "Clavier Mécanique MK Pro",
        "slug": "clavier-mecanique-mk-pro",
        "price": "42000",
        "stock": 70,
        "category": "ordinateurs-peripheriques",
        "tags": ["tech-essentials"],
        "attrs": [("Marque", "KeyFlow"), ("Couleur", "Noir"), ("Matière", "Aluminium")],
        "description": "Clavier mécanique tactile conçu pour la vitesse et le confort.",
        "image": "https://images.unsplash.com/photo-1511467686857-81a5f8b9c5d5?w=1200",
    },
    {
        "name": "Souris Sans Fil Pro",
        "slug": "souris-sans-fil-pro",
        "price": "18500",
        "stock": 150,
        "category": "ordinateurs-peripheriques",
        "tags": ["bestseller"],
        "attrs": [("Marque", "ClickTech"), ("Couleur", "Graphite"), ("Matière", "Plastique")],
        "description": "Souris ergonomique sans fil avec suivi de précision et clics silencieux.",
        "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200",
    },
    {
        "name": "SSD Portable 1 To",
        "slug": "ssd-portable-1to",
        "price": "58000",
        "stock": 200,
        "category": "ordinateurs-peripheriques",
        "tags": ["bestseller"],
        "attrs": [("Marque", "DataDrive"), ("Couleur", "Gris"), ("Stockage", "1 To")],
        "description": "Stockage externe rapide avec port USB-C pour sauvegardes quotidiennes.",
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200",
    },
    {
        "name": "Hub USB-C 7-en-1",
        "slug": "hub-usbc-7en1",
        "price": "22000",
        "stock": 120,
        "category": "ordinateurs-peripheriques",
        "tags": ["bestseller"],
        "attrs": [("Marque", "DockPlus"), ("Couleur", "Argent"), ("Matière", "Aluminium")],
        "description": "Hub compact avec HDMI, USB-A et ports de charge PD.",
        "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200",
    },
    # Audio & Son
    {
        "name": "Casque Sans Fil Max ANC",
        "slug": "casque-sans-fil-max-anc",
        "price": "95000",
        "stock": 40,
        "category": "audio-son",
        "tags": ["bestseller", "tech-essentials"],
        "attrs": [("Marque", "AudioOne"), ("Couleur", "Argent"), ("Matière", "Aluminium")],
        "description": "Casque circum-auriculaire premium avec réduction de bruit active.",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
    },
    {
        "name": "Écouteurs True Wireless Mini",
        "slug": "ecouteurs-true-wireless-mini",
        "price": "38000",
        "stock": 120,
        "category": "audio-son",
        "tags": ["bestseller", "tech-essentials"],
        "attrs": [("Marque", "SoundPulse"), ("Couleur", "Blanc"), ("Connectivité", "Bluetooth 5.3")],
        "description": "Écouteurs compacts avec longue autonomie et appels cristallins.",
        "image": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=1200",
    },
    {
        "name": "Enceinte Bluetooth Boom",
        "slug": "enceinte-bluetooth-boom",
        "price": "32000",
        "stock": 80,
        "category": "audio-son",
        "tags": ["bestseller"],
        "attrs": [("Marque", "SoundWave"), ("Couleur", "Noir"), ("Matière", "Tissu")],
        "description": "Enceinte portable avec son riche et design imperméable.",
        "image": "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=1200",
    },
    # Photo & Vidéo
    {
        "name": "Appareil Photo Hybride M",
        "slug": "appareil-photo-hybride-m",
        "price": "540000",
        "stock": 15,
        "category": "photo-video",
        "tags": ["new-arrival"],
        "attrs": [("Marque", "Lumix"), ("Couleur", "Noir"), ("Stockage", "128 Go")],
        "description": "Hybride compact pour photos nettes et vidéos 4K.",
        "image": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200",
    },
    {
        "name": "Caméra d'Action GoShot 4K",
        "slug": "camera-action-goshot-4k",
        "price": "88000",
        "stock": 45,
        "category": "photo-video",
        "tags": ["tech-essentials"],
        "attrs": [("Marque", "ActionPro"), ("Couleur", "Noir"), ("Matière", "Plastique Caoutchouté")],
        "description": "Caméra d'aventure étanche avec stabilisation intégrée.",
        "image": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200",
    },
    {
        "name": "Drone Aerial X 4K",
        "slug": "drone-aerial-x-4k",
        "price": "480000",
        "stock": 8,
        "category": "photo-video",
        "tags": ["limited-edition"],
        "attrs": [("Marque", "SkyFly"), ("Couleur", "Blanc"), ("Stockage", "256 Go")],
        "description": "Drone portable avec vidéo 4K, détection d'obstacles et longue autonomie.",
        "image": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200",
    },
    # TV & Home Cinéma
    {
        'name': 'Téléviseur OLED 55" 4K',
        "slug": "televiseur-oled-55-4k",
        "price": "850000",
        "stock": 10,
        "category": "tv-home-cinema",
        "tags": ["limited-edition"],
        "attrs": [("Marque", "VisionX"), ("Couleur", "Noir"), ("Matière", "Verre & Aluminium")],
        "description": "Dalle OLED ultra-fine 4K avec contraste cinématique et fonctions smart.",
        "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=1200",
    },
    {
        "name": "Liseuse Numérique PaperLite",
        "slug": "liseuse-numerique-paperlite",
        "price": "42000",
        "stock": 90,
        "category": "tv-home-cinema",
        "tags": ["bestseller"],
        "attrs": [("Marque", "ReadGo"), ("Couleur", "Noir"), ("Stockage", "32 Go")],
        "description": "Liseuse à écran anti-reflet avec longue autonomie.",
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200",
    },
    # Jeux Vidéo
    {
        "name": "Console Next Gen",
        "slug": "console-next-gen",
        "price": "295000",
        "stock": 35,
        "category": "jeux-video",
        "tags": ["limited-edition", "new-arrival"],
        "attrs": [("Marque", "PlayNova"), ("Couleur", "Noir"), ("Stockage", "1 To")],
        "description": "Console nouvelle génération avec performances fluides et graphismes immersifs.",
        "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200",
    },
    {
        "name": "Manette Gaming Pro Sans Fil",
        "slug": "manette-gaming-pro-sans-fil",
        "price": "32000",
        "stock": 80,
        "category": "jeux-video",
        "tags": ["bestseller"],
        "attrs": [("Marque", "PlayNova"), ("Couleur", "Noir"), ("Connectivité", "Bluetooth 5.0")],
        "description": "Manette ergonomique sans fil avec retour haptique et gâchettes adaptatives.",
        "image": "https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=1200",
    },
    {
        "name": "Casque Gaming 7.1 Surround",
        "slug": "casque-gaming-7-1-surround",
        "price": "45000",
        "stock": 55,
        "category": "jeux-video",
        "tags": ["new-arrival"],
        "attrs": [("Marque", "SoundWave"), ("Couleur", "Noir/Rouge"), ("Connectivité", "USB + Jack 3.5mm")],
        "description": "Casque gaming son surround 7.1 avec micro rétractable.",
        "image": "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200",
    },
    # Maison Connectée
    {
        "name": "Hub Maison Connectée",
        "slug": "hub-maison-connectee",
        "price": "65000",
        "stock": 40,
        "category": "maison-connectee",
        "tags": ["new-arrival", "tech-essentials"],
        "attrs": [("Marque", "HomeSync"), ("Couleur", "Blanc"), ("Connectivité", "Wi-Fi + Zigbee")],
        "description": "Contrôleur central pour lumières, sécurité et divertissement à domicile.",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    },
    {
        "name": "Ampoule Connectée RGB",
        "slug": "ampoule-connectee-rgb",
        "price": "8500",
        "stock": 500,
        "category": "maison-connectee",
        "tags": ["new-arrival"],
        "attrs": [("Marque", "GlowHub"), ("Couleur", "RGB"), ("Connectivité", "Wi-Fi")],
        "description": "Ampoule à couleur variable avec commande vocale.",
        "image": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200",
    },
    {
        "name": "Caméra de Surveillance Indoor",
        "slug": "camera-surveillance-indoor",
        "price": "38000",
        "stock": 65,
        "category": "maison-connectee",
        "tags": ["bestseller"],
        "attrs": [("Marque", "SafeWatch"), ("Couleur", "Blanc"), ("Connectivité", "Wi-Fi")],
        "description": "Caméra intérieure avec vision nocturne et alertes de mouvement.",
        "image": "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200",
    },
    # Accessoires & Câbles
    {
        "name": "Chargeur Sans Fil Rapide 15W",
        "slug": "chargeur-sans-fil-rapide-15w",
        "price": "12500",
        "stock": 300,
        "category": "accessoires-cables",
        "tags": ["tech-essentials"],
        "attrs": [("Marque", "ChargeUp"), ("Couleur", "Noir"), ("Matière", "Aluminium")],
        "description": "Pad de charge sans fil rapide compatible la majorité des smartphones.",
        "image": "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1200",
    },
    {
        "name": "Câble USB-C Tressé 2m",
        "slug": "cable-usbc-tresse-2m",
        "price": "4500",
        "stock": 600,
        "category": "accessoires-cables",
        "tags": ["promo"],
        "attrs": [("Marque", "LinkPro"), ("Couleur", "Noir"), ("Matière", "Nylon Tressé")],
        "description": "Câble USB-C renforcé 2 m, charge rapide et transfert de données.",
        "image": "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=1200",
    },
    {
        "name": "Coque Protection iPhone 15",
        "slug": "coque-protection-iphone-15",
        "price": "7500",
        "stock": 400,
        "category": "accessoires-cables",
        "tags": ["bestseller", "promo"],
        "attrs": [("Marque", "ShieldCase"), ("Couleur", "Transparent"), ("Matière", "TPU")],
        "description": "Coque souple anti-choc avec protection des coins renforcée.",
        "image": "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=1200",
    },
    {
        "name": "Batterie Externe 20000 mAh",
        "slug": "batterie-externe-20000-mah",
        "price": "24000",
        "stock": 180,
        "category": "accessoires-cables",
        "tags": ["bestseller"],
        "attrs": [("Marque", "PowerBank+"), ("Couleur", "Noir"), ("Matière", "Aluminium")],
        "description": "Powerbank 20 000 mAh avec double USB-A et USB-C PD 22,5 W.",
        "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200",
    },
]

for pd in products_data:
    image_url = upload_url(pd["image"], "products")
    product = Product.objects.create(
        name=pd["name"],
        slug=pd["slug"],
        description=pd["description"],
        price=pd["price"],
        stock=pd["stock"],
        category=categories[pd["category"]],
        image=image_url or "",
        is_active=True,
    )
    for tag_slug in pd["tags"]:
        product.tags.add(tags[tag_slug])
    for key_name, value in pd.get("attrs", []):
        if key_name in attr_map:
            ProductAttribute.objects.create(product=product, key=attr_map[key_name], value=value)
    print(f"  ✓ {product.name}")

print(f"\n[OK] {Product.objects.count()} produits, {Category.objects.count()} catégories")
