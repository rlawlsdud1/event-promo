<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEventInfo } from './services/api'
import type { EventData } from './types'

const eventData = ref<EventData | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    eventData.value = await getEventInfo()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-purple-600 via-purple-700 to-indigo-800 flex flex-col">
    <!-- Header -->
    <header class="bg-white/95 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl md:text-4xl font-bold text-purple-600 text-center">
          🎉 이벤트 프로모션
        </h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-xl shadow-xl p-8 text-center">
        <div class="animate-pulse">
          <p class="text-xl text-gray-600">로딩 중...</p>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="bg-red-50 border-2 border-red-200 rounded-xl shadow-xl p-8 text-center"
      >
        <p class="text-xl text-red-600">⚠️ 에러: {{ error }}</p>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8">
        <!-- Event Info Section -->
        <section class="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-bold text-purple-600 mb-4">
            {{ eventData?.title || '이벤트 정보를 불러오는 중...' }}
          </h2>
          <p class="text-gray-700 text-lg">
            {{ eventData?.description }}
          </p>
        </section>

        <!-- 여기에 나머지 컴포넌트들이 추가될 예정 -->
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-black/80 text-white text-center py-6 mt-auto">
      <p>&copy; 2025 Event Promo Page</p>
    </footer>
  </div>
</template>
