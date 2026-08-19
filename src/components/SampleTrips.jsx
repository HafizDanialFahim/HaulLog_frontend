import { SAMPLE_TRIPS } from '../lib/samples'

export default function SampleTrips({ onPick, isPlanning }) {
  return (
    <section className="card sample-trips">
      <h2>Sample trips</h2>
      <p className="muted">
        Each one fills the form and plans it. The expected result is what the deployed API returned
        when these were recorded.
      </p>

      <ul>
        {SAMPLE_TRIPS.map((sample) => (
          <li key={sample.id}>
            <button type="button" onClick={() => onPick(sample)} disabled={isPlanning}>
              <span className="sample-name">{sample.name}</span>
              <span className="sample-route">{sample.route}</span>
              <span className="sample-expected">{sample.expected}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
