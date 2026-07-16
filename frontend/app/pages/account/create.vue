<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Create Post</h1>
      <p class="text-muted-foreground text-sm mt-1">Share your story with the community</p>
    </div>

    <form @submit.prevent="handleCreate" class="rounded-xl border bg-card p-6 space-y-5">
      <div>
        <label class="block text-sm font-medium mb-1.5">Title</label>
        <input v-model="title" required class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition" placeholder="A catchy title..." />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Category</label>
        <div class="relative" ref="categoryDropdownRef">
          <button
            type="button"
            @click="categoryOpen = !categoryOpen"
            :disabled="categoriesLoading"
            class="w-full flex items-center justify-between px-3 py-2 text-sm border border-input bg-background rounded-md hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition disabled:opacity-50"
          >
            <span class="flex items-center gap-2 truncate">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span v-if="selectedCategory" class="truncate">{{ selectedCategory.name }}</span>
              <span v-else class="text-muted-foreground">Select a category...</span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground shrink-0 transition-transform" :class="categoryOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="categoryOpen"
              class="absolute z-10 mt-1 w-full origin-top rounded-md border bg-popover text-popover-foreground shadow-lg"
            >
              <div class="p-1 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  @click="selectCategory(null)"
                  class="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
                  :class="!category ? 'bg-accent' : ''"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                  </svg>
                  No category
                </button>
                <div v-if="categoriesLoading" class="px-3 py-2 text-sm text-muted-foreground text-center">Loading...</div>
                <div v-else-if="!categories.length" class="px-3 py-2 text-sm text-muted-foreground text-center">No categories</div>
                <button
                  v-for="cat in categories"
                  :key="cat._id"
                  type="button"
                  @click="selectCategory(cat)"
                  class="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
                  :class="category === cat._id ? 'bg-accent' : ''"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span class="truncate">{{ cat.name }}</span>
                  <svg v-if="category === cat._id" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Content</label>
        <textarea v-model="content" required rows="14" class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition resize-y" placeholder="Start writing..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Cover images</label>
        <label class="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-input rounded-md cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm text-muted-foreground">Upload images</span>
          <span class="text-xs text-muted-foreground mt-1">PNG, JPG, GIF (max 5MB each)</span>
          <input type="file" multiple accept="image/jpeg,image/png,image/gif" @change="handleFileChange" class="hidden" />
        </label>
        <div v-if="files.length" class="mt-3 flex flex-wrap gap-2">
          <div v-for="(f, i) in files" :key="i" class="relative group">
            <img :src="URL.createObjectURL(f)" class="w-20 h-20 object-cover rounded-md border" />
            <button type="button" @click="files.splice(i, 1)" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">x</button>
          </div>
        </div>
      </div>

      <p v-if="error" class="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{{ error }}</p>

      <div class="flex items-center justify-end gap-3 pt-2">
        <NuxtLink to="/account" class="px-4 py-2 text-sm font-medium rounded-md border hover:bg-accent transition-colors">Cancel</NuxtLink>
        <button type="submit" :disabled="loading" class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm">
          {{ loading ? 'Publishing...' : 'Publish' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'account' })
const { upload, get } = useApi()
const auth = useAuth()
const router = useRouter()
const title = ref('')
const content = ref('')
const category = ref<string | null>(null)
const files = ref<File[]>([])
const error = ref('')
const loading = ref(false)
const categories = ref<any[]>([])
const categoriesLoading = ref(false)
const categoryOpen = ref(false)
const categoryDropdownRef = ref<HTMLElement | null>(null)

const selectedCategory = computed(() => categories.value.find(c => c._id === category.value))

const selectCategory = (cat: any) => {
  category.value = cat?._id || null
  categoryOpen.value = false
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  files.value = [...files.value, ...Array.from(target.files || [])]
}

onMounted(async () => {
  categoriesLoading.value = true
  try {
    const res = await get('/categories')
    categories.value = res.data || []
  } catch { } finally {
    categoriesLoading.value = false
  }
})

const handleCreate = async () => {
  error.value = ''
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('content', content.value)
    formData.append('author', auth.user.value?.userId || '')
    if (category.value) formData.append('category', category.value)
    files.value.forEach(f => formData.append('post', f))
    await upload('/posts', formData)
    await router.push('/account/posts')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target as Node)) {
    categoryOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
