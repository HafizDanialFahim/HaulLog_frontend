import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { formatDateTime, formatDuration, KIND_LABELS } from '../lib/format'

// Leaflet's default marker images do not survive bundling, and divIcons let each
// stop type carry its own glyph without shipping extra assets.
const pin = (className, glyph) =>
  L.divIcon({
    className: '',
    html: `<span class="map-pin ${className}">${glyph}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -12],
  })

const ENDPOINT_ICONS = {
  current: pin('map-pin-start', 'A'),
  pickup: pin('map-pin-pickup', 'P'),
  dropoff: pin('map-pin-dropoff', 'D'),
}

const STOP_ICONS = {
  FUEL: pin('map-pin-fuel', 'F'),
  BREAK_30_MIN: pin('map-pin-break', 'B'),
  OFF_DUTY_RESET: pin('map-pin-rest', 'R'),
  CYCLE_RESTART: pin('map-pin-restart', '34'),
}

const ENDPOINT_LABELS = {
  current: 'Current location',
  pickup: 'Pickup',
  dropoff: 'Dropoff',
}

function FitToRoute({ bounds }) {
  const map = useMap()
  useEffect(() => {
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [36, 36] })
  }, [map, bounds])
  return null
}

export default function RouteMap({ geometry, locations, stops }) {
  const restStops = stops.filter((stop) => STOP_ICONS[stop.kind])
  const bounds = geometry.length > 1 ? geometry : Object.values(locations).map((p) => [p.latitude, p.longitude])

  return (
    <section className="card card-flush">
      <div className="card-head card-head-padded">
        <h2>Route</h2>
        <ul className="map-legend">
          <li><span className="map-pin map-pin-start">A</span> Start</li>
          <li><span className="map-pin map-pin-pickup">P</span> Pickup</li>
          <li><span className="map-pin map-pin-dropoff">D</span> Dropoff</li>
          <li><span className="map-pin map-pin-rest">R</span> Rest</li>
          <li><span className="map-pin map-pin-fuel">F</span> Fuel</li>
          <li><span className="map-pin map-pin-break">B</span> Break</li>
        </ul>
      </div>

      <div className="map-frame">
        <MapContainer center={[39.5, -98.35]} zoom={4} scrollWheelZoom className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <FitToRoute bounds={bounds} />

          {geometry.length > 1 && (
            <Polyline positions={geometry} pathOptions={{ color: '#1d4ed8', weight: 4, opacity: 0.85 }} />
          )}

          {Object.entries(locations).map(([key, place]) => (
            <Marker key={key} position={[place.latitude, place.longitude]} icon={ENDPOINT_ICONS[key]}>
              <Popup>
                <strong>{ENDPOINT_LABELS[key]}</strong>
                <br />
                {place.name}
              </Popup>
            </Marker>
          ))}

          {restStops.map((stop) => (
            <Marker
              key={`${stop.kind}-${stop.start}`}
              position={[stop.latitude, stop.longitude]}
              icon={STOP_ICONS[stop.kind]}
            >
              <Popup>
                <strong>{KIND_LABELS[stop.kind]}</strong>
                <br />
                {stop.place}
                <br />
                {formatDateTime(stop.start)} · {formatDuration(minutesBetween(stop))}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}

function minutesBetween(stop) {
  return (new Date(stop.end) - new Date(stop.start)) / 60000
}
