<template>
  <div class="relative">
    <div class="relative">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        @focus="isOpen = true"
        @input="isOpen = true"
        @keydown.enter.prevent="selectFirstFiltered"
        @keydown.esc="isOpen = false"
        @keydown.arrow-down.prevent="highlightNext"
        @keydown.arrow-up.prevent="highlightPrev"
        :placeholder="selectedLabel || placeholder"
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-white cursor-pointer"
        :class="{ 'border-red-500 focus:ring-red-500': hasError }">
      <div class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <span class="material-symbols-outlined text-xl">expand_more</span>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen && filteredOptions.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
      <div
        v-for="(option, index) in filteredOptions"
        :key="option.id"
        @click="selectOption(option)"
        @mouseover="highlightedIndex = index"
        :class="[
          'px-4 py-3 cursor-pointer transition-colors',
          highlightedIndex === index ? 'bg-sky-50' : 'hover:bg-slate-50',
          modelValue === option.id ? 'bg-sky-100 font-semibold' : ''
        ]">
        {{ option.label }}
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="isOpen && filteredOptions.length === 0 && searchQuery"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 p-4 text-center text-slate-500">
      Tidak ada hasil untuk "{{ searchQuery }}"
    </div>

    <!-- Overlay to close dropdown -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-0" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Pilih opsi'
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const isOpen = ref(false)
const highlightedIndex = ref(0)
const searchInput = ref(null)

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query)
  )
})

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.id === props.modelValue)
  return selected ? selected.label : ''
})

const selectOption = (option) => {
  emit('update:modelValue', option.id)
  searchQuery.value = ''
  isOpen.value = false
  highlightedIndex.value = 0
}

const selectFirstFiltered = () => {
  if (filteredOptions.value.length > 0) {
    selectOption(filteredOptions.value[0])
  }
}

const highlightNext = () => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  highlightedIndex.value = (highlightedIndex.value + 1) % filteredOptions.value.length
}

const highlightPrev = () => {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  highlightedIndex.value = highlightedIndex.value === 0
    ? filteredOptions.value.length - 1
    : highlightedIndex.value - 1
}
</script>
