<template>
  <footer class="border-t bg-muted/30 mt-auto">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center gap-2 mb-3">
            <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span class="text-lg font-bold">Bloger</span>
          </div>
          <p class="text-sm text-muted-foreground max-w-xs">Discover stories, ideas, and expertise from writers on any topic.</p>
        </div>
        <div>
          <h4 class="font-semibold text-sm mb-3">Explore</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><NuxtLink to="/" class="hover:text-foreground transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/categories" class="hover:text-foreground transition-colors">Categories</NuxtLink></li>
            <li><NuxtLink to="/search" class="hover:text-foreground transition-colors">Search</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-sm mb-3">Account</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><NuxtLink to="/login" class="hover:text-foreground transition-colors">Login</NuxtLink></li>
            <li><NuxtLink to="/register" class="hover:text-foreground transition-colors">Register</NuxtLink></li>
            <li><NuxtLink to="/account/create" class="hover:text-foreground transition-colors">Write a Post</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-sm mb-3">Support</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><NuxtLink to="/account" class="hover:text-foreground transition-colors">Dashboard</NuxtLink></li>
            <li><NuxtLink to="/account/posts" class="hover:text-foreground transition-colors">My Posts</NuxtLink></li>
            <li><NuxtLink to="/account/profile" class="hover:text-foreground transition-colors">Profile</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} Bloger. All rights reserved.
      </div>
    </div>
  </footer>
</template>
