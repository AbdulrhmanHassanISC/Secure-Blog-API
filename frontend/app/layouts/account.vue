<template>
  <div class="flex min-h-[calc(100vh-4rem)]">
    <!-- Sidebar -->
    <aside class="w-64 shrink-0 border-r bg-background hidden md:flex flex-col">
      <div class="p-4 border-b">
        <p class="text-sm font-semibold truncate">{{ auth.user.value?.username || 'Account' }}</p>
        <p class="text-xs text-muted-foreground truncate">{{ auth.user.value?.email }}</p>
      </div>
      <nav class="p-2 space-y-0.5 flex-1 overflow-y-auto">
        <p class="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</p>

        <NuxtLink
          v-for="item in userLinks"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="isAccountActive(item.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          {{ item.label }}
        </NuxtLink>

        <template v-if="auth.isAdmin.value">
          <p class="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</p>
          <NuxtLink
            v-for="item in adminLinks"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="isAccountActive(item.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>
      <!-- Sidebar footer -->
      <div class="p-3 border-t space-y-1">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Visit Site
        </NuxtLink>
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile sidebar toggle -->
    <button
      @click="mobileSidebar = !mobileSidebar"
      class="md:hidden fixed bottom-4 left-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Mobile sidebar overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileSidebar" class="md:hidden fixed inset-0 z-30 bg-black/50" @click="mobileSidebar = false"></div>
    </Transition>

    <!-- Mobile sidebar panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside v-if="mobileSidebar" class="md:hidden fixed inset-y-0 left-0 z-40 w-72 bg-background border-r shadow-xl">
        <div class="p-4 border-b flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold">{{ auth.user.value?.username }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ auth.user.value?.email }}</p>
          </div>
          <button @click="mobileSidebar = false" class="p-1 rounded-md hover:bg-accent">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="p-2 space-y-0.5 overflow-y-auto h-full pb-20">
          <p class="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</p>
          <NuxtLink
            v-for="item in userLinks"
            :key="item.to"
            :to="item.to"
            @click="mobileSidebar = false"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="isAccountActive(item.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </NuxtLink>
          <template v-if="auth.isAdmin.value">
            <p class="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</p>
            <NuxtLink
              v-for="item in adminLinks"
              :key="item.to"
              :to="item.to"
              @click="mobileSidebar = false"
              class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
              :class="isAccountActive(item.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
            >
              <component :is="item.icon" class="w-4 h-4 shrink-0" />
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>
        <!-- Mobile sidebar footer -->
        <div class="p-2 border-t space-y-1">
          <NuxtLink
            to="/"
            @click="mobileSidebar = false"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Visit Site
          </NuxtLink>
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Content -->
    <main class="flex-1 min-w-0">
      <div class="max-w-5xl mx-auto px-4 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth()
const route = useRoute()
const mobileSidebar = ref(false)

const UserDashboardIcon = defineComponent({
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
  ])
})

const PostIcon = defineComponent({
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' })
  ])
})

const CreateIcon = defineComponent({
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4v16m8-8H4' })
  ])
})

const ProfileIcon = defineComponent({
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
  ])
})

const UsersIcon = defineComponent({
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' })
  ])
})

const CategoryIcon = defineComponent({
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-4 h-4', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })
  ])
})

const userLinks = [
  { label: 'Overview', to: '/account', icon: UserDashboardIcon },
  { label: 'My Posts', to: '/account/posts', icon: PostIcon },
  { label: 'Create Post', to: '/account/create', icon: CreateIcon },
  { label: 'My Profile', to: '/account/profile', icon: ProfileIcon },
]

const adminLinks = [
  { label: 'All Posts', to: '/admin/posts', icon: PostIcon },
  { label: 'Users', to: '/admin/users', icon: UsersIcon },
  { label: 'Categories', to: '/admin/categories', icon: CategoryIcon },
]

const handleLogout = () => {
  mobileSidebar.value = false
  auth.logout()
}

const isAccountActive = (path: string) => {
  if (path === '/account') return route.path === '/account'
  return route.path.startsWith(path)
}

watch(() => route.path, () => {
  mobileSidebar.value = false
})
</script>
