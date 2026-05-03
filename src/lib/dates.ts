const localDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})

export function formatLocalDateTime(timestamp: number) {
  return localDateTimeFormatter.format(new Date(timestamp))
}
