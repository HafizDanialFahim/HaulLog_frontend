const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

export const absoluteUrl = (path) => `${API_BASE_URL}${path}`

class ApiError extends Error {
  constructor(message, fieldErrors) {
    super(message)
    this.fieldErrors = fieldErrors || {}
  }
}

export async function planTrip(input, signal) {
  let response
  try {
    response = await fetch(absoluteUrl('/api/trips/plan/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Could not reach the planning service. Check your connection and try again.')
  }

  const body = await response.json().catch(() => null)
  if (response.ok) return body

  if (body && typeof body === 'object' && !body.detail) {
    const fieldErrors = Object.fromEntries(
      Object.entries(body).map(([field, messages]) => [
        field,
        Array.isArray(messages) ? messages[0] : String(messages),
      ]),
    )
    throw new ApiError('Please correct the highlighted fields.', fieldErrors)
  }

  throw new ApiError(body?.detail || 'The trip could not be planned. Please try again.')
}

export { ApiError }
