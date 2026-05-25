import { reactive } from 'vue'

const state = reactive({
    visible: false,
    type: 'info',       // 'info' | 'success' | 'error' | 'warning' | 'confirm'
    title: '',
    message: '',
    checkboxLabel: '',
    resolve: null,
})

function $alert(message, { title = 'Informasi', type = 'info' } = {}) {
    return new Promise((resolve) => {
        Object.assign(state, { visible: true, type, title, message, resolve })
    })
}

function $confirm(message, { title = 'Konfirmasi', checkboxLabel = '' } = {}) {
    return new Promise((resolve) => {
        Object.assign(state, { visible: true, type: 'confirm', title, message, checkboxLabel, resolve })
    })
}

function close(result) {
    state.visible = false
    state.resolve?.(result)
    state.resolve = null
}

export function useDialog() {
    return { state, $alert, $confirm, close }
}
