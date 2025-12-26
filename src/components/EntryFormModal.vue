<script setup lang="ts">
import { ref, watch } from "vue";
import { submitEntry } from "../services/api";
import type { EntryFormData } from "../types";
import CloseIcon from "./icons/CloseIcon.vue";

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "success"): void;
  (e: "error", message: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref<EntryFormData>({
  name: "",
  phone: "",
  email: "",
  agreedTerms: false,
});

const errors = ref({
  name: "",
  phone: "",
  email: "",
  agreedTerms: "",
});

const isSubmitting = ref(false);
const submitError = ref("");

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

const validateName = (): boolean => {
  if (!formData.value.name.trim()) {
    errors.value.name = "이름을 입력해주세요";
    return false;
  }
  if (formData.value.name.trim().length < 2) {
    errors.value.name = "이름은 2자 이상이어야 합니다";
    return false;
  }
  errors.value.name = "";
  return true;
};

const validatePhone = (): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  if (!formData.value.phone.trim()) {
    errors.value.phone = "연락처를 입력해주세요";
    return false;
  }
  if (!phoneRegex.test(formData.value.phone.replace(/-/g, ""))) {
    errors.value.phone = "올바른 연락처 형식이 아닙니다 (예: 010-1234-5678)";
    return false;
  }
  errors.value.phone = "";
  return true;
};

const validateEmail = (): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.value.email.trim()) {
    errors.value.email = "이메일을 입력해주세요";
    return false;
  }
  if (!emailRegex.test(formData.value.email)) {
    errors.value.email = "올바른 이메일 형식이 아닙니다";
    return false;
  }
  errors.value.email = "";
  return true;
};

const validateTerms = (): boolean => {
  if (!formData.value.agreedTerms) {
    errors.value.agreedTerms = "약관에 동의해주세요";
    return false;
  }
  errors.value.agreedTerms = "";
  return true;
};

const validateForm = (): boolean => {
  const nameValid = validateName();
  const phoneValid = validatePhone();
  const emailValid = validateEmail();
  const termsValid = validateTerms();

  return nameValid && phoneValid && emailValid && termsValid;
};

const handleClose = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  formData.value = {
    name: "",
    phone: "",
    email: "",
    agreedTerms: false,
  };
  errors.value = {
    name: "",
    phone: "",
    email: "",
    agreedTerms: "",
  };
  submitError.value = "";
};

const hashPhoneNumber = async (phone: string): Promise<string> => {
  const cleanPhone = phone.replace(/-/g, "");
  const encoder = new TextEncoder();
  const data = encoder.encode(cleanPhone);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const checkDuplicateEntry = async (phone: string): Promise<boolean> => {
  const phoneHash = await hashPhoneNumber(phone);
  const enteredPhones = localStorage.getItem("event_entries");
  if (!enteredPhones) return false;

  try {
    const phoneHashList = JSON.parse(enteredPhones) as string[];
    return phoneHashList.includes(phoneHash);
  } catch {
    return false;
  }
};

const saveEntryToLocalStorage = async (phone: string) => {
  const phoneHash = await hashPhoneNumber(phone);
  const enteredPhones = localStorage.getItem("event_entries");
  let phoneHashList: string[] = [];

  if (enteredPhones) {
    try {
      phoneHashList = JSON.parse(enteredPhones) as string[];
    } catch {
      phoneHashList = [];
    }
  }

  phoneHashList.push(phoneHash);
  localStorage.setItem("event_entries", JSON.stringify(phoneHashList));
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  if (await checkDuplicateEntry(formData.value.phone)) {
    emit("error", "중복 응모는 불가합니다");
    handleClose();
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";

  try {
    await submitEntry(formData.value);
    await saveEntryToLocalStorage(formData.value.phone);
    emit("success");
    handleClose();
  } catch (error) {
    submitError.value =
      error instanceof Error
        ? error.message
        : "응모에 실패했습니다. 다시 시도해주세요.";
  } finally {
    isSubmitting.value = false;
  }
};

const formatPhoneNumber = () => {
  let phone = formData.value.phone.replace(/[^0-9]/g, "");
  if (phone.length <= 3) {
    formData.value.phone = phone;
  } else if (phone.length <= 7) {
    formData.value.phone = phone.replace(/(\d{3})(\d{1,4})/, "$1-$2");
  } else {
    formData.value.phone = phone.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="absolute inset-0 bg-black/60" @click="handleClose"></div>

        <div
          class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div
            class="sticky top-0 bg-linear-to-br from-purple-600 via-purple-700 to-indigo-700 p-6 rounded-t-3xl"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">이벤트 응모하기</h2>
              <button
                @click="handleClose"
                class="text-white/80 hover:text-white transition-colors p-2 cursor-pointer"
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
            <div>
              <label
                for="name"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                이름 <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                @blur="validateName"
                type="text"
                class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                :class="errors.name ? 'border-red-500' : 'border-gray-300'"
                placeholder="홍길동"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label
                for="phone"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                연락처 <span class="text-red-500">*</span>
              </label>
              <input
                id="phone"
                v-model="formData.phone"
                @input="formatPhoneNumber"
                @blur="validatePhone"
                type="tel"
                maxlength="13"
                class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                :class="errors.phone ? 'border-red-500' : 'border-gray-300'"
                placeholder="010-1234-5678"
              />
              <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
                {{ errors.phone }}
              </p>
            </div>

            <div>
              <label
                for="email"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                이메일 <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="formData.email"
                @blur="validateEmail"
                type="email"
                class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                :class="errors.email ? 'border-red-500' : 'border-gray-300'"
                placeholder="example@email.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input
                  v-model="formData.agreedTerms"
                  @change="validateTerms"
                  type="checkbox"
                  class="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  :class="errors.agreedTerms ? 'border-red-500' : ''"
                />
                <span class="text-sm text-gray-700 group-hover:text-gray-900">
                  개인정보 수집 및 이용에 동의합니다
                  <span class="text-red-500">*</span>
                </span>
              </label>
              <p
                v-if="errors.agreedTerms"
                class="mt-1 text-sm text-red-500 ml-8"
              >
                {{ errors.agreedTerms }}
              </p>
            </div>

            <div
              v-if="submitError"
              class="p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p class="text-sm text-red-600">{{ submitError }}</p>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="handleClose"
                class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {{ isSubmitting ? "제출 중..." : "응모하기" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to .relative {
  transform: scale(0.9) translateY(20px);
}
</style>
