import { useState } from 'react'

const MAX_CYCLE_HOURS = 70

const FIELDS = [
  { name: 'current_location', label: 'Current location', placeholder: 'New York, NY' },
  { name: 'pickup_location', label: 'Pickup location', placeholder: 'Newark, NJ' },
  { name: 'dropoff_location', label: 'Dropoff location', placeholder: 'Denver, CO' },
]

const defaultDeparture = () => {
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`
  return `${date}T08:00`
}

const initialValues = {
  current_location: '',
  pickup_location: '',
  dropoff_location: '',
  cycle_used_hours: '',
  departure: defaultDeparture(),
}

function validate(values) {
  const errors = {}
  for (const field of FIELDS) {
    if (!values[field.name].trim()) errors[field.name] = 'Required.'
  }

  const cycle = values.cycle_used_hours
  if (cycle === '') {
    errors.cycle_used_hours = 'Required.'
  } else if (Number.isNaN(Number(cycle))) {
    errors.cycle_used_hours = 'Enter a number.'
  } else if (Number(cycle) < 0) {
    errors.cycle_used_hours = 'Cannot be negative.'
  } else if (Number(cycle) > MAX_CYCLE_HOURS) {
    errors.cycle_used_hours = `Cannot exceed ${MAX_CYCLE_HOURS} hours.`
  }
  return errors
}

export default function TripForm({ onSubmit, isPlanning, serverErrors }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})

  const localErrors = validate(values)
  const errors = { ...localErrors, ...serverErrors }
  const showError = (name) => (touched[name] || serverErrors[name]) && errors[name]

  const update = (name) => (event) => setValues({ ...values, [name]: event.target.value })
  const markTouched = (name) => () => setTouched((current) => ({ ...current, [name]: true }))

  const handleSubmit = (event) => {
    event.preventDefault()
    setTouched(Object.fromEntries(Object.keys(initialValues).map((name) => [name, true])))
    if (Object.keys(localErrors).length > 0) return

    onSubmit({
      current_location: values.current_location.trim(),
      pickup_location: values.pickup_location.trim(),
      dropoff_location: values.dropoff_location.trim(),
      cycle_used_hours: Number(values.cycle_used_hours),
      departure: `${values.departure}:00`,
    })
  }

  return (
    <form className="card trip-form" onSubmit={handleSubmit} noValidate>
      <h2>Trip details</h2>

      {FIELDS.map((field) => (
        <div className="field" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type="text"
            autoComplete="off"
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={update(field.name)}
            onBlur={markTouched(field.name)}
            aria-invalid={Boolean(showError(field.name))}
            aria-describedby={showError(field.name) ? `${field.name}-error` : undefined}
          />
          {showError(field.name) && (
            <p className="field-error" id={`${field.name}-error`}>
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      <div className="field-row">
        <div className="field">
          <label htmlFor="cycle_used_hours">Current cycle used (hrs)</label>
          <input
            id="cycle_used_hours"
            name="cycle_used_hours"
            type="number"
            min="0"
            max={MAX_CYCLE_HOURS}
            step="0.25"
            inputMode="decimal"
            placeholder="0"
            value={values.cycle_used_hours}
            onChange={update('cycle_used_hours')}
            onBlur={markTouched('cycle_used_hours')}
            aria-invalid={Boolean(showError('cycle_used_hours'))}
            aria-describedby={
              showError('cycle_used_hours') ? 'cycle_used_hours-error' : 'cycle-hint'
            }
          />
          {showError('cycle_used_hours') ? (
            <p className="field-error" id="cycle_used_hours-error">
              {errors.cycle_used_hours}
            </p>
          ) : (
            <p className="field-hint" id="cycle-hint">
              On-duty hours already used in the 70&nbsp;hr / 8&nbsp;day cycle.
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="departure">Departure</label>
          <input
            id="departure"
            name="departure"
            type="datetime-local"
            value={values.departure}
            onChange={update('departure')}
          />
          <p className="field-hint">Home-terminal local time.</p>
        </div>
      </div>

      <button className="button-primary" type="submit" disabled={isPlanning}>
        {isPlanning ? 'Planning trip…' : 'Plan trip'}
      </button>
    </form>
  )
}
