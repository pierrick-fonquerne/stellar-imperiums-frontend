export interface User {
  id: number
  username: string
  email: string
  role: string
}

export interface LoginResponse {
  accessToken: string
  expiresIn: number
  tokenType: string
  mustChangePassword: boolean
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RefreshResponse {
  accessToken: string
  expiresIn: number
}
