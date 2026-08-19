import { departureValue } from './format'

/**
 * Preset trips for anyone evaluating the app, each chosen to exercise a
 * different hours-of-service rule. The expected results were recorded from the
 * deployed API, so a mismatch is worth looking into.
 */
export const SAMPLE_TRIPS = [
  {
    id: 'single-day',
    name: 'Single day',
    route: 'Dallas → Oklahoma City → Kansas City',
    expected: '557 mi · 1 log sheet · no reset, break or fuel stop',
    values: {
      current_location: 'Dallas, TX',
      pickup_location: 'Oklahoma City, OK',
      dropoff_location: 'Kansas City, MO',
      cycle_used_hours: '10',
      departure: departureValue('08:00'),
    },
  },
  {
    id: 'crosses-midnight',
    name: 'Crosses midnight',
    route: 'Same trip, leaving at 10:00 PM',
    expected: 'Same 557 mi split across 2 log sheets',
    values: {
      current_location: 'Dallas, TX',
      pickup_location: 'Oklahoma City, OK',
      dropoff_location: 'Kansas City, MO',
      cycle_used_hours: '10',
      departure: departureValue('22:00'),
    },
  },
  {
    id: 'fuel-stop',
    name: 'Multi-day with fuel stop',
    route: 'Los Angeles → Phoenix → Dallas',
    expected: '1,438 mi · 3 days · 2 ten-hour resets · 1 fuel stop',
    values: {
      current_location: 'Los Angeles, CA',
      pickup_location: 'Phoenix, AZ',
      dropoff_location: 'Dallas, TX',
      cycle_used_hours: '0',
      departure: departureValue('08:00'),
    },
  },
  {
    id: 'driving-cap',
    name: '11-hour driving cap',
    route: 'Chicago → Indianapolis → Atlanta',
    expected: '684 mi · 2 days · day 1 ends when the driving cap is reached',
    values: {
      current_location: 'Chicago, IL',
      pickup_location: 'Indianapolis, IN',
      dropoff_location: 'Atlanta, GA',
      cycle_used_hours: '0',
      departure: departureValue('08:00'),
    },
  },
  {
    id: 'cycle-restart',
    name: '34-hour restart',
    route: 'Seattle → Denver → Atlanta, 62 hrs already used',
    expected: '2,705 mi · 6 days · 2 fuel stops · 1 break · 1 restart',
    values: {
      current_location: 'Seattle, WA',
      pickup_location: 'Denver, CO',
      dropoff_location: 'Atlanta, GA',
      cycle_used_hours: '62',
      departure: departureValue('08:00'),
    },
  },
  {
    id: 'unknown-location',
    name: 'Unknown location',
    route: 'A current location that cannot be geocoded',
    expected: 'The API answers 422 and the reason is shown below the form',
    values: {
      current_location: 'zzzzqqqq nowhere 12345',
      pickup_location: 'Houston, TX',
      dropoff_location: 'Austin, TX',
      cycle_used_hours: '5',
      departure: departureValue('08:00'),
    },
  },
  {
    id: 'over-cycle',
    name: 'Over the 70-hour cycle',
    route: 'Dallas → Houston → Austin, 75 hrs already used',
    expected: 'Rejected by the form before any request is sent',
    values: {
      current_location: 'Dallas, TX',
      pickup_location: 'Houston, TX',
      dropoff_location: 'Austin, TX',
      cycle_used_hours: '75',
      departure: departureValue('08:00'),
    },
  },
]
