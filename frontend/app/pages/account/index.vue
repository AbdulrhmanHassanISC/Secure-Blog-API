<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight">Overview</h1>
      <p class="text-muted-foreground text-sm mt-1">Welcome back, {{ profile?.username || 'User' }}</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading...</div>
    <template v-else>
      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div class="rounded-xl border bg-card p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ postCount }}</p>
              <p class="text-xs text-muted-foreground">Posts</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border bg-card p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ profile?.role === 'admin' ? allPostsCount : postCount }}</p>
              <p class="text-xs text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border bg-card p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ categoryCount }}</p>
              <p class="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent posts -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold">Recent Posts</h2>
          <NuxtLink to="/account/posts" class="text-sm text-primary hover:underline">View all</NuxtLink>
        </div>
        <div v-if="!recentPosts.length" class="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">
          <p class="mb-3">No posts yet</p>
          <NuxtLink to="/account/create" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Create your first post
          </NuxtLink>
        </div>
        <div v-else class="space-y-2">
          <NuxtLink
            v-for="post in recentPosts.slice(0, 5)"
            :key="post._id"
            :to="`/posts/${post._id}`"
            class="block rounded-lg border p-4 hover:border-primary/50 transition-colors"
          >
            <h3 class="font-medium text-sm mb-0.5">{{ post.title }}</h3>
            <p class="text-xs text-muted-foreground">{{ formatDate(post.createdAt) }}</p>
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'account' })
const { get } = useApi()
const auth = useAuth()
const profile = ref<any>(null)
const allPosts = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)

const userId = computed(() => auth.user.value?.userId)

const myPosts = computed(() => {
  if (!userId.value) return []
  return allPosts.value.filter((p: any) => {
    if (typeof p.author === 'string') return p.author === userId.value
    return p.author?._id === userId.value || p.author === userId.value
  })
})

const recentPosts = computed(() => auth.isAdmin.value ? allPosts.value : myPosts.value)

const postCount = computed(() => myPosts.value.length)
const allPostsCount = computed(() => allPosts.value.length)
const categoryCount = computed(() => categories.value.length)

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

onMounted(async () => {
  try {
    const [profileRes, postsRes, catsRes] = await Promise.all([
      get('/profile').catch(() => ({ data: { user: null } })),
      get('/posts').catch(() => ({ data: [] })),
      get('/categories').catch(() => ({ data: [] })),
    ])
    profile.value = profileRes.data?.user || profileRes.data
    auth.user.value = { ...auth.user.value, avatar: profile.value?.avatar }
    allPosts.value = postsRes.data || []
    categories.value = catsRes.data || []
  } catch (e: any) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
