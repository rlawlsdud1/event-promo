<script setup lang="ts">
import { useCountdown } from "../composables/useCountdown";

interface Props {
  endDate: string;
}

const props = defineProps<Props>();
const { timeRemaining } = useCountdown(props.endDate);
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="grid grid-cols-4 gap-3 md:gap-6">
      <div class="group relative">
        <div
          class="absolute inset-0 bg-linear-to-br from-purple-400 to-indigo-400 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"
        ></div>
        <div
          class="relative bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl px-2 py-4 md:px-4 md:py-6 text-center text-white shadow-xl transform group-hover:scale-105 transition-transform duration-300"
        >
          <div class="text-2xl md:text-6xl font-black mb-2 tracking-tight">
            {{ String(timeRemaining.days).padStart(2, "0") }}
          </div>
          <div
            class="text-[10px] sm:text-xs md:text-sm font-semibold opacity-90 uppercase tracking-normal text-center"
          >
            Days
          </div>
        </div>
      </div>

      <div class="group relative">
        <div
          class="absolute inset-0 bg-linear-to-br from-purple-400 to-indigo-400 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"
        ></div>
        <div
          class="relative bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl px-2 py-4 md:px-4 md:py-6 text-center text-white shadow-xl transform group-hover:scale-105 transition-transform duration-300"
        >
          <div class="text-2xl md:text-6xl font-black mb-2 tracking-tight">
            {{ String(timeRemaining.hours).padStart(2, "0") }}
          </div>
          <div
            class="text-[10px] sm:text-xs md:text-sm font-semibold opacity-90 uppercase tracking-normal text-center"
          >
            Hours
          </div>
        </div>
      </div>

      <div class="group relative">
        <div
          class="absolute inset-0 bg-linear-to-br from-purple-400 to-indigo-400 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"
        ></div>
        <div
          class="relative bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl px-2 py-4 md:px-4 md:py-6 text-center text-white shadow-xl transform group-hover:scale-105 transition-transform duration-300"
        >
          <div class="text-2xl md:text-6xl font-black mb-2 tracking-tight">
            {{ String(timeRemaining.minutes).padStart(2, "0") }}
          </div>
          <div
            class="text-[10px] sm:text-xs md:text-sm font-semibold opacity-90 uppercase tracking-normal text-center"
          >
            Mins
          </div>
        </div>
      </div>

      <div class="group relative">
        <div
          class="absolute inset-0 bg-linear-to-br from-purple-400 to-indigo-400 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"
        ></div>
        <div
          class="relative bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl px-2 py-4 md:px-4 md:py-6 text-center text-white shadow-xl transform group-hover:scale-105 transition-transform duration-300"
        >
          <div class="text-2xl md:text-6xl font-black mb-2 tracking-tight">
            {{ String(timeRemaining.seconds).padStart(2, "0") }}
          </div>
          <div
            class="text-[10px] sm:text-xs md:text-sm font-semibold opacity-90 uppercase tracking-normal text-center"
          >
            Secs
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
