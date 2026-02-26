<script setup>
import ProvinceSelect from "./ProvinceSelect.vue"

const props = defineProps({
  modelValue: [String, Number],
  districts: Array,
  loading: Boolean,
  disabled: Boolean
})

const emit = defineEmits(["update:modelValue"])
</script>

<template>

  <div class="relative">

    <ProvinceSelect
      :modelValue="modelValue"
      :options="districts"
      placeholder="Pilih Kecamatan"
      :disabled="disabled"
      @update:modelValue="val => emit('update:modelValue', val)"
    />

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg"
    >
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7BA87D]"></div>
    </div>

  </div>

</template>