<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading category...</div>
    <div v-else-if="error" class="text-center py-20 text-destructive">{{ error }}</div>
    <template v-else-if="category">
      <NuxtLink to="/categories" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All categories
      </NuxtLink>
      <div class="rounded-2xl border bg-card p-8 mb-10">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2">{{ category.name }}</h1>
        <p v-if="category.description" class="text-muted-foreground">{{ category.description }}</p>
      </div>

      <section>
        <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Posts in this category</h2>
        <div v-if="!posts.length" class="rounded-2xl border border-dashed bg-card p-12 text-center text-muted-foreground">
          No posts in this category yet.
        </div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PostCard v-for="post in posts" :key="post._id" :post="post" />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { get } = useApi()
const category = ref<any>(null)
const posts = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await get(`/categories/${route.params.id}`)
    category.value = res.data
    const allPosts = await get('/posts')
    posts.value = (allPosts.data || []).filter((p: any) =>
      p.category === route.params.id
    )
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>
