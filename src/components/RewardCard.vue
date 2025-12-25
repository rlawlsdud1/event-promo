<script setup lang="ts">
import { ref, computed } from "vue";
import gsap from "gsap";
import type { Reward } from "../types";
import UsersIcon from "./icons/UsersIcon.vue";
import EyeIcon from "./icons/EyeIcon.vue";
import ArrowLeftIcon from "./icons/ArrowLeftIcon.vue";

interface Props {
  reward: Reward;
}

const props = defineProps<Props>();
const isFlipped = ref(false);
const cardRef = ref<HTMLElement | null>(null);
const imageLoaded = ref(false);

const handleImageLoad = () => {
  imageLoaded.value = true;
};

const toggleFlip = () => {
  if (!cardRef.value) return;

  const newRotation = isFlipped.value ? 0 : 180;

  gsap.to(cardRef.value, {
    rotationY: newRotation,
    duration: 0.6,
    ease: "power2.inOut",
    force3D: true,
    transformStyle: "preserve-3d",
  });

  isFlipped.value = !isFlipped.value;
};

const chipColor = computed(() => {
  if (props.reward.rank === 1)
    return "bg-linear-to-br from-amber-400 via-yellow-400 to-amber-600 border-amber-500/30";
  if (props.reward.rank === 2)
    return "bg-linear-to-br from-slate-300 via-gray-200 to-slate-400 border-slate-400/30";
  return "bg-linear-to-br from-orange-500 via-amber-600 to-orange-700 border-orange-600/30";
});

const chipTextColor = computed(() => {
  if (props.reward.rank === 1) return "text-amber-950";
  if (props.reward.rank === 2) return "text-slate-700";
  return "text-orange-950";
});
</script>

<template>
  <div
    class="w-72 h-72 cursor-pointer perspective-1000 group"
    @click="toggleFlip"
  >
    <div
      ref="cardRef"
      class="reward-card relative w-full h-full transform-style-3d"
    >
      <div
        class="card-face absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white"
      >
        <div class="h-full flex flex-col relative">
          <div class="relative h-40 overflow-hidden">
            <div
              class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent z-10"
            ></div>

            <div class="absolute top-3 right-3 z-20">
              <div
                :class="[
                  'px-3 py-2 rounded-full backdrop-blur-sm shadow-lg border whitespace-nowrap',
                  chipColor,
                ]"
              >
                <div class="flex items-center justify-center gap-1.5 h-4">
                  <UsersIcon :class="`h-4 w-4 shrink-0 ${chipTextColor}`" />
                  <span :class="['text-xs font-bold leading-4', chipTextColor]"
                    >{{ reward.count }}명</span
                  >
                </div>
              </div>
            </div>

            <div
              v-if="!imageLoaded"
              class="absolute inset-0 skeleton-shimmer"
            ></div>

            <img
              :src="reward.image"
              :alt="reward.name"
              :class="[
                'w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700',
                { 'opacity-0': !imageLoaded },
              ]"
              @load="handleImageLoad"
            />
          </div>

          <div
            class="flex-1 p-5 flex flex-col justify-center items-center relative bg-linear-to-b from-white to-purple-50/30"
          >
            <div
              class="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-200 to-transparent"
            ></div>

            <h3
              class="text-base sm:text-lg md:text-xl font-bold text-gray-900 text-center mb-4"
            >
              {{ reward.name }}
            </h3>

            <div
              class="mt-auto flex items-center gap-2 text-gray-400 text-xs sm:text-sm group-hover:text-purple-600 transition-colors"
            >
              <EyeIcon class="h-4 w-4" />
              <span class="font-medium">자세히 보기</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="card-face absolute w-full h-full backface-hidden rounded-2xl shadow-xl overflow-hidden rotate-y-180 bg-linear-to-br from-purple-600 via-purple-700 to-indigo-700"
      >
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute inset-0"
            style="
              background-image: radial-gradient(
                circle at 20px 20px,
                white 2px,
                transparent 0
              );
              background-size: 40px 40px;
            "
          ></div>
        </div>

        <div
          class="h-full p-6 flex flex-col justify-center text-white relative z-10"
        >
          <div class="mb-4">
            <div
              class="w-10 h-1 bg-linear-to-r from-yellow-300 to-pink-300 rounded-full mb-3"
            ></div>
            <h3 class="text-xl font-bold mb-3 drop-shadow-lg">
              {{ reward.name }}
            </h3>
            <p class="text-sm leading-relaxed text-white/90">
              {{ reward.backDescription }}
            </p>
          </div>

          <div class="mt-auto pt-4 border-t border-white/20">
            <div
              class="flex items-center justify-center gap-2 text-white/80 text-xs hover:text-white transition-colors"
            >
              <ArrowLeftIcon class="h-3.5 w-3.5" />
              <span class="font-medium">뒤로 가기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.skeleton-shimmer {
  background: linear-gradient(
    110deg,
    #f3f4f6 8%,
    #e5e7eb 18%,
    #d1d5db 33%,
    #e5e7eb 45%,
    #f3f4f6 55%
  );
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
