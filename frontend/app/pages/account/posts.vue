<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">My Posts</h1>
        <p class="text-muted-foreground text-sm mt-1">Manage your published posts</p>
      </div>
      <NuxtLink to="/account/create" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Post
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading posts...</div>
    <div v-else-if="!myPosts.length" class="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">
      <p class="mb-3">You haven't written any posts yet</p>
      <NuxtLink to="/account/create" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        Write your first post
      </NuxtLink>
    </div>
    <div v-else class="space-y-3">
      <div v-for="post in myPosts" :key="post._id" class="rounded-xl border bg-card p-5 flex flex-wrap items-center justify-between gap-4 hover:border-primary/50 transition-colors">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <NuxtLink :to="`/posts/${post._id}`" class="font-semibold hover:text-primary transition-colors truncate">{{ post.title }}</NuxtLink>
          </div>
          <p class="text-sm text-muted-foreground line-clamp-1">{{ post.content }}</p>
          <p class="text-xs text-muted-foreground mt-1">{{ formatDate(post.createdAt) }}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <NuxtLink :to="`/posts/edit/${post._id}`" class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border hover:bg-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </NuxtLink>
          <button @click="handleDelete(post._id)" class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-destructive hover:bg-destructive/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'account' })
const { get, del } = useApi()
const auth = useAuth()
const myPosts = ref<any[]>([])
const loading = ref(true)

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const handleDelete = async (id: string) => {
  if (!confirm('Delete this post?')) return
  try {
    await del(`/posts/${id}`)
    myPosts.value = myPosts.value.filter(p => p._id !== id)
  } catch (e: any) {
    alert(e.message)
  }
}

onMounted(async () => {
  try {
    const res = await get('/posts')
    const userId = auth.user.value?.userId
    myPosts.value = (res.data || []).filter((p: any) => {
      if (auth.isAdmin.value) return true
      if (typeof p.author === 'string') return p.author === userId
      return p.author?._id === userId || p.author === userId
    })
  } catch (e: any) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
