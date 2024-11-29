import { format, isValid, parseISO } from 'date-fns'

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) {
      return 'Invalid date'
    }
    return format(date, 'yyyy-MM-dd')
  } catch {
    return 'Invalid date'
  }
}
