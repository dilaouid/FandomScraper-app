<template>
    <div class="spinner-container">
        <svg class="spinner" viewBox="0 0 50 50" width="40" height="40">
            <circle
                class="spinner-path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke-width="4"
            ></circle>
        </svg>
    </div>
</template>

<style scoped>
.spinner-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner {
    transform-origin: center;
    animation: spinner-rotate 1.5s linear infinite;
}

.spinner-path {
    stroke: rgba(239, 68, 68, 0.8);
    stroke-linecap: round;
    animation: spinner-dash 1.2s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
}

@keyframes spinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes spinner-dash {
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -125;
    }
}
</style>