<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      <p class="text-muted-foreground text-sm mt-1">View and manage all platform data</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading...</div>
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div class="rounded-xl border bg-card p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ posts.length }}</p>
              <p class="text-xs text-muted-foreground">Total Posts</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border bg-card p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ users.length }}</p>
              <p class="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border bg-card p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ categories.length }}</p>
              <p class="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border bg-card p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ admins }}</p>
              <p class="text-xs text-muted-foreground">Admins</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold">Recent Posts</h2>
            <NuxtLink to="/admin/posts" class="text-sm text-primary hover:underline">Manage</NuxtLink>
          </div>
          <div class="space-y-1">
            <NuxtLink v-for="post in posts.slice(0, 5)" :key="post._id" :to="`/admin/posts`" class="block rounded-lg border p-3 hover:border-primary/50 transition-colors">
              <p class="text-sm font-medium truncate">{{ post.title }}</p>
              <p class="text-xs text-muted-foreground">{{ formatDate(post.createdAt) }}</p>
            </NuxtLink>
          </div>
        </section>
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold">Recent Users</h2>
            <NuxtLink to="/admin/users" class="text-sm text-primary hover:underline">Manage</NuxtLink>
          </div>
          <div class="space-y-1">
            <div v-for="user in users.slice(0, 5)" :key="user._id" class="rounded-lg border p-3 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-semibold">{{ user.username?.charAt(0).toUpperCase() }}</div>
              <div>
                <p class="text-sm font-medium">{{ user.username }}</p>
                <p class="text-xs text-muted-foreground">{{ user.email }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'account' })

const { get } = useApi()
const auth = useAuth()
const posts = ref<any[]>([])
const users = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)

const admins = computed(() => users.value.filter((u: any) => u.role === 'admin' || u.role === 'superAdmin').length)

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

onMounted(async () => {
  if (!auth.isAdmin.value) {
    await navigateTo('/account')
    return
  }
  try {
    const [postsRes, usersRes, catsRes] = await Promise.all([
      get('/posts').catch(() => ({ data: [] })),
      get('/users').catch(() => []),
      get('/categories').catch(() => ({ data: [] })),
    ])
    posts.value = postsRes.data || []
    users.value = Array.isArray(usersRes) ? usersRes : []
    categories.value = catsRes.data || []
  } catch { } finally {
    loading.value = false
  }
})
</script>
