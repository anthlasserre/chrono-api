export function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 3600000)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((duration % 3600000) / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((duration % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
