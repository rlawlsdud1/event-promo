<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getEventInfo } from "../services/api";
import type { EventData } from "../types";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import CountdownTimer from "../components/CountdownTimer.vue";
import RewardCard from "../components/RewardCard.vue";
import EntryFormModal from "../components/EntryFormModal.vue";
import { useScrollReveal } from "../composables/useScrollReveal";
import GiftIcon from "../components/icons/GiftIcon.vue";
import DocumentIcon from "../components/icons/DocumentIcon.vue";
import WarningIcon from "../components/icons/WarningIcon.vue";
import RocketIcon from "../components/icons/RocketIcon.vue";
import Toast from "../components/Toast.vue";

const eventData = ref<EventData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const isModalOpen = ref(false);
const showSuccessMessage = ref(false);

const eventInfoRef = ref<HTMLElement | null>(null);
const rewardsRef = ref<HTMLElement | null>(null);
const howToRef = ref<HTMLElement | null>(null);
const noticeRef = ref<HTMLElement | null>(null);

const sections = [eventInfoRef, rewardsRef, howToRef, noticeRef];
sections.forEach((s) => {
  useScrollReveal(s);
});

onMounted(async () => {
  try {
    eventData.value = await getEventInfo();

    // 이미지 preload
    if (eventData.value?.rewards) {
      const imagePromises = eventData.value.rewards.map((reward) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = reward.image;
        });
      });

      await Promise.race([
        Promise.all(imagePromises),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
  } finally {
    loading.value = false;
  }
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSuccess = () => {
  showSuccessMessage.value = true;
  setTimeout(() => {
    showSuccessMessage.value = false;
  }, 2500);
};
</script>

<template>
  <div
    class="max-w-7xl w-full mx-auto px-4 py-12"
    :class="{ 'flex items-center min-h-[calc(100vh-200px)]': loading || error }"
  >
    <div
      v-if="loading"
      class="backdrop-blur-xl bg-white/50 rounded-2xl shadow-2xl p-12 text-center border border-white/40 w-full min-h-100 flex items-center justify-center"
    >
      <LoadingSpinner message="이벤트 정보를 불러오는 중입니다..." />
    </div>

    <div
      v-else-if="error"
      class="backdrop-blur-xl bg-red-50/90 border-2 border-red-200 rounded-2xl shadow-2xl p-8 text-center w-full"
    >
      <p class="text-xl text-red-600">⚠️ 에러: {{ error }}</p>
    </div>

    <div v-else class="space-y-8 w-full">
      <section
        ref="eventInfoRef"
        class="backdrop-blur-xl bg-white/50 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/40"
      >
        <div class="text-center mb-8">
          <span
            class="inline-block px-4 py-2 bg-linear-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-semibold mb-4"
          >
            🎊 특별 이벤트
          </span>
          <h2
            class="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            {{ eventData?.title || "이벤트 정보를 불러오는 중..." }}
          </h2>
          <p
            class="text-sm sm:text-lg md:text-xl leading-relaxed mb-8 text-gray-700"
          >
            {{ eventData?.description }}
          </p>

          <div v-if="eventData?.endDate" class="mt-8">
            <h3 class="text-lg sm:text-xl font-bold text-purple-600 mb-4">
              ⏰ 이벤트 종료까지
            </h3>
            <CountdownTimer :endDate="eventData.endDate" />
          </div>
        </div>
      </section>

      <section
        ref="rewardsRef"
        class="backdrop-blur-xl bg-white/50 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/40"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="p-3 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg"
          >
            <GiftIcon class="h-6 w-6 text-white" />
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
            이벤트 경품
          </h3>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          <template v-if="eventData?.rewards">
            <RewardCard
              v-for="reward in eventData.rewards"
              :key="reward.id"
              :reward="reward"
            />
          </template>
        </div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section
          ref="howToRef"
          class="backdrop-blur-xl bg-white/50 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/40"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="p-3 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg"
            >
              <DocumentIcon class="h-6 w-6 text-white" />
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
              참여 방법
            </h3>
          </div>
          <div class="space-y-5">
            <div class="flex gap-4 items-start">
              <div
                class="shrink-0 w-10 h-10 bg-linear-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center"
              >
                <span class="text-purple-600 font-bold text-base sm:text-lg"
                  >1</span
                >
              </div>
              <div class="flex-1 pt-1">
                <p class="text-gray-800 font-semibold text-base sm:text-lg">
                  이벤트 정보 확인하기
                </p>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">
                  경품과 이벤트 기간을 확인하세요
                </p>
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <div
                class="shrink-0 w-10 h-10 bg-linear-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center"
              >
                <span class="text-purple-600 font-bold text-base sm:text-lg"
                  >2</span
                >
              </div>
              <div class="flex-1 pt-1">
                <p class="text-gray-800 font-semibold text-base sm:text-lg">
                  응모 폼 작성하기
                </p>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">
                  정확한 정보를 입력해주세요
                </p>
              </div>
            </div>
            <div class="flex gap-4 items-start">
              <div
                class="shrink-0 w-10 h-10 bg-linear-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center"
              >
                <span class="text-purple-600 font-bold text-base sm:text-lg"
                  >3</span
                >
              </div>
              <div class="flex-1 pt-1">
                <p class="text-gray-800 font-semibold text-base sm:text-lg">
                  제출 완료!
                </p>
                <p class="text-xs sm:text-sm text-gray-600 mt-1">
                  당첨 발표를 기다려주세요
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          ref="noticeRef"
          class="backdrop-blur-xl bg-white/50 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/40"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="p-3 bg-linear-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg"
            >
              <WarningIcon class="h-6 w-6 text-white" />
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
              유의사항
            </h3>
          </div>
          <div class="space-y-4">
            <div class="flex gap-3 items-start p-4 bg-red-50/50 rounded-xl">
              <div class="shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                이벤트 기간 내에만 참여 가능합니다
              </p>
            </div>
            <div class="flex gap-3 items-start p-4 bg-red-50/50 rounded-xl">
              <div class="shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                중복 응모는 불가능합니다
              </p>
            </div>
            <div class="flex gap-3 items-start p-4 bg-red-50/50 rounded-xl">
              <div class="shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                당첨자는 개별 연락 예정입니다
              </p>
            </div>
          </div>
        </section>
      </div>

      <Toast
        :show="showSuccessMessage"
        type="success"
        title="응모 완료!"
        message="행운을 빕니다"
      />

      <div class="mt-12 text-center">
        <button
          @click="openModal"
          class="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-base sm:text-lg md:text-xl font-black rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.7)] transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          ></div>
          <div
            class="absolute inset-0 bg-linear-to-br from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <RocketIcon />
          <span class="relative z-10">지금 바로 응모하기</span>
          <div
            class="absolute -right-2 -bottom-2 w-20 h-20 bg-purple-300/20 rounded-full blur-xl group-hover:bg-purple-300/40 transition-all duration-300"
          ></div>
        </button>
      </div>
    </div>
  </div>

  <EntryFormModal
    :is-open="isModalOpen"
    @close="closeModal"
    @success="handleSuccess"
  />
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
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
