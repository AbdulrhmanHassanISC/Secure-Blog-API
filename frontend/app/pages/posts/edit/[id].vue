<template>
  <div class="max-w-2xl mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Edit post</h1>
      <p class="text-muted-foreground mt-1">Update your story</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-muted-foreground">Loading post...</div>
    <form v-else @submit.prevent="handleUpdate" class="rounded-2xl border bg-card p-8 space-y-5">
      <div>
        <label class="block text-sm font-medium mb-1.5">Title</label>
        <input v-model="title" required class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition" />
      </div>

      <!-- Category dropdown -->
      <div>
        <label class="block text-sm font-medium mb-1.5">Category</label>
        <div class="relative">
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
              class="absolute z-10 mt-1 w-full origin-top rounded-md border bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5 focus:outline-none"
            >
              <div class="p-1 max-h-60 overflow-y-auto">
                <button
                  type="button"
                  @click="selectCategory(null)"
                  class="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors flex items-center gap-2"
                  :class="!category ? 'bg-accent' : ''"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
                  </svg>
                  <span>No category</span>
                </button>
                <div v-if="categoriesLoading" class="px-3 py-2 text-sm text-muted-foreground text-center">
                  Loading categories...
                </div>
                <div v-else-if="!categories.length" class="px-3 py-2 text-sm text-muted-foreground text-center">
                  No categories available
                </div>
                <button
                  v-for="cat in categories"
                  :key="cat._id"
                  type="button"
                  @click="selectCategory(cat)"
                  class="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors flex items-center gap-2"
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
        <textarea v-model="content" required rows="14" class="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition resize-y"></textarea>
        <p class="text-xs text-muted-foreground mt-1">{{ content.length }} characters</p>
      </div>
      <div v-if="existingImages.length">
        <label class="block text-sm font-medium mb-1.5">Current images</label>
        <div class="flex gap-2 flex-wrap">
          <img v-for="img in existingImages" :key="img" :src="getImageUrl(img)" class="w-24 h-24 object-cover rounded-md border" />
        </div>
      </div>
      <p v-if="error" class="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{{ error }}</p>
      <div class="flex items-center justify-end gap-3 pt-2">
        <button type="button" @click="router.back()" class="px-4 py-2 text-sm font-medium rounded-md border hover:bg-accent transition-colors">Cancel</button>
        <button type="submit" :disabled="saving" class="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm">
          <svg v-if="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { get, put } = useApi()
const router = useRouter()
const title = ref('')
const content = ref('')
const category = ref<string | null>(null)
const existingImages = ref<string[]>([])
const error = ref('')
const loading = ref(true)
const saving = ref(false)

const categories = ref<any[]>([])
const categoriesLoading = ref(false)
const categoryOpen = ref(false)
const categoryDropdownRef = ref<HTMLElement | null>(null)

const selectedCategory = computed(() =>
  categories.value.find(c => c._id === category.value)
)

const selectCategory = (cat: any) => {
  category.value = cat?._id || null
  categoryOpen.value = false
}

const loadCategories = async () => {
  categoriesLoading.value = true
  try {
    const res = await get('/categories')
    categories.value = res.data || []
  } catch (e: any) {
    console.error(e)
  } finally {
    categoriesLoading.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  try {
    const res = await get(`/posts/${route.params.id}`)
    title.value = res.data.title
    content.value = res.data.content
    existingImages.value = res.data.images || []
    category.value = res.data.category?._id || res.data.category || null
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const handleUpdate = async () => {
  error.value = ''
  saving.value = true
  try {
    await put(`/posts/${route.params.id}`, {
      title: title.value,
      content: content.value,
      category: category.value,
    })
    await router.push(`/posts/${route.params.id}`)
  } catch (e: any) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target as Node)) {
    categoryOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
