<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Categories</h1>
        <p class="text-muted-foreground text-sm mt-1">Create and manage categories</p>
      </div>
      <button @click="showCreateForm = true" class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        New Category
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading...</div>
    <template v-else>
      <!-- Create form -->
      <form v-if="showCreateForm" @submit.prevent="handleCreate" class="rounded-xl border bg-card p-5 mb-6 space-y-3">
        <input v-model="newName" placeholder="Category name" required minlength="3" class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <input v-model="newDescription" placeholder="Description (optional)" maxlength="300" class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <div class="flex gap-2 justify-end">
          <button type="button" @click="showCreateForm = false" class="px-3 py-1.5 text-sm rounded-md border hover:bg-accent transition-colors">Cancel</button>
          <button type="submit" :disabled="creating" class="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">{{ creating ? 'Creating...' : 'Create' }}</button>
        </div>
        <p v-if="formError" class="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{{ formError }}</p>
      </form>

      <div v-if="!categories.length" class="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">No categories.</div>
      <div v-else class="overflow-x-auto rounded-xl border">
        <table class="w-full">
          <thead class="bg-muted/50 border-b text-left">
            <tr>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Slug</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Description</th>
              <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="cat in categories" :key="cat._id" class="hover:bg-muted/30 transition-colors">
              <td class="px-4 py-3 text-sm font-medium">{{ cat.name }}</td>
              <td class="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{{ cat.slug }}</td>
              <td class="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell truncate max-w-xs">{{ cat.description || '—' }}</td>
              <td class="px-4 py-3 text-right">
                <button @click="handleDelete(cat._id)" class="px-2 py-1 text-xs rounded-md text-destructive hover:bg-destructive/10 transition-colors">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'account' })

const { get, post, del } = useApi()
const auth = useAuth()
const categories = ref<any[]>([])
const loading = ref(true)
const showCreateForm = ref(false)
const newName = ref('')
const newDescription = ref('')
const creating = ref(false)
const formError = ref('')

const handleCreate = async () => {
  formError.value = ''
  creating.value = true
  try {
    await post('/categories', { name: newName.value, description: newDescription.value })
    const res = await get('/categories')
    categories.value = res.data || []
    newName.value = ''
    newDescription.value = ''
    showCreateForm.value = false
  } catch (e: any) {
    formError.value = e.message
  } finally {
    creating.value = false
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('Delete this category?')) return
  try {
    await del(`/categories/${id}`)
    categories.value = categories.value.filter(c => c._id !== id)
  } catch (e: any) {
    alert(e.message)
  }
}

onMounted(async () => {
  if (!auth.isAdmin.value) { await navigateTo('/account'); return }
  try {
    const res = await get('/categories')
    categories.value = res.data || []
  } catch { } finally {
    loading.value = false
  }
})
</script>
