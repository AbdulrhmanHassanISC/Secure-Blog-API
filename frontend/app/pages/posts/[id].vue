<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <NuxtLink to="/" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to posts
    </NuxtLink>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading post...</div>
    <div v-else-if="error" class="text-center py-20 text-destructive">{{ error }}</div>
    <article v-else-if="post" class="rounded-2xl border bg-card overflow-hidden">
      <div v-if="post.images?.length" class="aspect-video overflow-hidden bg-muted">
        <img :src="getImageUrl(post.images[0])" :alt="post.title" class="w-full h-full object-cover" />
      </div>
      <div class="p-8 md:p-12">
        <NuxtLink
          v-if="categoryName"
          :to="`/categories/${categoryId}`"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {{ categoryName }}
        </NuxtLink>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-6">{{ post.title }}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {{ authorInitial }}
            </div>
            <div>
              <p class="font-medium text-foreground">{{ authorName }}</p>
            </div>
          </div>
          <span class="hidden sm:inline">·</span>
          <div class="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(post.createdAt) }}
          </div>
        </div>
        <div class="prose prose-lg max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">{{ post.content }}</div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { get } = useApi()
const post = ref<any>(null)
const loading = ref(true)
const error = ref('')

const authorName = computed(() => {
  if (typeof post.value?.author === 'object' && post.value?.author?.username) {
    return post.value.author.username
  }
  return 'Unknown author'
})

const authorInitial = computed(() => authorName.value.charAt(0).toUpperCase())

const categoryName = computed(() => {
  if (typeof post.value?.category === 'object' && post.value?.category?.name) {
    return post.value.category.name
  }
  return null
})

const categoryId = computed(() => {
  if (typeof post.value?.category === 'object' && post.value?.category?._id) {
    return post.value.category._id
  }
  return post.value?.category
})

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

onMounted(async () => {
  try {
    const res = await get(`/posts/${route.params.id}`)
    post.value = res.data
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>
