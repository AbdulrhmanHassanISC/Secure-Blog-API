<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <Navbar />
    <main class="flex-1 w-full">
      <slot />
    </main>
    <Footer />
  </div>
</template>
