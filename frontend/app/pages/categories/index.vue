<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Categories</h1>
      <p class="text-muted-foreground mt-1">Explore posts by topic</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading categories...</div>
    <div v-else-if="error" class="text-center py-20 text-destructive">{{ error }}</div>
    <div v-else-if="!categories.length" class="rounded-2xl border border-dashed bg-card p-12 text-center">
      <p class="text-muted-foreground">No categories yet.</p>
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <CategoryCard v-for="cat in categories" :key="cat._id" :category="cat" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const categories = ref<any[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await get('/categories')
    categories.value = res.data || []
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>
