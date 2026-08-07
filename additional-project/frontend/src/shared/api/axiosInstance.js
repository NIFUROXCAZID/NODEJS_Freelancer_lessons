import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

function processQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve()
    }
  })

  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    const isUnauthorized = error.response?.status === 401
    const isRefreshRequest = originalRequest?.url === '/auth/refresh'

    if (!isUnauthorized || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => api(originalRequest))
    }

    isRefreshing = true

    try {
      await api.post('/auth/refresh')

      processQueue(null)

      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)