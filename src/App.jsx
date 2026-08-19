import { useRef, useState } from 'react'
import { ApiError, planTrip } from './api'
import LogViewer from './components/LogViewer'
import RouteMap from './components/RouteMap'
import RouteSummary from './components/RouteSummary'
import SampleTrips from './components/SampleTrips'
import ScheduleList from './components/ScheduleList'
import TripForm from './components/TripForm'

export default function App() {
  const [plan, setPlan] = useState(null)
  const [isPlanning, setIsPlanning] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [preset, setPreset] = useState(null)
  const requestRef = useRef(null)

  const handleSubmit = async (input) => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller

    setIsPlanning(true)
    setError(null)
    setFieldErrors({})

    try {
      setPlan(await planTrip(input, controller.signal))
    } catch (caught) {
      if (caught.name === 'AbortError') return
      setError(caught.message)
      setFieldErrors(caught instanceof ApiError ? caught.fieldErrors : {})
    } finally {
      if (requestRef.current === controller) setIsPlanning(false)
    }
  }

  // A fresh object every time, so picking the same sample twice still re-runs it.
  const handleSample = (sample) => setPreset({ values: sample.values })

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true" />
            <div>
              <p className="brand-name">HaulLog</p>
              <p className="brand-tagline">HOS trip planning &amp; ELD logs</p>
            </div>
          </div>
          <p className="masthead-note">Property-carrying driver · 70 hr / 8 day cycle</p>
        </div>
      </header>

      <main className="layout">
        <div className="column-form">
          <TripForm
            onSubmit={handleSubmit}
            isPlanning={isPlanning}
            serverErrors={fieldErrors}
            preset={preset}
          />

          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}

          <SampleTrips onPick={handleSample} isPlanning={isPlanning} />
        </div>

        <div className="column-results">
          {!plan && !isPlanning && <EmptyState />}
          {isPlanning && !plan && <LoadingState />}

          {plan && (
            <>
              <RouteSummary summary={plan.summary} />
              <RouteMap
                geometry={plan.route.geometry}
                locations={plan.locations}
                stops={plan.schedule}
              />
              <ScheduleList events={plan.schedule} />
              <LogViewer days={plan.days} />
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>
          Hours-of-service limits follow 49 CFR Part 395 for property-carrying drivers. Routing and
          geocoding use OpenStreetMap data, via OpenRouteService when an API key is configured and
          Nominatim / OSRM otherwise.
        </p>
      </footer>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card empty-state">
      <h2>No trip planned yet</h2>
      <p>
        Enter the current, pickup and dropoff locations along with the hours already used in the
        driver&rsquo;s 70-hour cycle. HaulLog works out the legal driving schedule — rest breaks,
        overnight resets and fuel stops — and draws a log sheet for each day of the trip.
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="card empty-state">
      <div className="spinner" aria-hidden="true" />
      <h2>Planning the trip</h2>
      <p>Geocoding the stops, routing the trip and applying hours-of-service limits.</p>
    </div>
  )
}
