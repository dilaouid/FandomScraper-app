<!-- PageLayout.vue -->
<script setup lang="ts">
import DebugButton from '../atoms/DebugButton.vue';
import AppFooter from '../organisms/AppFooter.vue';

</script>

<template>
    <div class="min-h-screen h-full flex flex-col overflow-x-hidden bg-transparent">
        <div class="fixed inset-0 w-full h-full">
            <slot name="background" />
        </div>

        <div class="relative flex flex-col min-h-screen">
            <div class="pointer-events-none fixed inset-0">
                <div class="ambient-grid absolute inset-0 opacity-40"></div>
                <div class="noise-overlay absolute inset-0 opacity-[0.045] mix-blend-soft-light"></div>
                <div class="absolute left-[-12rem] top-24 h-80 w-80 rounded-full bg-red-500/10 blur-3xl"></div>
                <div class="absolute right-[-8rem] top-12 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl"></div>
                <div class="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl"></div>
            </div>

            <main class="relative z-10 flex-grow flex flex-col pb-16">
                <slot />
            </main>

            <AppFooter class="relative z-10 mt-auto" />
        </div>
        <DebugButton />
    </div>
</template>