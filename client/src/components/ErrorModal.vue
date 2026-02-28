<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
      leave-to-class="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
    >
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        @click.self="hideError"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- Modal -->
        <div class="relative bg-white w-full sm:max-w-md sm:mx-4 sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 overflow-hidden">

          <!-- Top accent bar -->
          <div class="h-1.5 w-full bg-red-500" />

          <!-- Content -->
          <div class="p-5 sm:p-6 lg:p-8">

            <!-- Icon -->
            <div class="flex justify-center mb-4 sm:mb-5">
              <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle class="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-red-500" />
              </div>
            </div>

            <!-- Title -->
            <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
              {{ errorTitle }}
            </h3>

            <!-- Message -->
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 text-center leading-relaxed mb-6 sm:mb-8">
              {{ errorMessage }}
            </p>

            <!-- Button -->
            <button
              @click="hideError"
              class="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-2.5 sm:py-3 lg:py-4 rounded-xl text-sm sm:text-base lg:text-lg font-semibold transition-colors"
            >
              Tutup
            </button>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { AlertCircle } from 'lucide-vue-next'
import { useErrorModal } from '../composables/useErrorModal'

const { isVisible, errorMessage, errorTitle, hideError } = useErrorModal()
</script>