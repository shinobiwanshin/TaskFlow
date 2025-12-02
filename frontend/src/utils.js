export function createPageUrl(page) {
  if (!page) return "/";
  return "/" + page.toLowerCase();
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
