# HaulLog — frontend

React app for planning a property-carrying truck trip against the federal
hours-of-service limits. Enter a current location, a pickup, a dropoff and the
hours already used in the 70-hour cycle; it shows the route on a map, the full
stop-by-stop schedule, and a rendered driver's daily log for each day.

| | |
| --- | --- |
| **Live app** | **https://haullog.vercel.app** |
| **API it calls** | https://haullog.pythonanywhere.com/api/ |

The Django API lives in a separate repository:
[HaulLog_backend](https://github.com/HafizDanialFahim/HaulLog_backend).

## Stack

React 18, Vite, React-Leaflet / Leaflet, plain CSS. No UI framework.

## Layout

```
src/
  App.jsx              page shell, request state, empty/loading/error states
  api.js               API client and error shaping
  lib/format.js        duration, distance, clock and date formatting
  components/
    TripForm.jsx       inputs and validation
    RouteSummary.jsx   distance, driving time, stop counts, cycle remaining
    RouteMap.jsx       Leaflet map, route polyline, stop markers
    ScheduleList.jsx   chronological schedule grouped by day
    LogViewer.jsx      day tabs and the rendered ELD log sheet
```

## Setup

Requires Node 18+ and the backend running.

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs on http://localhost:5173.

## Environment variables

| Variable            | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the Django API, no trailing slash.                  |

Locally this is `http://127.0.0.1:8000`. Vite inlines it at build time, so it must
be set **before** `npm run build` — changing it later requires a rebuild.

`.env` is gitignored; `.env.example` documents it.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploying to Vercel

`vercel.json` is already configured: Vite framework preset, `dist` output, and a
catch-all rewrite so client-side routes resolve.

1. Import this repository in Vercel. The root directory is the repository root.
2. Add an environment variable **`VITE_API_BASE_URL`** =
   `https://haullog.pythonanywhere.com` (no trailing slash), for the Production,
   Preview and Development scopes.
3. Deploy.

Then set `CORS_ALLOWED_ORIGINS` on the backend to the resulting Vercel origin and
reload the backend, otherwise the browser will block the API calls.

If you change `VITE_API_BASE_URL` afterwards, redeploy — the value is baked into
the bundle at build time, not read at runtime.

## Map tiles

Tiles come from OpenStreetMap and are attributed in the map corner, as their
usage policy requires. Marker icons are inline `divIcon` elements rather than
image assets, so nothing breaks under bundling.
