<script setup>
import { ref, computed } from "vue"
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption
} from "@headlessui/vue"

import { ChevronUpDownIcon, CheckIcon } from "@heroicons/vue/24/solid"

const props = defineProps({
  modelValue: [String, Number],
  options: Array,
  placeholder: String,
  disabled: Boolean
})

const emit = defineEmits(["update:modelValue"])

const query = ref("")
const open = ref(false)

const filtered = computed(() => {
  if (!query.value) return props.options

  return props.options.filter(o =>
    o.name.toLowerCase().includes(query.value.toLowerCase())
  )
})

const selected = computed({
  get() {
    return props.options.find(o => o.id == props.modelValue) || null
  },
  set(val) {
    emit("update:modelValue", val?.id || "")
  }
})
</script>

<template>
  <Combobox v-model="selected">
    <div class="relative">

      <ComboboxInput :disabled="disabled"
        class="w-full h-12 px-4 pr-10 text-sm border border-gray-300 rounded-lg
         focus:ring-2 focus:ring-[#7BA87D]
         disabled:bg-gray-100 disabled:cursor-not-allowed"
        :displayValue="o => o?.name" @change="query = $event.target.value" @focus="open = true"
        :placeholder="placeholder" />

      <ComboboxButton :disabled="disabled"
        class="absolute inset-y-0 right-0 flex items-center pr-3 disabled:cursor-not-allowed">
        <ChevronUpDownIcon class="w-5 h-5 text-gray-400 transition" :class="{ 'rotate-180': open }" />
      </ComboboxButton>

      <ComboboxOptions class="absolute z-50 mt-2 max-h-60 w-full overflow-auto bg-white border rounded-lg shadow">

        <ComboboxOption v-for="o in filtered" :key="o.id" :value="o" v-slot="{ active, selected }">
          <li class="flex items-center px-4 py-2 cursor-pointer text-sm"
            :class="active ? 'bg-[#7BA87D] text-white' : ''">
            <CheckIcon v-if="selected" class="w-4 h-4 mr-2" />
            {{ o.name }}
          </li>
        </ComboboxOption>

      </ComboboxOptions>

    </div>
  </Combobox>
</template>