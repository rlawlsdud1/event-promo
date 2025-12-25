import { type Ref, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  opacity?: number;
  duration?: number;
  ease?: string;
  start?: string;
  delay?: number;
  y?: number;
}

export const useScrollReveal = (
  ref: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) => {
  const {
    duration = 1,
    ease = "power2.out",
    start = "top 85%",
    delay = 0,
    y = 50,
  } = options;

  let animation: gsap.core.Tween | null = null;

  watch(
    ref,
    (element) => {
      if (!element || animation) return;

      // 초기 상태를 미리 설정 (GPU 가속 활성화)
      gsap.set(element, {
        opacity: 0,
        y: y,
        force3D: true,
        willChange: "opacity, transform"
      });

      animation = gsap.to(element, {
        opacity: 1,
        y: 0,
        duration,
        ease,
        delay,
        force3D: true,
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: "play none none none",
        },
        onComplete: () => {
          // 애니메이션 완료 후 will-change 제거
          if (element) {
            element.style.willChange = "auto";
          }
        }
      });
    },
    { immediate: true }
  );
};
