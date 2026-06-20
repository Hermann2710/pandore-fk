import cloudinary


def cloudinary_url(field) -> str | None:
    """Retourne l'URL Cloudinary absolue d'un ImageField sans passer par MEDIA_URL."""
    if not field:
        return None
    name = field.name if hasattr(field, "name") else str(field)
    if not name:
        return None
    if name.startswith("http"):
        return name
    return cloudinary.CloudinaryImage(name).build_url(secure=True)
