import { formatDate, formatDuration, formatMiles, KIND_LABELS, parseNaive } from '../lib/format'

const STATUS_CLASS = {
  DRIVING: 'driving',
  ON_DUTY_NOT_DRIVING: 'on-duty',
  OFF_DUTY: 'off-duty',
  SLEEPER_BERTH: 'sleeper',
}

const time = (isoDateTime) =>
  parseNaive(isoDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

export default function ScheduleList({ events }) {
  const byDay = groupByDay(events)

  return (
    <section className="card">
      <div className="card-head">
        <h2>Schedule</h2>
        <p className="muted">Every stop and rest period, in order.</p>
      </div>

      {byDay.map(([date, dayEvents]) => (
        <div className="schedule-day" key={date}>
          <h3 className="schedule-date">{formatDate(date)}</h3>
          <ol className="schedule">
            {dayEvents.map((event) => (
              <li className="schedule-item" key={event.start}>
                <time className="schedule-time">{time(event.start)}</time>
                <span className={`schedule-dot ${STATUS_CLASS[event.status]}`} aria-hidden="true" />
                <div className="schedule-body">
                  <p className="schedule-title">
                    {event.kind === 'DRIVE' ? event.label : KIND_LABELS[event.kind]}
                  </p>
                  <p className="schedule-meta">
                    {formatDuration(minutesBetween(event))}
                    {event.miles > 0 && ` · ${formatMiles(event.miles)}`}
                    {event.place && ` · ${event.place}`}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  )
}

function groupByDay(events) {
  const groups = new Map()
  for (const event of events) {
    const date = event.start.split('T')[0]
    if (!groups.has(date)) groups.set(date, [])
    groups.get(date).push(event)
  }
  return [...groups.entries()]
}

function minutesBetween(event) {
  return (parseNaive(event.end) - parseNaive(event.start)) / 60000
}
