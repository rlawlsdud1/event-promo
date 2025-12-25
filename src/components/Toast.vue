<script setup lang="ts">
import { computed } from "vue";
import CheckIcon from "./icons/CheckIcon.vue";
import ErrorIcon from "./icons/ErrorIcon.vue";

type ToastType = "success" | "error";

interface Props {
  show: boolean;
  type?: ToastType;
  title: string;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "success",
  message: "",
});

const toastConfig = computed(() => {
  const configs = {
    success: {
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      icon: CheckIcon,
    },
    error: {
      gradient: "from-red-500 via-rose-500 to-pink-500",
      icon: ErrorIcon,
    },
  };

  return configs[props.type];
});
</script>

<template>
  <Transition name="slide-down">
    <div
      v-if="show"
      class="fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-50 w-auto max-w-lg px-4 sm:px-0"
    >
      <div
        :class="[
          'relative backdrop-blur-xl bg-linear-to-r text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20',
          toastConfig.gradient,
        ]"
      >
        <div
          class="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl animate-pulse"
        ></div>
        <div class="relative flex items-center gap-2 sm:gap-3 md:gap-4">
          <div
            class="shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <component :is="toastConfig.icon" />
          </div>
          <div class="flex-1">
            <p class="font-bold text-sm sm:text-base md:text-lg mb-0.5">
              {{ title }}
            </p>
            <p v-if="message" class="text-xs sm:text-sm text-white/90">
              {{ message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
