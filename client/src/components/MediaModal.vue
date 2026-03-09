<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click="onClose">
    <div class="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl" @click.stop>
      <!-- Close Button -->
      <button @click="onClose"
        class="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-9 h-9 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Close">
        <X class="w-5 h-5 md:w-7 md:h-7 text-gray-800" />
      </button>

      <!-- Previous Button -->
      <button v-if="onPrevious" @click="onPrevious"
        class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Previous">
        <ChevronLeft class="w-5 h-5 md:w-8 md:h-8 text-gray-800" />
      </button>

      <!-- Next Button -->
      <button v-if="onNext" @click="onNext"
        class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Next">
        <ChevronRight class="w-5 h-5 md:w-8 md:h-8 text-gray-800" />
      </button>

      <!-- Image -->
      <div class="w-full max-h-[80vh] overflow-hidden flex items-center justify-center bg-black">
        <img v-if="type === 'image'"
         :src="mediaUrl" 
         :alt="title" 
         class="max-w-full max-h-[80vh] object-contain" 
        />

        <video
          v-else
          :src="mediaUrl"
          class="max-w-full max-h-[80vh] object-contain"
          controls
          autoplay
          playsinline
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  type: String,
  mediaUrl: String,
  title: String,
  onClose: Function,
  onNext: Function,
  onPrevious: Function,
});

// Close on Escape key, navigate with arrow keys
const handleKeyboard = (e) => {
  if (e.key === 'Escape') {
    props.onClose();
  } else if (e.key === 'ArrowRight' && props.onNext) {
    props.onNext();
  } else if (e.key === 'ArrowLeft' && props.onPrevious) {
    props.onPrevious();
  }
};

// Prevent body scroll when modal is open
onMounted(() => {
  window.addEventListener('keydown', handleKeyboard);
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard);
  document.body.style.overflow = 'unset';
});
</script>