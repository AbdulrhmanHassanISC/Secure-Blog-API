<template>
  <div>
    <!-- Hero -->
    <section class="border-b bg-gradient-to-b from-muted/50 to-background">
      <div class="max-w-6xl mx-auto px-4 py-20 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background text-sm text-muted-foreground mb-6">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Welcome to the community
        </div>
        <h1 class="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Stories, ideas & <span class="text-primary">expertise</span>
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover thoughtful writing from creators around the world. Read, share, and start writing your own story.
        </p>
        <div class="flex items-center justify-center gap-3">
          <NuxtLink
            to="/account/create"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Start writing
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
          <NuxtLink
            to="/categories"
            class="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md border bg-background hover:bg-accent transition-colors"
          >
            Browse categories
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- Posts -->
      <section>
        <div class="flex items-end justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold tracking-tight">Latest posts</h2>
            <p class="text-sm text-muted-foreground mt-1">Fresh insights from our community</p>
          </div>
        </div>
        <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading posts...</div>
        <div v-else-if="error" class="text-center py-20 text-destructive">{{ error }}</div>
        <div v-else-if="!posts.length" class="text-center py-20">
          <p class="text-muted-foreground mb-4">No posts yet.</p>
          <NuxtLink
            to="/account/create"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Be the first to write
          </NuxtLink>
        </div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PostCard v-for="post in posts" :key="post._id" :post="post" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const posts = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await get('/posts')
    posts.value = res.data || []
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>