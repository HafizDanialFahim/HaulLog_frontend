import { formatDateTime, formatDuration, formatMiles } from '../lib/format'

export default function RouteSummary({ summary }) {
  const stats = [
    { label: 'Total distance', value: formatMiles(summary.total_distance_miles) },
    { label: 'Driving time', value: formatDuration(summary.driving_minutes) },
    { label: 'Trip duration', value: formatDuration(summary.total_trip_minutes) },
    { label: 'Log sheets', value: `${summary.day_count} ${summary.day_count === 1 ? 'day' : 'days'}` },
    { label: '10-hr resets', value: summary.rest_period_count },
    { label: '30-min breaks', value: summary.break_count },
    { label: 'Fuel stops', value: summary.fuel_stop_count },
    {
      label: 'Cycle remaining',
      value: `${summary.cycle_hours_remaining_at_end.toFixed(1)} hrs`,
      note: `${summary.cycle_hours_used_at_end.toFixed(1)} of 70 used`,
    },
  ]

  return (
    <section className="card">
      <div className="card-head">
        <h2>Route summary</h2>
        <p className="muted">
          {formatDateTime(summary.departure)} → {formatDateTime(summary.arrival)}
        </p>
      </div>

      <dl className="stat-grid">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
            {stat.note && <p className="stat-note">{stat.note}</p>}
          </div>
        ))}
      </dl>

      {summary.break_count === 0 && (
        <p className="notice">
          No separate 30-minute break is scheduled. Under 395.3(a)(3)(ii) any consecutive
          30 minutes off driving resets the break clock, so the hour spent loading at
          pickup or unloading at dropoff already satisfies it. A standalone break is added
          only when 8 hours of driving build up without one.
        </p>
      )}

      {summary.cycle_restart_count > 0 && (
        <p className="notice">
          The 70-hour cycle runs out during this trip. The plan includes{' '}
          {summary.cycle_restart_count === 1
            ? 'a 34-hour restart'
            : `${summary.cycle_restart_count} 34-hour restarts`}{' '}
          so that driving stays legal.
        </p>
      )}
    </section>
  )
}
