export function format(date: string, ifEmpty: string = '') {
  if (!date) {
    return ifEmpty;
  }
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}
