export default function useApi() {
  const config = useRuntimeConfig()
  const BASE_URL = config.public.apiUrl
  const API_URL = `${BASE_URL}/api`

  const token = useCookie('token')

  const request = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {}

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers as Record<string, string> },
    })

    const contentType = res.headers.get('content-type') || ''
    let data: any = null
    if (contentType.includes('application/json')) {
      data = await res.json()
    } else {
      const text = await res.text()
      if (!res.ok) {
        throw new Error(text.substring(0, 200) || `Request failed with status ${res.status}`)
      }
      throw new Error('Unexpected response format')
    }

    if (!res.ok) {
      if (res.status === 401) {
        const auth = useAuth()
        auth.logout()
      }
      throw new Error(data.message || data.error || 'Request failed')
    }

    return data
  }

  return {
    get: (endpoint: string) => request(endpoint),
    post: (endpoint: string, body?: any) =>
      request(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    put: (endpoint: string, body?: any) =>
      request(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
    del: (endpoint: string) => request(endpoint, { method: 'DELETE' }),
    upload: (endpoint: string, formData: FormData) =>
      request(endpoint, { method: 'POST', body: formData }),
    uploadPut: (endpoint: string, formData: FormData) =>
      request(endpoint, { method: 'PUT', body: formData }),
  }
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  if (path.startsWith('blob:')) return path
  const cleanPath = path
    .replace(/^\.\//, '')
    .replace(/^public\//, '')
    .replace(/^\/?(.*)/, '$1')
  const config = useRuntimeConfig()
  return `${config.public.apiUrl}/${cleanPath}`
}
