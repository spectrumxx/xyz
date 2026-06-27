// IDs legados são 8 chars alfanuméricos misturando maiúsculas e dígitos
// ex: "EU0098IQ" — slugs novos nunca terão maiúsculas
export function isLegacyId(id: string): boolean {
  return /^[a-zA-Z0-9]{8}$/.test(id) && /[A-Z]/.test(id)
}

// Converte título em slug URL-friendly
// ex: "Meu Script Incrível!!" → "meu-script-incrivel"
export function toSlug(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}
