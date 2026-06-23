import api from './api'
import type { LoginCredentials, LoginResponse, RefreshResponse, User } from '../types/auth'

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/v1/auth/login', credentials)
  return data
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/v1/users/me')
  return data
}

export async function refresh(): Promise<RefreshResponse> {
  const { data } = await api.post<RefreshResponse>('/v1/auth/refresh')
  return data
}

export async function logout(): Promise<void> {
  await api.post('/v1/auth/logout')
}
