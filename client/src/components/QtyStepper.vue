<template>
  <div
    class="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white p-1"
    @click="handleContainerClick"
  >
    <button
      type="button"
      :disabled="isDecrementDisabled"
      class="rounded-lg flex items-center justify-center"
      :class="[
        compact ? 'w-8 h-8' : 'w-8 h-8 sm:w-9 sm:h-9',
        isDecrementDisabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-700 hover:bg-[#7BA87D]/10 hover:text-[#2C4A2F]',
      ]"
      @click="handleDecrement"
    >
      <Minus :class="compact ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'" />
    </button>

    <input
      :value="safeValue"
      type="number"
      :min="effectiveMin"
      :max="max"
      inputmode="numeric"
      class="border-x border-gray-200 bg-transparent text-center font-semibold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      :class="compact ? 'h-8 w-12 text-sm' : 'h-8 sm:h-9 w-14 sm:w-16 text-sm sm:text-base'"
      @click="handleInputClick"
      @change="handleInputChange"
      @blur="handleInputChange"
      @keydown.enter.prevent="handleInputChange"
    />

    <button
      type="button"
      :disabled="isIncrementDisabled"
      class="rounded-lg flex items-center justify-center"
      :class="[
        compact ? 'w-8 h-8' : 'w-8 h-8 sm:w-9 sm:h-9',
        isIncrementDisabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-700 hover:bg-[#7BA87D]/10 hover:text-[#2C4A2F]',
      ]"
      @click="handleIncrement"
    >
      <Plus :class="compact ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disableIncrement: {
    type: Boolean,
    default: false,
  },
  allowZero: {
    type: Boolean,
    default: false,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  stopPropagation: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const effectiveMin = computed(() =>
  props.allowZero ? Math.min(0, props.min) : props.min
)

const safeMax = computed(() =>
  Number.isFinite(props.max) ? props.max : Number.MAX_SAFE_INTEGER
)

const safeValue = computed(() => {
  const value = Number(props.modelValue)
  if (!Number.isFinite(value)) return effectiveMin.value
  return Math.min(Math.max(Math.floor(value), effectiveMin.value), safeMax.value)
})

const isIncrementDisabled = computed(() =>
  props.disabled || props.disableIncrement || safeValue.value >= safeMax.value
)

const isDecrementDisabled = computed(() =>
  props.disabled || safeValue.value <= effectiveMin.value
)

function clamp(value) {
  if (!Number.isFinite(value)) return safeValue.value
  return Math.min(Math.max(Math.floor(value), effectiveMin.value), safeMax.value)
}

function emitValue(nextValue) {
  emit('update:modelValue', clamp(nextValue))
}

function handleDecrement(event) {
  if (props.stopPropagation) event.stopPropagation()
  if (isDecrementDisabled.value) return
  emitValue(safeValue.value - 1)
}

function handleIncrement(event) {
  if (props.stopPropagation) event.stopPropagation()
  if (isIncrementDisabled.value) return
  emitValue(safeValue.value + 1)
}

function handleInputChange(event) {
  if (props.stopPropagation) event.stopPropagation()
  const nextValue = clamp(Number(event?.target?.value))
  emitValue(nextValue)
  if (event?.target) event.target.value = nextValue
}

function handleContainerClick(event) {
  if (props.stopPropagation) event.stopPropagation()
}

function handleInputClick(event) {
  if (props.stopPropagation) event.stopPropagation()
}
</script>
