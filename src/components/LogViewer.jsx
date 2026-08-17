import { useEffect, useState } from 'react'
import { absoluteUrl } from '../api'
import { formatDate, formatDuration, formatMiles, STATUS_LABELS } from '../lib/format'

const ROW_ORDER = ['OFF_DUTY', 'SLEEPER_BERTH', 'DRIVING', 'ON_DUTY_NOT_DRIVING']

export default function LogViewer({ days }) {
  const [activeDay, setActiveDay] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => setActiveDay(1), [days])

  const day = days.find((candidate) => candidate.day_number === activeDay) || days[0]
  const sheetUrl = absoluteUrl(day.eld_log_url)

  useEffect(() => setIsLoaded(false), [sheetUrl])

  return (
    <section className="card">
      <div className="card-head">
        <h2>Daily log sheets</h2>
        <p className="muted">Drawn on the DOT driver&rsquo;s daily log form.</p>
      </div>

      <div className="day-tabs" role="tablist" aria-label="Log sheet days">
        {days.map((candidate) => (
          <button
            key={candidate.day_number}
            role="tab"
            type="button"
            aria-selected={candidate.day_number === day.day_number}
            className={`day-tab ${candidate.day_number === day.day_number ? 'is-active' : ''}`}
            onClick={() => setActiveDay(candidate.day_number)}
          >
            <span className="day-tab-number">Day {candidate.day_number}</span>
            <span className="day-tab-date">{formatDate(candidate.date)}</span>
          </button>
        ))}
      </div>

      <dl className="log-totals">
        {ROW_ORDER.map((status) => (
          <div key={status}>
            <dt>{STATUS_LABELS[status]}</dt>
            <dd>{formatDuration(day.totals_minutes[status])}</dd>
          </div>
        ))}
        <div>
          <dt>Miles driven</dt>
          <dd>{formatMiles(day.driving_miles)}</dd>
        </div>
      </dl>

      <figure className="log-sheet">
        {!isLoaded && <div className="log-sheet-placeholder">Rendering log sheet…</div>}
        <img
          src={sheetUrl}
          alt={`Driver's daily log for ${formatDate(day.date)}`}
          onLoad={() => setIsLoaded(true)}
          style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
        />
        <figcaption>
          <span>
            {day.from_place && day.to_place
              ? `${day.from_place} → ${day.to_place}`
              : 'No duty-status change recorded on this day.'}
          </span>
          <a href={sheetUrl} target="_blank" rel="noreferrer">
            Open full size
          </a>
        </figcaption>
      </figure>
    </section>
  )
}
