<template>
  <div class="space-y-3">
    <!-- Date Picker -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
      <input
        :value="dateValue"
        @input="updateDate"
        type="date"
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
        :class="{ 'border-red-500 focus:ring-red-500': hasError }">
    </div>

    <!-- Time Picker -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-1">Waktu</label>
      <input
        :value="timeValue"
        @input="updateTime"
        type="time"
        class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
        :class="{ 'border-red-500 focus:ring-red-500': hasError }">
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const dateValue = computed(() => {
  if (!props.modelValue) return ''
  return props.modelValue.split('T')[0]
})

const timeValue = computed(() => {
  if (!props.modelValue) return ''
  const time = props.modelValue.split('T')[1]
  return time ? time.slice(0, 5) : ''
})

const updateDate = (event) => {
  const newDate = event.target.value
  if (!newDate) return

  const time = timeValue.value || '00:00'
  const datetime = `${newDate}T${time}`
  emit('update:modelValue', datetime)
}

const updateTime = (event) => {
  const newTime = event.target.value
  if (!newTime) return

  const date = dateValue.value || new Date().toLocaleDateString('sv-SE')
  const datetime = `${date}T${newTime}`
  emit('update:modelValue', datetime)
}
</script>
