<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
    <Toaster position="bottom-right" :offset="20" :expanded="true" :rich-colors="true" theme="dark"
        class="[--custom-bg:theme(colors.red.950/0.9)] [--custom-border:theme(colors.red.900/0.2)] [--custom-text:theme(colors.white/0.9)] [--custom-success:theme(colors.green.500)] [--custom-error:theme(colors.red.500)] [--custom-warning:theme(colors.yellow.500)]"
        :toastOptions="{
            class: 'toast-custom',
            duration: 4000,
        }" />
</template>

<style>
.toast-custom {
    background: var(--custom-bg) !important;
    border: 1px solid var(--custom-border) !important;
    color: var(--custom-text) !important;
    backdrop-filter: blur(12px);
}

.toast-custom[data-type='success'] {
    border-left: 4px solid var(--custom-success) !important;
}

.toast-custom[data-type='error'] {
    border-left: 4px solid var(--custom-error) !important;
}

.toast-custom[data-type='warning'] {
    border-left: 4px solid var(--custom-warning) !important;
}

.toast-custom button[data-button='true'] {
    background: rgba(255, 255, 255, 0.1) !important;
    color: var(--custom-text) !important;
}

.toast-custom button[data-button='true']:hover {
    background: rgba(255, 255, 255, 0.2) !important;
}

.toast-custom button[data-close-button='true'] {
    color: var(--custom-text) !important;
    opacity: 0.5;
}

.toast-custom button[data-close-button='true']:hover {
    opacity: 1;
}
</style>
