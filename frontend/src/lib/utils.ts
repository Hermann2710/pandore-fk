import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// The classic shadcn utility — merges Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
