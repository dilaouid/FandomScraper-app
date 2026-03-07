<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Character } from '@/types'
import { useWikiStore } from '@/stores/useWikiStore'
import { API_BASE_URL } from '@/config/api'

const props = defineProps<{
  character: Character
}>()

const emit = defineEmits<{
  (e: 'select', id: number): void
  (e: 'image-change', index: number): void
}>()

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxYTBmMGYiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzUiIGZpbGw9IiM0YjAwMDAiLz4KICA8cmVjdCB4PSI1MCIgeT0iMTMwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM0YjAwMDAiLz4KPC9zdmc+'

const store = useWikiStore()
const currentImageIndex = ref(0)
const imageLoaded = ref(false)
const isImageLoading = ref(true)
const finalImageUrl = ref<string>(placeholderImage)
const resolvedThumbnails = ref(new Map<string, string>())

const getImageUrl = (url: string) => {
  if (url.startsWith('data:')) return url

  const referer = store.getBaseUrl(props.character.url)
  return `${API_BASE_URL}/proxy?url=${encodeURIComponent(url)}${referer ? `&referer=${encodeURIComponent(referer)}` : ''}`
}

const resolveImageUrl = async (url: string): Promise<string> => {
  if (url.startsWith('data:')) return url

  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.status === 404 ? getImageUrl(url) : url
  } catch {
    return getImageUrl(url)
  }
}

const updateImage = async () => {
  const baseUrl = props.character.data?.images?.[currentImageIndex.value]

  if (!baseUrl) {
    finalImageUrl.value = placeholderImage
    isImageLoading.value = false
    imageLoaded.value = false
    return
  }

  if (baseUrl.startsWith('data:')) {
    finalImageUrl.value = baseUrl
    isImageLoading.value = false
    imageLoaded.value = true
    return
  }

  isImageLoading.value = true
  imageLoaded.value = false

  const resolvedUrl = await resolveImageUrl(baseUrl)
  const image = new Image()

  image.onload = () => {
    isImageLoading.value = false
    imageLoaded.value = true
    finalImageUrl.value = resolvedUrl
  }

  image.onerror = () => {
    isImageLoading.value = false
    imageLoaded.value = false
    finalImageUrl.value = placeholderImage
  }

  image.src = resolvedUrl
}

watch(
  [() => currentImageIndex.value, () => props.character.data?.images],
  () => {
    updateImage()
  },
  { immediate: true }
)

watch(
  () => props.character.data?.images,
  (images) => {
    if (!images?.length) return

    images.forEach((imageUrl: string) => {
      if (!resolvedThumbnails.value.has(imageUrl)) {
        resolveImageUrl(imageUrl).then((resolvedUrl) => {
          resolvedThumbnails.value.set(imageUrl, resolvedUrl)
        })
      }
    })
  },
  { immediate: true }
)

const displayImage = computed(() => finalImageUrl.value)

const resolvedThumbnailUrls = computed(() =>
  props.character.data?.images?.map((imageUrl: string) =>
    resolvedThumbnails.value.get(imageUrl) || imageUrl
  ) || []
)

const statusLabel = computed(() => props.character.data?.status || 'Unknown')
const genderLabel = computed(() => props.character.data?.gender || '')
const imageCount = computed(() => props.character.data?.images?.length || 0)

const statusIcon = computed(() => {
  switch (props.character.data?.status?.toLowerCase()) {
    case 'deceased':
    case 'décédé':
    case 'décédée':
      return '💀'
    case 'alive':
    case 'vivant':
    case 'vivante':
    case 'active':
      return '❤️'
    default:
      return '❔'
  }
})

const genderIcon = computed(() => {
  switch (props.character.data?.gender?.toLowerCase()) {
    case 'male':
    case 'masculin':
      return '♂️'
    case 'female':
    case 'féminin':
      return '♀️'
    default:
      return ''
  }
})

const setImageIndex = (index: number) => {
  currentImageIndex.value = index
  emit('image-change', index)
}

const nextImage = () => {
  if (!props.character.data?.images?.length) return
  setImageIndex((currentImageIndex.value + 1) % props.character.data.images.length)
}

const previousImage = () => {
  if (!props.character.data?.images?.length) return
  setImageIndex(
    currentImageIndex.value === 0
      ? props.character.data.images.length - 1
      : currentImageIndex.value - 1
  )
}

let touchStartX = 0
const touchThreshold = 50

const handleTouchStart = (event: TouchEvent) => {
  touchStartX = event.touches[0].clientX
}

const handleTouchMove = (event: TouchEvent) => {
  if (!touchStartX) return

  const touchEndX = event.touches[0].clientX
  const delta = touchStartX - touchEndX

  if (Math.abs(delta) > touchThreshold) {
    if (delta > 0) {
      nextImage()
    } else {
      previousImage()
    }

    touchStartX = 0
  }
}

const handleTouchEnd = () => {
  touchStartX = 0
}

const handleCardClick = () => {
  emit('select', props.character.id)
}
</script>

<template>
  <article class="character-card group">
    <div class="card-shell" @click="handleCardClick">
      <div class="card-frame"></div>
      <div class="card-pattern"></div>
      <div class="card-spotlight"></div>

      <div class="relative aspect-[0.8] w-full overflow-hidden rounded-[26px]" @touchstart="handleTouchStart"
        @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_22%,rgba(0,0,0,0.5)_100%)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.22),transparent_38%)]"></div>

        <div class="character-container absolute inset-0">
          <div class="character-image" :class="{ 'is-loaded': imageLoaded }" :style="{
            backgroundImage: `url(${displayImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat'
          }"></div>
        </div>

        <div class="absolute right-4 top-4 z-20 flex items-start gap-2 pointer-events-none">
          <div class="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-xs text-white/60 backdrop-blur-md">
            {{ imageCount }} img
          </div>
          <div class="flex gap-2">
            <span v-if="character.data?.status" class="character-badge" :title="statusLabel">
              {{ statusIcon }}
            </span>
            <span v-if="character.data?.gender" class="character-badge" :title="genderLabel">
              {{ genderIcon }}
            </span>
          </div>
        </div>

        <div class="card-content absolute inset-x-0 bottom-0 z-20 p-4 sm:p-5">
          <div class="pointer-events-none rounded-[18px] bg-gradient-to-t from-black/88 via-black/52 to-transparent p-1">
            <h3 class="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
              {{ character.name }}
            </h3>
            <p v-if="character.data?.kanji" class="font-japanese mt-1 truncate text-sm text-white/65">
              {{ character.data.kanji }}
            </p>
          </div>
        </div>

        <div v-if="isImageLoading"
          class="absolute inset-0 z-30 flex items-center justify-center bg-black/25 backdrop-blur-sm">
          <svg class="h-8 w-8 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>
      </div>
    </div>

    <div v-if="imageCount > 1" class="pointer-events-auto mt-3 flex justify-center gap-2 px-2">
      <button v-for="(_, index) in character.data?.images" :key="index" type="button" @click.stop="setImageIndex(index)"
        class="preview-thumbnail" :class="{ active: currentImageIndex === index }" :style="{
          backgroundImage: `url(${resolvedThumbnailUrls[index]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }">
      </button>
    </div>
  </article>
</template>

<style scoped>
.character-card {
  position: relative;
}

.card-shell {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(18px);
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
  cursor: pointer;
}

.group:hover .card-shell {
  transform: translateY(-8px) scale(1.015);
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.42),
    0 0 0 1px rgba(255, 255, 255, 0.02);
}

.card-frame,
.card-pattern,
.card-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card-frame {
  z-index: 1;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

.card-pattern {
  z-index: 1;
  background-image: url('@/assets/images/background.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  transform: scale(1.35);
  filter: brightness(0.45) sepia(0.18) hue-rotate(-12deg);
  transition: opacity 0.35s ease, filter 0.35s ease;
  animation: patternScroll 18s linear infinite paused;
}

.group:hover .card-pattern {
  opacity: 0.55;
  filter: brightness(0.65) sepia(0.12) hue-rotate(-10deg);
  animation-play-state: running;
}

.card-spotlight {
  z-index: 2;
  background:
    radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.16), transparent 24%),
    radial-gradient(circle at 84% 12%, rgba(251, 113, 133, 0.2), transparent 26%);
  opacity: 0.8;
}

.character-container {
  isolation: isolate;
  z-index: 3;
}

.character-image {
  position: absolute;
  inset: 0;
  transform: scale(1.05);
  filter: grayscale(78%) contrast(1.1);
  transition: transform 0.35s ease, filter 0.35s ease, opacity 0.35s ease;
  opacity: 0.9;
  animation: subtleGlow 2.4s ease-in-out infinite;
}

.character-image.is-loaded {
  opacity: 1;
}

.group:hover .character-image {
  transform: scale(1.1);
  filter: grayscale(0%) contrast(1.02);
  animation: hoverGlow 1.9s ease-in-out infinite;
}

.card-content {
  pointer-events: none;
}

.character-badge {
  display: inline-flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(12px);
}

.font-japanese {
  font-family: "Noto Sans JP", sans-serif;
}

.preview-thumbnail {
  height: 3rem;
  width: 3rem;
  border-radius: 0.95rem;
  border: 1px solid transparent;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.preview-thumbnail:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.22);
}

.preview-thumbnail.active {
  transform: translateY(-4px) scale(1.06);
  border-color: rgba(251, 113, 133, 0.8);
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(251, 113, 133, 0.35);
}

@keyframes subtleGlow {
  0%,
  100% {
    filter: grayscale(78%) contrast(1.1) drop-shadow(0 0 6px rgba(255, 0, 76, 0.14));
  }

  50% {
    filter: grayscale(78%) contrast(1.1) drop-shadow(0 0 12px rgba(255, 0, 76, 0.22));
  }
}

@keyframes hoverGlow {
  0%,
  100% {
    filter: grayscale(0%) drop-shadow(0 0 10px rgba(251, 113, 133, 0.3));
  }

  50% {
    filter: grayscale(0%) drop-shadow(0 0 18px rgba(251, 113, 133, 0.44));
  }
}

@keyframes patternScroll {
  0% {
    background-position: 0% center;
  }

  100% {
    background-position: -200% center;
  }
}
</style>
