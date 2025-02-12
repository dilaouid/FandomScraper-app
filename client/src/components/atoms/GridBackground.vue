<template>
    <div class="fixed inset-0 overflow-hidden">
        <!-- Base gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-black" />

        <!-- Animated grid -->
        <div class="absolute inset-0">
            <div class="grid-pattern" />
        </div>

        <!-- Glowing orbs -->
        <div class="absolute inset-0">
            <div class="glow-orb glow-orb-1" />
            <div class="glow-orb glow-orb-2" />
            <div class="glow-orb glow-orb-3" />
        </div>

        <!-- Subtle scan lines -->
        <div class="absolute inset-0 scan-lines" />
    </div>
</template>

<style scoped>
.grid-pattern {
    @apply absolute inset-0;
    background-image: linear-gradient(to right, rgb(255 0 0 / 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(255 0 0 / 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(circle at center, white 20%, transparent 80%);
    animation: gridMove 20s linear infinite;
}

.glow-orb {
    @apply absolute rounded-full blur-3xl opacity-20;
    background: radial-gradient(circle at center, rgb(255 0 0), transparent 70%);
}

.glow-orb-1 {
    @apply w-96 h-96 -top-48 -left-48;
    animation: floatOrb 15s ease-in-out infinite;
}

.glow-orb-2 {
    @apply w-96 h-96 -bottom-48 -right-48;
    animation: floatOrb 15s ease-in-out infinite reverse;
}

.glow-orb-3 {
    @apply w-[40rem] h-[40rem] -top-[20rem] -right-[20rem];
    animation: floatOrb 20s ease-in-out infinite;
}

.scan-lines {
    background: repeating-linear-gradient(0deg,
            rgb(255 255 255 / 0.03) 0px,
            rgb(255 255 255 / 0.03) 1px,
            transparent 1px,
            transparent 2px);
}

@keyframes gridMove {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(40px);
    }
}

@keyframes floatOrb {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(100px, 50px);
    }
}
</style>
