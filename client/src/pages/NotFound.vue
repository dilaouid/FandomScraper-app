<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '../components/templates/PageLayout.vue'

const router = useRouter()
const randomGlitches = ref(Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${20 + Math.random() * 80}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${0.5 + Math.random() * 2}s`
})))

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <PageLayout>
        <template #background>
            <!-- Dark error background with effects -->
            <div class="fixed inset-0 bg-black overflow-hidden">
                <!-- Dark gradient base -->
                <div class="absolute inset-0 bg-gradient-radial from-zinc-900/30 to-black"></div>
                
                <!-- Error pattern overlay -->
                <div class="absolute inset-0 error-grid opacity-20"></div>
                
                <!-- Glitch elements -->
                <div v-for="glitch in randomGlitches" :key="glitch.id"
                     class="glitch-element absolute"
                     :style="{
                         left: glitch.left,
                         top: glitch.top,
                         width: glitch.width,
                         height: '2px',
                         animationDelay: glitch.delay,
                         animationDuration: glitch.duration
                     }">
                </div>
                
                <!-- Vignette overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
            </div>
        </template>

        <div class="relative z-10 container mx-auto px-4 h-screen flex flex-col items-center justify-center text-center">
            <div class="error-container mb-8">
                <div class="error-code glitch-text" data-text="404">404</div>
                <div class="error-line bg-red-600/70 h-px w-32 sm:w-48 mx-auto my-6 animate-pulse"></div>
                <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 tracking-wider">PAGE NOT FOUND</h1>
                <p class="text-zinc-400 max-w-md mx-auto mb-8">The wiki or character you're looking for doesn't exist or has been removed.</p>
            </div>
            
            <div class="actions-container">
                <button 
                    @click="goHome"
                    class="home-button bg-red-900/30 hover:bg-red-900/50 border border-red-600/40 hover:border-red-500/70 text-white px-6 py-3 rounded-md transition-all duration-300 flex items-center group"
                >
                    <span class="mr-2 group-hover:translate-x-1 transition-transform">Return to Home</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </button>
            </div>
            
            <!-- Decorative elements -->
            <div class="error-terminal font-mono text-xs sm:text-sm text-red-500/70 mt-12 max-w-sm mx-auto overflow-hidden">
                <div class="terminal-line">> ERROR: Route not found in database</div>
                <div class="terminal-line">> TRACE: No matching documents</div>
                <div class="terminal-line">> STATUS: 404</div>
                <div class="terminal-line typing-animation">> Attempting to recover...</div>
            </div>
        </div>
    </PageLayout>
</template>

<style scoped>
/* Background styles */
.bg-gradient-radial {
    background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
}

.error-grid {
    background-image: 
        linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px),
        linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center center;
}

/* 404 glitch text effect */
.error-code {
    font-size: 8rem;
    font-weight: 900;
    color: #fff;
    text-shadow: 
        0 0 10px rgba(239, 68, 68, 0.5),
        0 0 20px rgba(239, 68, 68, 0.3);
    position: relative;
    letter-spacing: -5px;
}

.glitch-text {
    position: relative;
    animation: glitch-skew 1s infinite linear alternate-reverse;
}

.glitch-text::before,
.glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.glitch-text::before {
    left: 2px;
    text-shadow: -2px 0 #ff0000;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-text::after {
    left: -2px;
    text-shadow: -2px 0 #00ffff;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
    0% {
        clip: rect(27px, 9999px, 30px, 0);
        transform: skew(0.4deg);
    }
    5% {
        clip: rect(47px, 9999px, 76px, 0);
        transform: skew(0.5deg);
    }
    10% {
        clip: rect(64px, 9999px, 42px, 0);
        transform: skew(0.3deg);
    }
    15% {
        clip: rect(24px, 9999px, 23px, 0);
        transform: skew(0.1deg);
    }
    20% {
        clip: rect(65px, 9999px, 89px, 0);
        transform: skew(0.7deg);
    }
    25% {
        clip: rect(12px, 9999px, 32px, 0);
        transform: skew(0.9deg);
    }
    30% {
        clip: rect(23px, 9999px, 54px, 0);
        transform: skew(0.3deg);
    }
    35% {
        clip: rect(76px, 9999px, 90px, 0);
        transform: skew(0.8deg);
    }
    40% {
        clip: rect(54px, 9999px, 23px, 0);
        transform: skew(0.2deg);
    }
    45% {
        clip: rect(74px, 9999px, 65px, 0);
        transform: skew(0.1deg);
    }
    50% {
        clip: rect(45px, 9999px, 12px, 0);
        transform: skew(0.6deg);
    }
    55% {
        clip: rect(67px, 9999px, 32px, 0);
        transform: skew(0.4deg);
    }
    60% {
        clip: rect(32px, 9999px, 54px, 0);
        transform: skew(0.7deg);
    }
    65% {
        clip: rect(89px, 9999px, 43px, 0);
        transform: skew(0.9deg);
    }
    70% {
        clip: rect(23px, 9999px, 23px, 0);
        transform: skew(0.4deg);
    }
    75% {
        clip: rect(65px, 9999px, 76px, 0);
        transform: skew(0.1deg);
    }
    80% {
        clip: rect(43px, 9999px, 45px, 0);
        transform: skew(0.6deg);
    }
    85% {
        clip: rect(21px, 9999px, 74px, 0);
        transform: skew(0.9deg);
    }
    90% {
        clip: rect(89px, 9999px, 87px, 0);
        transform: skew(0.2deg);
    }
    95% {
        clip: rect(56px, 9999px, 32px, 0);
        transform: skew(0.5deg);
    }
    100% {
        clip: rect(89px, 9999px, 23px, 0);
        transform: skew(0.7deg);
    }
}

@keyframes glitch-anim2 {
    0% {
        clip: rect(56px, 9999px, 87px, 0);
        transform: skew(0.3deg);
    }
    5% {
        clip: rect(43px, 9999px, 54px, 0);
        transform: skew(0.7deg);
    }
    10% {
        clip: rect(32px, 9999px, 65px, 0);
        transform: skew(0.2deg);
    }
    15% {
        clip: rect(76px, 9999px, 45px, 0);
        transform: skew(0.5deg);
    }
    20% {
        clip: rect(23px, 9999px, 76px, 0);
        transform: skew(0.8deg);
    }
    25% {
        clip: rect(54px, 9999px, 32px, 0);
        transform: skew(0.4deg);
    }
    30% {
        clip: rect(89px, 9999px, 21px, 0);
        transform: skew(0.1deg);
    }
    35% {
        clip: rect(43px, 9999px, 54px, 0);
        transform: skew(0.6deg);
    }
    40% {
        clip: rect(12px, 9999px, 87px, 0);
        transform: skew(0.3deg);
    }
    45% {
        clip: rect(65px, 9999px, 32px, 0);
        transform: skew(0.7deg);
    }
    50% {
        clip: rect(34px, 9999px, 56px, 0);
        transform: skew(0.5deg);
    }
    55% {
        clip: rect(76px, 9999px, 23px, 0);
        transform: skew(0.2deg);
    }
    60% {
        clip: rect(45px, 9999px, 76px, 0);
        transform: skew(0.8deg);
    }
    65% {
        clip: rect(23px, 9999px, 43px, 0);
        transform: skew(0.4deg);
    }
    70% {
        clip: rect(54px, 9999px, 65px, 0);
        transform: skew(0.1deg);
    }
    75% {
        clip: rect(87px, 9999px, 32px, 0);
        transform: skew(0.6deg);
    }
    80% {
        clip: rect(32px, 9999px, 54px, 0);
        transform: skew(0.3deg);
    }
    85% {
        clip: rect(76px, 9999px, 87px, 0);
        transform: skew(0.7deg);
    }
    90% {
        clip: rect(43px, 9999px, 23px, 0);
        transform: skew(0.4deg);
    }
    95% {
        clip: rect(21px, 9999px, 65px, 0);
        transform: skew(0.2deg);
    }
    100% {
        clip: rect(65px, 9999px, 23px, 0);
        transform: skew(0.9deg);
    }
}

@keyframes glitch-skew {
    0% {
        transform: skew(2deg);
    }
    10% {
        transform: skew(1deg);
    }
    20% {
        transform: skew(-2deg);
    }
    30% {
        transform: skew(-1deg);
    }
    40% {
        transform: skew(0deg);
    }
    50% {
        transform: skew(1deg);
    }
    60% {
        transform: skew(-1deg);
    }
    70% {
        transform: skew(0deg);
    }
    80% {
        transform: skew(1deg);
    }
    90% {
        transform: skew(-1deg);
    }
    100% {
        transform: skew(0deg);
    }
}

/* Glitch elements */
.glitch-element {
    background: linear-gradient(90deg, transparent, #ff3030, transparent);
    opacity: 0;
    animation: glitch-flicker 3s infinite;
}

@keyframes glitch-flicker {
    0%, 100% {
        opacity: 0;
    }
    50% {
        opacity: 0.7;
    }
}

/* Terminal effect */
.error-terminal {
    border: 1px solid rgba(239, 68, 68, 0.2);
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    padding: 1rem;
    height: 120px;
    text-align: left;
}

.terminal-line {
    line-height: 1.6;
    opacity: 0.9;
}

.typing-animation {
    overflow: hidden;
    white-space: nowrap;
    width: 0;
    animation: typing 3s steps(40) 1s forwards;
}

@keyframes typing {
    to { width: 100%; }
}
</style>