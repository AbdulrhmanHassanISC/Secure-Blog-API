<template>
  <NuxtLink
    :to="`/categories/${category._id}`"
    class="group relative block rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/50 transition-all duration-200 overflow-hidden"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
    <div class="relative">
      <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      </div>
      <h3 class="font-semibold mb-1 group-hover:text-primary transition-colors">{{ category.name }}</h3>
      <p v-if="category.description" class="text-sm text-muted-foreground line-clamp-2">{{ category.description }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  category: {
    _id: string
    name: string
    slug: string
    description?: string
  }
}>()
</script>
