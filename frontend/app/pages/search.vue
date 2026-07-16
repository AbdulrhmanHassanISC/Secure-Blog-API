<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Search</h1>
      <p class="text-muted-foreground mt-1">Find posts by title or content</p>
    </div>

    <form @submit.prevent="handleSearch" class="mb-10">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="query"
          type="search"
          autofocus
          placeholder="Search posts..."
          class="w-full pl-11 pr-4 py-3 text-base border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
        />
      </div>
    </form>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Searching...</div>
    <div v-else-if="searched">
      <p class="text-sm text-muted-foreground mb-4">
        {{ results.length }} result{{ results.length === 1 ? '' : 's' }} for "{{ lastQuery }}"
      </p>
      <div v-if="!results.length" class="rounded-2xl border border-dashed bg-card p-12 text-center text-muted-foreground">
        No posts found. Try a different search term.
      </div>
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostCard v-for="post in results" :key="post._id" :post="post" />
      </div>
    </div>
    <div v-else class="rounded-2xl border border-dashed bg-card p-12 text-center text-muted-foreground">
      Enter a search term to find posts.
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { get } = useApi()
const query = ref((route.query.q as string) || '')
const lastQuery = ref('')
const results = ref<any[]>([])
const loading = ref(false)
const searched = ref(false)

const handleSearch = async () => {
  if (!query.value.trim()) {
    results.value = []
    searched.value = false
    return
  }
  loading.value = true
  searched.value = true
  lastQuery.value = query.value
  await navigateTo({ path: '/search', query: { q: query.value } }, { replace: true })
  try {
    const res = await get('/posts')
    const q = query.value.toLowerCase()
    results.value = (res.data || []).filter((p: any) =>
      p.title?.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q)
    )
  } catch (e: any) {
    console.error(e)
    results.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (query.value) {
    await handleSearch()
  }
})
</script>
