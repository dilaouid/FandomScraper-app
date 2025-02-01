<!-- src/components/molecules/WikiCard.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import AppImage from '../atoms/AppImage.vue'
import type { Wiki } from '@/types'

interface Props {
    wiki: Wiki
    isSelected: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'select', wiki: Wiki): void
}>()

const isHovered = ref(false)

const handleMouseEnter = () => {
    isHovered.value = true
}

const handleMouseLeave = () => {
    isHovered.value = false
}
</script>

<template>
    <div class="wiki-card-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
        @click="$emit('select', wiki)">
        <div class="wiki-card" :class="{ 'is-hovered': isHovered }">
            <div class="card-inner">
                <AppImage :src="wiki.imageUrl" :alt="wiki.name" :width="500" :height="750" />

                <div class="gradient-overlay" :class="{ 'active': isHovered }">
                    <div class="card-content select-none">
                        <h2 class="card-title">{{ wiki.name }}</h2>
                        <p class="card-description">Explorer les personnages →</p>
                    </div>
                </div>

                <div class="border-effect" :class="{ 'active': isHovered }">
                    <div class="border-line border-top"></div>
                    <div class="border-line border-right"></div>
                    <div class="border-line border-bottom"></div>
                    <div class="border-line border-left"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wiki-card {
    position: relative;
    border-radius: 0.75rem;
    overflow: hidden;
    background: #1a0f0f;
    cursor: pointer;
    transition: all 0.3s ease;
    filter: grayscale(0.7) brightness(0.7) blur(1px);
    box-shadow: 0 4px 20px rgba(139, 0, 0, 0.15);
}

/* Dégradé animé existant */
.wiki-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            rgba(139, 0, 0, 0.2) 0%,
            transparent 25%,
            transparent 75%,
            rgba(139, 0, 0, 0.2) 100%);
    animation: gradientMove 8s linear infinite;
    z-index: 1;
    mix-blend-mode: soft-light;
    pointer-events: none;
}

/* Pattern de points */
.wiki-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background-image: radial-gradient(circle,
            rgba(255, 69, 0, 0.4) 1px,
            transparent 1px);
    background-position: 0% 0%;
    background-size: 6px 6px;
    mask-image: linear-gradient(135deg,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 60%,
            rgba(0, 0, 0, 0.2) 70%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 1) 90%
        );
    -webkit-mask-image: linear-gradient(135deg,
            transparent 50%,
            rgba(0, 0, 0, 0.1) 60%,
            rgba(0, 0, 0, 0.2) 70%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 1) 90%);
    animation: dotsMove 12s linear infinite;
    z-index: 2;
    mix-blend-mode: screen;
    opacity: 0.8;
    pointer-events: none;
}




.wiki-card.is-hovered {
    filter: grayscale(0) brightness(1) blur(0);
    box-shadow: 0 8px 30px rgba(139, 0, 0, 0.4);
    transform: translateY(-2px);
}

.wiki-card.is-hovered::after {
    opacity: 1;
    animation-duration: 8s;
    background-image: radial-gradient(circle,
            rgba(255, 69, 0, 0.5) 1px,
            transparent 1px);
}

@keyframes dotsMove {
    0% {
        background-position: 0% 0%;
    }

    100% {
        background-position: 100% 100%;
    }
}

@keyframes gradientMove {
    0% {
        background-position: 0% 0%;
    }

    50% {
        background-position: 100% 100%;
    }

    100% {
        background-position: 0% 0%;
    }
}

.card-inner {
    position: relative;
    overflow: hidden;
}

.card-inner img {
    transform: scale(1.05);
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.wiki-card.is-hovered .card-inner img {
    transform: scale(1.15);
}


/* Gradient Overlay */
.gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top,
            rgba(26, 15, 15, 0.95) 0%,
            rgba(26, 15, 15, 0.8) 20%,
            transparent 60%);
    opacity: 0;
    transform: translateY(20%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gradient-overlay.active {
    opacity: 1;
    transform: translateY(0);
}

/* Animated Borders */
.border-effect {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.border-line {
    position: absolute;
    background: linear-gradient(90deg,
            rgba(255, 0, 0, 0) 0%,
            rgba(255, 0, 0, 0.8) 50%,
            rgba(255, 0, 0, 0) 100%);
}

/* Horizontal lines */
.border-top,
.border-bottom {
    width: 100%;
    height: 4px;
    transform: scaleX(0);
}

/* Vertical lines */
.border-left,
.border-right {
    width: 4px;
    height: 100%;
    transform: scaleY(0);
}

/* Initial positions and transform origins */
.border-top {
    top: 0;
    left: 0;
    transform-origin: left;
    transition: transform 0.4s ease;
}

.border-right {
    top: 0;
    right: 0;
    transform-origin: top;
    transition: transform 0.4s ease 0.4s;
}

.border-bottom {
    bottom: 0;
    right: 0;
    transform-origin: right;
    transition: transform 0.4s ease 0.8s;
}

.border-left {
    bottom: 0;
    left: 0;
    transform-origin: bottom;
    transition: transform 0.4s ease 1.2s;
}

/* Active state */
.border-effect.active .border-line {
    transform: scale(1);
}

/* Card Content */
.card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2rem;
    transform: translateY(20px);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
}

.gradient-overlay.active .card-content {
    transform: translateY(0);
    opacity: 1;
}

.card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    transform: translateX(-20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
}

.gradient-overlay.active .card-description {
    transform: translateX(0);
    opacity: 1;
}
</style>