export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function uniqueTags(items: Array<{ tags?: string[]; stack?: string[] }>) {
  const values = items.flatMap((item) => item.tags ?? item.stack ?? []);
  return Array.from(new Set(values));
}

export function formatMonthDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

