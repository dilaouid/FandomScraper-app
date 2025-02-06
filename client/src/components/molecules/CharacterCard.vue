<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Character } from '@/types'
import { useWikiStore } from '@/stores/useWikiStore';
const apiUrl = import.meta.env.VITE_API_URL

const props = defineProps<{
  character: Character
}>()

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxYTBmMGYiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4NSIgcj0iMzUiIGZpbGw9IiM0YjAwMDAiLz4KICA8cmVjdCB4PSI1MCIgeT0iMTMwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM0YjAwMDAiLz4KPC9zdmc+'

const currentImageIndex = ref(0)
const imageLoaded = ref(false)
const isImageLoading = ref(true)
const store = useWikiStore()


const setImageIndex = (index: number) => {
  currentImageIndex.value = index
}

const getImageUrl = (url: string) => {
  if (url.startsWith('data:')) return url
  const referer = store.getBaseUrl(props.character.url)

  return `${apiUrl}/proxy?url=${encodeURIComponent(url)}${referer ? `&referer=${encodeURIComponent(referer)}` : ''}`
}

/**
 * Pour une URL donnée, on effectue une requête HEAD afin de vérifier
 * si la ressource existe. En cas de code 404 ou d'erreur, on retourne
 * l'URL proxy.
 */
const resolveImageUrl = async (url: string): Promise<string> => {
  if (url.startsWith('data:')) return url
  let finalUrl = url
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (response.status === 404) {
      finalUrl = getImageUrl(url)
    }
  } catch (error) {
    finalUrl = getImageUrl(url)
  }
  return finalUrl
}

// --- Logique pour l'image principale ---
const finalImageUrl = ref<string>(placeholderImage)

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
  const img = new Image()
  img.onload = () => {
    isImageLoading.value = false
    imageLoaded.value = true
    finalImageUrl.value = resolvedUrl
  }
  img.onerror = () => {
    isImageLoading.value = false
    finalImageUrl.value = placeholderImage
  }
  img.src = resolvedUrl
}

watch(
  [() => currentImageIndex.value, () => props.character.data?.images],
  () => {
    updateImage()
  },
  { immediate: true }
)

const displayImage = computed(() => finalImageUrl.value)


// --- Logique de résolution pour les miniatures ---
const resolvedThumbnails = ref(new Map<string, string>())

watch(() => props.character.data?.images, (images) => {
  if (images && images.length) {
    images.forEach((imgUrl: string) => {
      // On résout l'URL si ce n'est pas déjà fait
      if (!resolvedThumbnails.value.has(imgUrl)) {
        resolveImageUrl(imgUrl).then(resolved => {
          resolvedThumbnails.value.set(imgUrl, resolved)
        })
      }
    })
  }
}, { immediate: true })

// Expose un tableau des URLs résolues pour les miniatures
const resolvedThumbnailUrls = computed(() => {
  return props.character.data?.images?.map((imgUrl: string) => {
    return resolvedThumbnails.value.get(imgUrl) || imgUrl
  }) || []
})


// --- Navigation entre images ---
const nextImage = () => {
  if (!props.character.data?.images) return
  currentImageIndex.value = (currentImageIndex.value + 1) % props.character.data.images.length
}

const previousImage = () => {
  if (!props.character.data?.images) return
  currentImageIndex.value = currentImageIndex.value === 0
    ? props.character.data.images.length - 1
    : currentImageIndex.value - 1
}

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
  console.log(props.character.data?.gender)
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

let touchStartX = 0
const touchThreshold = 50

const handleTouchStart = (event: TouchEvent) => {
  touchStartX = event.touches[0].clientX
}

const handleTouchMove = (event: TouchEvent) => {
  if (!touchStartX) return
  const touchEndX = event.touches[0].clientX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > touchThreshold) {
    if (diff > 0) {
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

const emit = defineEmits<{
  (e: 'select', id: number): void;
  (e: 'image-change', index: number): void;
}>()

const handleCardClick = () => {
  emit('select', props.character.id)
}
</script>

<template>
  <div class="relative group">
    <!-- Zone principale de la carte : cliquable pour accéder à la fiche personnage -->
    <div class="card-clickable-area relative rounded-xl overflow-hidden cursor-pointer" @click="handleCardClick">
      <!-- Fond avec motif japonais -->
      <div class="absolute inset-0">
        <div class="japanese-pattern absolute inset-0 bg-cover bg-center" />
      </div>

      <!-- Conteneur de l'image avec overlay -->
      <div class="relative aspect-square w-full" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
        @touchend="handleTouchEnd">
        <!-- Fond rouge semi-transparent -->
        <div class="absolute inset-0 bg-gradient-to-br from-red-900/40 to-red-950/20 backdrop-blur-sm"></div>

        <!-- Image du personnage -->
        <div class="character-container absolute inset-0">
          <div
            class="character-image transition-transform duration-300 transform scale-105 filter grayscale contrast-110 group-hover:scale-110 group-hover:filter-none"
            :style="{
              backgroundImage: `url(${displayImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
              backgroundRepeat: 'no-repeat'
            }">
          </div>
        </div>

        <!-- Overlay en bas avec le nom et, le cas échéant, le kanji -->
        <div
          class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-20">
          <h3 class="text-white font-semibold truncate text-lg">
            {{ character.name }}
          </h3>
          <p v-if="character.data?.kanji" class="text-white/80 text-sm mt-1 font-japanese truncate">
            {{ character.data.kanji }}
          </p>
        </div>

        <!-- Badges de status et de genre -->
        <div class="absolute top-2 right-2 flex gap-2 pointer-events-none  z-20">
          <span v-if="character.data?.status"
            class="character-badge w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            {{ statusIcon }}
          </span>
          <span v-if="character.data?.gender"
            class="character-badge w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
            {{ genderIcon }}
          </span>
        </div>

        <!-- Loader sur l'image pendant le chargement -->
        <div v-if="isImageLoading"
          class="absolute inset-0 flex items-center justify-center z-30 backdrop-blur-sm bg-black/30">
          <div class="image-loader">
            <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone des miniatures en dehors de la zone cliquable -->
    <div class="mt-2 flex justify-center gap-2">
      <div v-for="(image, index) in character.data?.images" :key="index" @click="setImageIndex(index)"
        class="w-12 h-12 rounded-md overflow-hidden border-2 transition-transform duration-300 cursor-pointer"
        :class="currentImageIndex === index ? 'border-red-500 scale-110' : 'border-transparent hover:border-red-500/50'"
        :style="{
          backgroundImage: `url(${resolvedThumbnailUrls[index]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }">
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-navigation {
  pointer-events: auto;
}

.japanese-pattern {
  background-image: url('@/assets/images/background.jpg');
  transform: scale(1.5);
  opacity: 0.6;
  filter: brightness(0.7) sepia(0.2) hue-rotate(-10deg);
  transition: all 0.3s ease;
  animation: patternScroll 20s linear infinite paused;
}

.group:hover .japanese-pattern {
  opacity: 0.85;
  filter: brightness(1) sepia(0.1) hue-rotate(-10deg);
  animation-play-state: running;
}

.group:not(:hover) .japanese-pattern {
  animation-play-state: paused;
}

.character-container {
  isolation: isolate;
  z-index: 2;
}

.character-image {
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
  transform: scale(1.05);
  filter: grayscale(80%) contrast(1.1);
}

/* Glow effect pour les PNG */
.character-image {
  animation: subtleGlow 2s ease-in-out infinite;
}

.group:hover .character-image {
  transform: scale(1.1);
  filter: grayscale(0%) contrast(1);
  animation: hoverGlow 2s ease-in-out infinite;
}

@keyframes subtleGlow {

  0%,
  100% {
    filter: grayscale(80%) contrast(1.1) drop-shadow(0 0 2px rgba(255, 0, 0, 0.2));
  }

  50% {
    filter: grayscale(80%) contrast(1.1) drop-shadow(0 0 4px rgba(255, 0, 0, 0.3));
  }
}

@keyframes hoverGlow {

  0%,
  100% {
    filter: grayscale(0%) drop-shadow(0 0 5px rgba(255, 0, 0, 0.4));
  }

  50% {
    filter: grayscale(0%) drop-shadow(0 0 10px rgba(255, 0, 0, 0.6));
  }
}

.content-layer {
  pointer-events: none;
}

.content-layer button {
  pointer-events: auto;
}

.character-badge {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(4px);
  border: 1px solid rgb(255 255 255 / 0.1);
  pointer-events: none;
}

@keyframes patternScroll {
  0% {
    background-position: 0% center;
  }

  100% {
    background-position: -200% center;
  }
}

.font-japanese {
  font-family: "Noto Sans JP", sans-serif;
}

.preview-thumbnail {
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  padding: 4px;
  pointer-events: auto;
}

.preview-thumbnail:hover {
  transform: translateY(-4px);
}

.preview-thumbnail.active {
  position: relative;
}

.preview-thumbnail.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 8px #ef4444;
}
</style>
