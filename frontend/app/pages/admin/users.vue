<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">User Management</h1>
        <p class="text-muted-foreground mt-1">Manage all registered users</p>
      </div>
      <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {{ users.length }} users
      </span>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading users...</div>
    <div v-else-if="error" class="text-center py-20 text-destructive">{{ error }}</div>
    <div v-else class="rounded-2xl border bg-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted/50 border-b">
            <tr class="text-left">
              <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
              <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
              <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
              <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
              <th class="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="user in users" :key="user._id" class="hover:bg-muted/30 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {{ user.username?.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-medium">{{ user.username }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-muted-foreground">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span :class="roleBadgeClass(user.role)" class="px-2.5 py-0.5 rounded-full text-xs font-medium">{{ user.role }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-muted-foreground">{{ formatDate(user.createdAt) }}</td>
              <td class="px-6 py-4 text-right">
                <button @click="deleteUser(user._id)" class="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-destructive hover:bg-destructive/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'account' })

const { get, del } = useApi()
const auth = useAuth()
const users = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

const roleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-purple-500/10 text-purple-600'
    case 'superAdmin': return 'bg-red-500/10 text-red-600'
    default: return 'bg-muted text-muted-foreground'
  }
}

const deleteUser = async (id: string) => {
  if (!confirm('Delete this user? This cannot be undone.')) return
  try {
    await del(`/users/${id}`)
    users.value = users.value.filter(u => u._id !== id)
  } catch (e: any) {
    alert(e.message)
  }
}

onMounted(async () => {
  if (!auth.isAdmin.value) {
    error.value = 'Access denied. Admin only.'
    loading.value = false
    return
  }
  try {
    const res = await get('/users')
    users.value = Array.isArray(res) ? res : []
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>
