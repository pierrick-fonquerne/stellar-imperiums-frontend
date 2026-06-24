import { http, HttpResponse } from 'msw'

const mockUser = {
  id: 1,
  username: 'Cmdr_Vega',
  email: 'vega@stellar.io',
  role: 'joueur',
}

export const handlers = [
  http.post('*/v1/auth/login', () => {
    return HttpResponse.json({
      accessToken: 'test-access-token',
      expiresIn: 900,
      tokenType: 'Bearer',
      mustChangePassword: false,
      user: mockUser,
    })
  }),

  http.get('*/v1/users/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json(mockUser)
  }),

  http.post('*/v1/auth/refresh', () => {
    return HttpResponse.json({
      accessToken: 'refreshed-token',
      expiresIn: 900,
    })
  }),

  http.post('*/v1/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('*/v1/auth/forgot-password', () => {
    return new HttpResponse(null, { status: 202 })
  }),

  http.post('*/v1/auth/reset-password', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
