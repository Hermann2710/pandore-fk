"""
Migration script: upload all existing local media files to Cloudinary
and update the database records with the new Cloudinary URLs.

Usage:
    cd backend
    python migrate_to_cloudinary.py
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pandore.settings")
django.setup()

import cloudinary.uploader
from pathlib import Path
from django.conf import settings

BASE_MEDIA = Path(settings.MEDIA_ROOT)


def upload_file(local_path: Path, folder: str) -> str | None:
    """Upload a file to Cloudinary and return the secure URL."""
    if not local_path.exists():
        return None
    result = cloudinary.uploader.upload(
        str(local_path),
        folder=folder,
        use_filename=True,
        unique_filename=False,
        overwrite=True,
        resource_type="auto",
    )
    return result["secure_url"]


def migrate_products():
    from catalog.models import Product
    qs = Product.objects.exclude(image="").exclude(image=None)
    print(f"Products with images: {qs.count()}")
    for p in qs:
        local = BASE_MEDIA / p.image.name
        url = upload_file(local, "products")
        if url:
            p.image = url
            p.save(update_fields=["image"])
            print(f"  ✓ {p.name} → {url}")
        else:
            print(f"  ✗ {p.name} — file not found: {local}")


def migrate_payment_methods():
    from payments.models import PaymentMethod
    qs = PaymentMethod.objects.exclude(logo="").exclude(logo=None)
    print(f"PaymentMethods with logos: {qs.count()}")
    for m in qs:
        local = BASE_MEDIA / m.logo.name
        url = upload_file(local, "payment_methods")
        if url:
            m.logo = url
            m.save(update_fields=["logo"])
            print(f"  ✓ {m.name} → {url}")
        else:
            print(f"  ✗ {m.name} — file not found: {local}")


def migrate_avatars():
    from users.models import User
    qs = User.objects.exclude(avatar="").exclude(avatar=None)
    print(f"Users with avatars: {qs.count()}")
    for u in qs:
        local = BASE_MEDIA / u.avatar.name
        url = upload_file(local, "avatars")
        if url:
            u.avatar = url
            u.save(update_fields=["avatar"])
            print(f"  ✓ {u.username} → {url}")
        else:
            print(f"  ✗ {u.username} — file not found: {local}")


def migrate_site_settings():
    from site_config.models import SiteSettings
    s = SiteSettings.get()
    if s.logo:
        local = BASE_MEDIA / s.logo.name
        url = upload_file(local, "settings")
        if url:
            s.logo = url
            s.save(update_fields=["logo"])
            print(f"  ✓ SiteSettings logo → {url}")


def migrate_homepage():
    from catalog.models import HomepageSection
    qs = HomepageSection.objects.exclude(bg_image="").exclude(bg_image=None)
    print(f"HomepageSections with bg_image: {qs.count()}")
    for sec in qs:
        local = BASE_MEDIA / sec.bg_image.name
        url = upload_file(local, "homepage")
        if url:
            sec.bg_image = url
            sec.save(update_fields=["bg_image"])
            print(f"  ✓ {sec.title} → {url}")


if __name__ == "__main__":
    print("=== Migrating media to Cloudinary ===\n")
    migrate_products()
    print()
    migrate_payment_methods()
    print()
    migrate_avatars()
    print()
    migrate_site_settings()
    print()
    migrate_homepage()
    print("\n=== Done ===")
