// composables/useErrorModal.js
import { ref } from 'vue'

const isVisible = ref(false)
const errorMessage = ref('')
const errorTitle = ref('Terjadi Kesalahan')

export function useErrorModal() {
  function showError(message, title = 'Terjadi Kesalahan') {
    errorMessage.value = message
    errorTitle.value = title
    isVisible.value = true
  }

  function hideError() {
    isVisible.value = false
    errorMessage.value = ''
  }

  return {
    isVisible,
    errorMessage,
    errorTitle,
    showError,
    hideError
  }
}