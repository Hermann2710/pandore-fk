import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Retourne l'URL absolue d'un fichier media.
 *  - Si l'URL commence par http(s) (Cloudinary) → retournée telle quelle
 *  - Sinon → préfixe avec NEXT_PUBLIC_BACKEND_URL (fallback local)
 */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  return `${base}${path}`;
}
