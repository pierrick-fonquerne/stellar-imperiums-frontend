import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let accessToken: string | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableConfig | undefined

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      config.url !== '/v1/auth/refresh' &&
      config.url !== '/v1/auth/login'
    ) {
      config._retry = true
      try {
        const { data } = await api.post<{ accessToken: string }>('/v1/auth/refresh')
        setAccessToken(data.accessToken)
        config.headers.Authorization = `Bearer ${data.accessToken}`
        return api(config)
      } catch {
        setAccessToken(null)
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default api
