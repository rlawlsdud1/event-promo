<script setup lang="ts">
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
import AppBackground from "./components/layout/AppBackground.vue";
import HomePage from "./pages/HomePage.vue";
</script>

<template>
  <AppBackground />

  <div class="min-h-screen relative flex flex-col">
    <AppHeader />

    <main class="flex-1">
      <HomePage />
    </main>

    <AppFooter />
  </div>
</template>
