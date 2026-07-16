<template>
  <div class="max-w-md mx-auto px-4 py-16">
    <div class="rounded-2xl border bg-card p-8 shadow-sm">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold">Create an account</h1>
        <p class="text-sm text-muted-foreground mt-1">Join the community and start writing</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5">Username</label>
          <input v-model="username" type="text" required class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition" placeholder="johndoe" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Email</label>
          <input v-model="email" type="email" required class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition" placeholder="you@example.com" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Password</label>
          <input v-model="password" type="password" required minlength="6" class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition" placeholder="At least 6 characters" />
          <p class="text-xs text-muted-foreground mt-1">Must be at least 6 characters</p>
        </div>
        <p v-if="error" class="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{{ error }}</p>
        <p v-if="success" class="text-sm text-green-600 bg-green-500/10 px-3 py-2 rounded-md">{{ success }}</p>
        <button type="submit" :disabled="loading" class="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
          <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
        <div class="text-center text-sm text-muted-foreground pt-2">
          Already have an account?
          <NuxtLink to="/login" class="text-primary font-medium hover:underline">Sign in</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const auth = useAuth()
const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await auth.register(username.value, email.value, password.value)
    success.value = 'Account created! Redirecting to login...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
