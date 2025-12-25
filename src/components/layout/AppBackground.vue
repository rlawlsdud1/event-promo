<script setup lang="ts">
import giftsImage from "../../assets/gifts.jpg";
</script>

<template>
  <div
    class="fixed inset-0 -z-10 bg-cover bg-center"
    :style="{ backgroundImage: `url(${giftsImage})` }"
  >
    <div
      class="absolute inset-0 bg-linear-to-br from-purple-900/70 via-purple-800/60 to-indigo-900/70"
    ></div>
  </div>
</template>
