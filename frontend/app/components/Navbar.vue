<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex h-16 items-center justify-between gap-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group shrink-0">
          <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight hidden sm:inline">Bloger</span>
        </NuxtLink>

        <!-- Nav links -->
        <nav class="flex items-center gap-1">
          <NuxtLink
            to="/"
            class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            :class="route.path === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
          >Home</NuxtLink>
          <NuxtLink
            to="/categories"
            class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            :class="route.path.startsWith('/categories') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
          >Categories</NuxtLink>
        </nav>

        <!-- Right -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Search -->
          <NuxtLink to="/search" class="p-2 rounded-md hover:bg-accent transition-colors" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </NuxtLink>

          <!-- Theme toggle -->
          <button @click="themeToggle.toggleTheme" class="p-2 rounded-md hover:bg-accent transition-colors" aria-label="Toggle theme">
            <svg v-if="themeToggle.theme.value === 'dark'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Auth -->
          <template v-if="auth.isAuthenticated.value">
            <NuxtLink
              to="/account/create"
              class="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Write
            </NuxtLink>
            <NuxtLink
              to="/account"
              class="p-0.5 rounded-full hover:bg-accent transition-colors"
              aria-label="Account"
            >
              <div class="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-background">
                <img v-if="auth.user.value?.avatar" :src="getImageUrl(auth.user.value.avatar)" :alt="auth.user.value?.username" class="w-full h-full object-cover" />
                <span v-else>{{ userInitial }}</span>
              </div>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors">Login</NuxtLink>
            <NuxtLink to="/register" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">Get Started</NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const auth = useAuth()
const route = useRoute()
const themeToggle = useTheme()

const userInitial = computed(() => {
  const name = auth.user.value?.username || auth.user.value?.email || 'U'
  return name.charAt(0).toUpperCase()
})

onMounted(async () => {
  themeToggle.initTheme()
  if (auth.isAuthenticated.value && !auth.user.value) {
    try {
      await auth.fetchProfile()
    } catch {
      // token expired
    }
  }
})
</script>
