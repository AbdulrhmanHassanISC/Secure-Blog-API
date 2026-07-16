export default function useAuth() {
  const token = useCookie('token')
  const user = useState<any>('user', () => null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'superAdmin')

  const login = async (email: string, password: string) => {
    const { post } = useApi()
    const res = await post('/auth/login', { email, password })
    token.value = res.data.token
    user.value = res.data.user
    return res
  }

  const register = async (username: string, email: string, password: string) => {
    const { post } = useApi()
    const res = await post('/auth/register', { username, email, password })
    return res
  }

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/')
  }

  const fetchProfile = async () => {
    try {
      const { get } = useApi()
      const res = await get('/profile')
      user.value = res.data.user
      return res
    } catch {
      logout()
      throw new Error('Session expired')
    }
  }

  return { token, user, isAuthenticated, isAdmin, login, register, logout, fetchProfile }
}
