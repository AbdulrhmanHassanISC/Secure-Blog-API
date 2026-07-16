<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">My Profile</h1>
      <p class="text-muted-foreground text-sm mt-1">Update your personal information</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading...</div>
    <form v-else @submit.prevent="handleUpdate" class="rounded-xl border bg-card p-6 space-y-5">
      <div class="flex items-center gap-5 pb-6 border-b">
        <div class="relative group">
          <img v-if="avatarPreview" :src="avatarPreview" class="w-20 h-20 rounded-full object-cover ring-4 ring-background" />
          <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-background">
            {{ profile?.username?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div v-if="avatarUploading" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <svg class="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <label v-else class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <input type="file" accept="image/jpeg,image/png,image/gif" class="hidden" @change="handleAvatarChange" />
          </label>
        </div>
        <div class="flex-1">
          <p class="font-semibold text-lg">{{ profile?.username }}</p>
          <p class="text-sm text-muted-foreground">{{ profile?.email }}</p>
          <span v-if="profile?.role && profile.role !== 'user'" class="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">{{ profile?.role }}</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Username</label>
        <input v-model="username" class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1.5">Email</label>
        <input v-model="email" type="email" class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition" />
      </div>

      <p v-if="error" class="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{{ error }}</p>
      <p v-if="success" class="text-sm text-green-600 bg-green-500/10 px-3 py-2 rounded-md">{{ success }}</p>

      <div class="flex justify-end gap-3 pt-2">
        <NuxtLink to="/account" class="px-4 py-2 text-sm font-medium rounded-md border hover:bg-accent transition-colors">Cancel</NuxtLink>
        <button type="submit" :disabled="saving" class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'account' })
const { get, put, uploadPut } = useApi()
const auth = useAuth()
const profile = ref<any>(null)
const username = ref('')
const email = ref('')
const avatarFile = ref<File | null>(null)
const avatarPreview = ref('')
const loading = ref(true)
const saving = ref(false)
const avatarUploading = ref(false)
const error = ref('')
const success = ref('')

onMounted(async () => {
  try {
    const res = await get('/profile')
    profile.value = res.data?.user || res.data
    username.value = profile.value.username
    email.value = profile.value.email
    if (profile.value.avatar) {
      avatarPreview.value = getImageUrl(profile.value.avatar)
    }
    auth.user.value = { ...auth.user.value, avatar: profile.value.avatar }
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const handleAvatarChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
    await handleAvatarUpload()
  }
}

const handleAvatarUpload = async () => {
  if (!avatarFile.value) return
  avatarUploading.value = true
  error.value = ''
  success.value = ''
  try {
    const formData = new FormData()
    formData.append('avatar', avatarFile.value)
    const res = await uploadPut('/profile/avatar', formData)
    profile.value = res.data?.user || res.data
    avatarPreview.value = getImageUrl(profile.value.avatar)
    success.value = 'Avatar updated successfully'
    auth.user.value = { ...auth.user.value, avatar: profile.value.avatar }
    avatarFile.value = null
  } catch (e: any) {
    error.value = e.message
  } finally {
    avatarUploading.value = false
  }
}

const handleUpdate = async () => {
  saving.value = true
  error.value = ''
  success.value = ''
  const id = auth.user.value?.userId
  if (!id) return
  try {
    await put(`/users/${id}`, { username: username.value, email: email.value })
    success.value = 'Profile updated'
    auth.user.value = { ...auth.user.value, username: username.value, email: email.value }
  } catch (e: any) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>
