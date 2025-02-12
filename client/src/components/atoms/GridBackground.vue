<template>
    <div class="fixed inset-0 overflow-hidden">
        <!-- Base gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-red-950 via-[#120707] to-black opacity-90" />

        <!-- Enhanced grid pattern -->
        <div class="absolute inset-0">
            <div class="enhanced-grid" />
        </div>

        <!-- Dynamic particles -->
        <div class="absolute inset-0">
            <div class="particles-overlay" />
        </div>

        <!-- Improved glowing orbs -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="glow-orb primary-orb" />
            <div class="glow-orb secondary-orb" />
            <div class="glow-orb accent-orb" />
        </div>

        <!-- Refined scan lines -->
        <div class="absolute inset-0">
            <div class="refined-scan-lines" />
        </div>

        <!-- Vignette effect -->
        <div class="absolute inset-0 vignette" />
    </div>
</template>

<style scoped>
.enhanced-grid {
    @apply absolute inset-0;
    background-image:
        linear-gradient(to right, rgb(255 0 0 / 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(255 0 0 / 0.03) 1px, transparent 1px);
    background-size: 30px 30px;
    mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
    animation: gridFloat 30s linear infinite;
}

.particles-overlay {
    @apply absolute inset-0;
    background-image: radial-gradient(circle at center, rgb(255 0 0 / 0.15) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: particlesFloat 20s linear infinite;
}

.glow-orb {
    @apply absolute rounded-full blur-3xl;
    background: radial-gradient(circle at center, rgb(255 0 0), transparent 70%);
}

.primary-orb {
    @apply w-[600px] h-[600px] -top-[200px] -left-[200px] opacity-15;
    animation: floatPrimary 25s ease-in-out infinite;
}

.secondary-orb {
    @apply w-[500px] h-[500px] -bottom-[150px] -right-[150px] opacity-10;
    animation: floatSecondary 20s ease-in-out infinite reverse;
}

.accent-orb {
    @apply w-[800px] h-[800px] -top-[300px] -right-[300px] opacity-5;
    animation: floatAccent 30s ease-in-out infinite;
}

.refined-scan-lines {
    @apply absolute inset-0;
    background: repeating-linear-gradient(0deg,
            rgb(255 255 255 / 0.02) 0px,
            rgb(255 255 255 / 0.02) 1px,
            transparent 1px,
            transparent 4px);
}

.vignette {
    background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%);
}

@keyframes gridFloat {
    0% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(15px) scale(1.05);
    }

    100% {
        transform: translateY(0) scale(1);
    }
}

@keyframes particlesFloat {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(30px, 30px);
    }
}

@keyframes floatPrimary {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(100px, 50px) rotate(5deg);
    }
}

@keyframes floatSecondary {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(-80px, -40px) rotate(-5deg);
    }
}

@keyframes floatAccent {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(-60px, 30px) scale(1.1);
    }
}
</style>
