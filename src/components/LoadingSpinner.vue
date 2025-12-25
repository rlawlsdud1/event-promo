<script setup lang="ts">
interface Props {
  size?: "sm" | "md" | "lg";
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  message: "로딩 중...",
});

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

const borderClasses = {
  sm: "border-2",
  md: "border-4",
  lg: "border-6",
};
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="relative" :class="sizeClasses[size]">
      <div
        class="absolute inset-0 rounded-full"
        :class="[borderClasses[size], 'border-purple-200']"
      ></div>
      <div
        class="absolute inset-0 rounded-full border-t-transparent animate-spin"
        :class="[borderClasses[size], 'border-purple-600']"
      ></div>
    </div>

    <p
      v-if="message"
      class="mt-4 text-gray-700 font-medium"
      :class="{
        'text-sm': size === 'sm',
        'text-xl': size === 'md',
        'text-2xl': size === 'lg',
      }"
    >
      {{ message }}
    </p>
  </div>
</template>
