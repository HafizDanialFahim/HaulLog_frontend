export const formatMiles = (miles) => `${Math.round(miles).toLocaleString('en-US')} mi`

export function formatDuration(minutes) {
  const whole = Math.round(minutes)
  const hours = Math.floor(whole / 60)
  const remainder = whole % 60
  if (hours === 0) return `${remainder}m`
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`
}

export function formatClock(minutesFromMidnight) {
  const total = Math.round(minutesFromMidnight) % 1440
  const hours = String(Math.floor(total / 60)).padStart(2, '0')
  const minutes = String(total % 60).padStart(2, '0')
  return `${hours}:${minutes}`
}

/** Backend timestamps are naive home-terminal local time, so parse them as-is. */
export function parseNaive(value) {
  const [date, time = '00:00:00'] = value.split('T')
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

export const formatDate = (isoDate) =>
  parseNaive(isoDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

export const formatDateTime = (isoDateTime) =>
  parseNaive(isoDateTime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

export const STATUS_LABELS = {
  OFF_DUTY: 'Off duty',
  SLEEPER_BERTH: 'Sleeper berth',
  DRIVING: 'Driving',
  ON_DUTY_NOT_DRIVING: 'On duty (not driving)',
}

export const KIND_LABELS = {
  DRIVE: 'Driving',
  PICKUP: 'Pickup',
  DROPOFF: 'Drop-off',
  FUEL: 'Fuel stop',
  BREAK_30_MIN: '30-minute break',
  OFF_DUTY_RESET: '10-hour reset',
  CYCLE_RESTART: '34-hour restart',
  OFF_DUTY: 'Off duty',
}
