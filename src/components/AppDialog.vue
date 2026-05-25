<template>
    <Teleport to="body">
        <Transition name="dialog">
            <div
                v-if="state.visible"
                class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                @click.self="state.type !== 'confirm' && close(false)"
            >
                <div class="bg-white rounded-3xl p-8 shadow-2xl w-full" style="max-width: 480px;">
                    <!-- Icon -->
                    <div class="flex justify-center mb-5">
                        <div class="w-16 h-16 rounded-2xl flex items-center justify-center" :class="iconBg">
                            <span
                                class="material-symbols-outlined text-[36px]"
                                style="font-variation-settings: 'FILL' 1"
                                :class="iconColor"
                            >{{ icon }}</span>
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="font-h3 text-h3 text-on-surface text-center mb-2">{{ state.title }}</h3>

                    <!-- Message -->
                    <p class="text-slate-500 text-sm text-center leading-relaxed mb-8">{{ state.message }}</p>

                    <!-- Checkbox (opsional, hanya saat ada checkboxLabel) -->
                    <label
                        v-if="state.type === 'confirm' && state.checkboxLabel"
                        class="flex items-start gap-3 mb-6 cursor-pointer select-none group"
                    >
                        <div class="relative mt-0.5 shrink-0">
                            <input
                                type="checkbox"
                                v-model="checkboxChecked"
                                class="sr-only peer"
                            />
                            <div class="w-5 h-5 rounded border-2 border-slate-300 peer-checked:border-sky-500 peer-checked:bg-sky-500 transition-all flex items-center justify-center">
                                <span v-if="checkboxChecked" class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: 'FILL' 1;">check</span>
                            </div>
                        </div>
                        <span class="text-sm text-slate-600 leading-snug">{{ state.checkboxLabel }}</span>
                    </label>

                    <!-- Buttons -->
                    <div class="flex gap-3">
                        <button
                            v-if="state.type === 'confirm'"
                            @click="close(false)"
                            class="flex-1 px-5 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            @click="close(state.type === 'confirm' ? true : undefined)"
                            :disabled="state.type === 'confirm' && !!state.checkboxLabel && !checkboxChecked"
                            class="flex-1 px-5 py-3 text-white font-bold rounded-2xl transition-all"
                            :class="[btnClass, state.type === 'confirm' && !!state.checkboxLabel && !checkboxChecked ? 'opacity-40 cursor-not-allowed' : '']"
                        >
                            {{ state.type === 'confirm' ? 'Ya, Lanjutkan' : 'OK' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDialog } from '@/composables/useDialog'

const { state, close } = useDialog()

const checkboxChecked = ref(false)
watch(() => state.visible, (val) => { if (val) checkboxChecked.value = false })

const config = computed(() => {
    switch (state.type) {
        case 'success':
            return { icon: 'check_circle', iconBg: 'bg-green-50', iconColor: 'text-green-500', btnClass: 'bg-green-500 hover:bg-green-600' }
        case 'error':
            return { icon: 'error', iconBg: 'bg-red-50', iconColor: 'text-red-500', btnClass: 'bg-red-500 hover:bg-red-600' }
        case 'warning':
            return { icon: 'warning', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', btnClass: 'bg-amber-500 hover:bg-amber-600' }
        case 'confirm':
            return { icon: 'help', iconBg: 'bg-sky-50', iconColor: 'text-sky-500', btnClass: 'bg-sky-500 hover:bg-sky-600' }
        default:
            return { icon: 'info', iconBg: 'bg-sky-50', iconColor: 'text-sky-500', btnClass: 'bg-sky-500 hover:bg-sky-600' }
    }
})

const icon = computed(() => config.value.icon)
const iconBg = computed(() => config.value.iconBg)
const iconColor = computed(() => config.value.iconColor)
const btnClass = computed(() => config.value.btnClass)
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
    transition: opacity 0.2s ease;
}
.dialog-enter-active > div,
.dialog-leave-active > div {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
}
.dialog-enter-from > div,
.dialog-leave-to > div {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
}
</style>
