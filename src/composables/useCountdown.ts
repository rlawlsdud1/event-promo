import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function useCountdown(endDate: string) {
  const now = ref(Date.now())
  let interval: ReturnType<typeof setInterval> | null = null

  const timeRemaining = computed<TimeRemaining>(() => {
    const end = new Date(endDate).getTime()
    const diff = end - now.value

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false
    }
  })

  onMounted(() => {
    interval = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
  })

  return {
    timeRemaining
  }
}
