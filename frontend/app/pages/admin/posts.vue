<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">All Posts</h1>
      <p class="text-muted-foreground text-sm mt-1">Manage every post on the platform</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading posts...</div>
    <div v-else-if="!posts.length" class="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">No posts found.</div>
    <div v-else class="overflow-x-auto rounded-xl border">
      <table class="w-full">
        <thead class="bg-muted/50 border-b text-left">
          <tr>
            <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Author</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date</th>
            <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="post in posts" :key="post._id" class="hover:bg-muted/30 transition-colors">
            <td class="px-4 py-3">
              <p class="text-sm font-medium truncate max-w-xs">{{ post.title }}</p>
              <p class="text-xs text-muted-foreground line-clamp-1">{{ post.content }}</p>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="text-sm text-muted-foreground">{{ authorName(post) }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{{ formatDate(post.createdAt) }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <NuxtLink :to="`/posts/${post._id}`" class="px-2 py-1 text-xs rounded-md hover:bg-accent transition-colors">View</NuxtLink>
                <button @click="handleDelete(post._id)" class="px-2 py-1 text-xs rounded-md text-destructive hover:bg-destructive/10 transition-colors">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'account' })

const { get, del } = useApi()
const auth = useAuth()
const posts = ref<any[]>([])
const loading = ref(true)

const authorName = (post: any) => {
  if (typeof post.author === 'object' && post.author?.username) return post.author.username
  return 'Unknown'
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

const handleDelete = async (id: string) => {
  if (!confirm('Delete this post?')) return
  try {
    await del(`/posts/${id}`)
    posts.value = posts.value.filter(p => p._id !== id)
  } catch (e: any) {
    alert(e.message)
  }
}

onMounted(async () => {
  if (!auth.isAdmin.value) { await navigateTo('/account'); return }
  try {
    const res = await get('/posts')
    posts.value = res.data || []
  } catch { } finally {
    loading.value = false
  }
})
</script>
