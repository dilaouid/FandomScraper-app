<script setup lang="ts">
import GridBackground from '../atoms/GridBackground.vue';
import AppFooter from '../organisms/AppFooter.vue';

</script>

<template>
    <GridBackground />
    <div class="min-h-screen h-full flex flex-col bg-[#1a0f0f]">
        <!-- Background slot -->
        <div class="fixed inset-0 w-full h-full">
            <slot name="background" />
        </div>

        <!-- Header/Navigation -->
        <div class="relative flex flex-col min-h-screen">
            <main class="relative z-10 flex-grow flex flex-col pb-12">
                <slot />
            </main>

            <!-- Footer -->
            <AppFooter class="relative z-10 mt-auto" />
        </div>
    </div>
</template>