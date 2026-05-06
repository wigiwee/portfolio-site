const PRODUCTION_API_BASE_URL = 'https://backend.wigiwee.com'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = configuredApiBaseUrl || (import.meta.env.PROD ? PRODUCTION_API_BASE_URL : '')

export const apiUrl = (path) => `${API_BASE_URL}${path}`
