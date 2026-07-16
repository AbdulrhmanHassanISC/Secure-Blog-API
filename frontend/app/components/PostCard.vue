<template>
  <article class="group relative flex flex-col rounded-xl border bg-card text-card-foreground overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div v-if="coverImage" class="aspect-video overflow-hidden bg-muted">
      <img
        :src="coverImage"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div v-else class="aspect-video bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    </div>
    <div class="flex-1 flex flex-col p-5">
      <div class="flex items-center gap-2 mb-2">
        <NuxtLink
          v-if="categoryName"
          :to="`/categories/${categoryId}`"
          @click.stop
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {{ categoryName }}
        </NuxtLink>
      </div>
      <h2 class="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        <NuxtLink :to="`/posts/${post._id}`">
          {{ post.title }}
        </NuxtLink>
      </h2>
      <p class="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{{ post.content }}</p>
      <div class="flex items-center justify-between pt-4 border-t">
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formatDate(post.createdAt) }}
        </div>
        <NuxtLink
          :to="`/posts/${post._id}`"
          class="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          Read
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: {
    _id: string
    title: string
    content: string
    images?: string[]
    category?: any
    createdAt: string
  }
}>()

const coverImage = computed(() => {
  return props.post.images?.length ? getImageUrl(props.post.images[0]) : ''
})

const categoryName = computed(() => {
  if (typeof props.post.category === 'object' && props.post.category?.name) {
    return props.post.category.name
  }
  return null
})

const categoryId = computed(() => {
  if (typeof props.post.category === 'object' && props.post.category?._id) {
    return props.post.category._id
  }
  return props.post.category
})

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})
</script>
