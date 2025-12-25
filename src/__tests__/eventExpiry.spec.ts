import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref } from "vue";
import { useCountdown } from "../composables/useCountdown";

describe("이벤트 종료 시나리오", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("이벤트 종료 후 isExpired가 true를 반환한다", () => {
    const endDate = "2024-12-20";

    vi.setSystemTime(new Date("2024-12-25"));

    const { timeRemaining } = useCountdown(endDate);

    expect(timeRemaining.value.isExpired).toBe(true);
    expect(timeRemaining.value.days).toBe(0);
    expect(timeRemaining.value.hours).toBe(0);
    expect(timeRemaining.value.minutes).toBe(0);
    expect(timeRemaining.value.seconds).toBe(0);
  });

  it("이벤트 진행 중에는 isExpired가 false를 반환한다", () => {
    const endDate = "2025-12-31";

    vi.setSystemTime(new Date("2024-12-25"));

    const { timeRemaining } = useCountdown(endDate);

    expect(timeRemaining.value.isExpired).toBe(false);
    expect(timeRemaining.value.days).toBeGreaterThan(0);
  });

  it("이벤트 종료 시 응모 버튼 클릭 로직 테스트", () => {
    const endDate = "2024-12-20";
    vi.setSystemTime(new Date("2024-12-25"));

    const { timeRemaining } = useCountdown(endDate);
    const isEventExpired = ref(timeRemaining.value.isExpired);

    const showErrorMessage = ref(false);
    const errorMessage = ref("");
    const isModalOpen = ref(false);

    function openModal() {
      if (isEventExpired.value) {
        errorMessage.value = "이벤트가 종료되었습니다";
        showErrorMessage.value = true;
        return;
      }
      isModalOpen.value = true;
    }

    openModal();

    expect(showErrorMessage.value).toBe(true);
    expect(errorMessage.value).toBe("이벤트가 종료되었습니다");
    expect(isModalOpen.value).toBe(false);
  });

  it("이벤트 진행 중 응모 버튼 클릭 시 모달이 열린다", () => {
    const endDate = "2025-12-31";
    vi.setSystemTime(new Date("2024-12-25"));

    const { timeRemaining } = useCountdown(endDate);
    const isEventExpired = ref(timeRemaining.value.isExpired);

    const showErrorMessage = ref(false);
    const errorMessage = ref("");
    const isModalOpen = ref(false);

    function openModal() {
      if (isEventExpired.value) {
        errorMessage.value = "이벤트가 종료되었습니다";
        showErrorMessage.value = true;
        return;
      }
      isModalOpen.value = true;
    }

    openModal();

    expect(isModalOpen.value).toBe(true);
    expect(showErrorMessage.value).toBe(false);
  });
});
