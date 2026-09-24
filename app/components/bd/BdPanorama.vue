<script setup lang="ts">
import {
  PANORAMA_CITY,
  PANORAMA_CITY_LIGHTS,
  PANORAMA_FLOORS,
  PANORAMA_FOOTHILLS,
  PANORAMA_RIDGE,
  PANORAMA_RIDGE_FAR,
  PANORAMA_RIDGE_FILL,
  PANORAMA_TOWER_LIGHTS,
} from '~/helpers/panorama'

const SWIPE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const CABLE_CAR_PATH = 'M430 318 L512 124'

const { t } = useI18n()

const ridgeRef = ref<SVGSVGElement>()
const isSwipeable = ref(false)
let swipeQuery: MediaQueryList | null = null

function onSwipeChange(event: MediaQueryListEvent): void {
  isSwipeable.value = event.matches
}

onMounted(() => {
  swipeQuery = window.matchMedia(SWIPE_QUERY)
  isSwipeable.value = swipeQuery.matches
  swipeQuery.addEventListener('change', onSwipeChange)
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) ridgeRef.value?.pauseAnimations()
})

onBeforeUnmount(() => {
  swipeQuery?.removeEventListener('change', onSwipeChange)
})
</script>

<template>
  <div class="bd-panorama">
    <div class="bd-meta bd-panorama-hint">
      <span>{{ t('bd.footer.panorama.title') }}</span>
      <span aria-hidden="true">{{ t('bd.footer.panorama.swipe') }} →</span>
    </div>
    <div
      class="bd-land-scroll"
      :role="isSwipeable ? 'region' : undefined"
      :aria-label="isSwipeable ? t('bd.footer.panorama.label') : undefined"
      :tabindex="isSwipeable ? 0 : undefined"
    >
      <div class="bd-land">
        <svg class="bd-lay bd-lay1" aria-hidden="true" focusable="false" viewBox="0 0 1440 440" preserveAspectRatio="xMidYMax slice">
          <path :d="PANORAMA_RIDGE_FAR" fill="var(--lay1)" />
        </svg>
        <svg
          ref="ridgeRef"
          class="bd-lay bd-lay2"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 1440 440"
          preserveAspectRatio="xMidYMax slice"
        >
          <path :d="PANORAMA_RIDGE_FILL" fill="var(--lay2)" />
          <path :d="PANORAMA_RIDGE" fill="none" stroke="var(--chillon)" stroke-opacity=".55" stroke-width="1.2" />
          <g fill="var(--lay2)" stroke="var(--ink-muted)" stroke-width="1">
            <path d="M507 122 L507 111 L523 111 L523 122" />
            <path d="M505 111 L515 103 L525 111" />
            <path d="M519 106 L519 97 L523 97 L523 108" />
          </g>
          <g stroke="var(--ink-muted)" stroke-width="1" fill="none">
            <path d="M900 92 L900 76 M895 81 L905 81" />
            <circle cx="900" cy="73" r="2" />
          </g>
          <path :d="CABLE_CAR_PATH" stroke="var(--ink-muted)" stroke-opacity=".7" stroke-width="1" stroke-dasharray="3 4" />
          <rect x="-4" y="-3" width="8" height="6" fill="var(--ink)">
            <animateMotion
              dur="16s"
              repeatCount="indefinite"
              :path="CABLE_CAR_PATH"
              keyPoints="0;1;1;0;0"
              keyTimes="0;0.45;0.5;0.95;1"
              calcMode="linear"
            />
          </rect>
          <path d="M515 94 L515 70 M900 66 L900 46" stroke="var(--ink-muted)" stroke-width="1" />
          <g class="bd-land-labels" fill="var(--ink-muted)" text-anchor="middle">
            <text x="515" y="60">{{ t('bd.footer.panorama.monserrate') }}</text>
            <text x="900" y="36">{{ t('bd.footer.panorama.guadalupe') }}</text>
            <text x="1400" y="36" text-anchor="end">{{ t('bd.footer.panorama.view') }}</text>
          </g>
        </svg>
        <svg class="bd-lay bd-lay3" aria-hidden="true" focusable="false" viewBox="0 0 1440 440" preserveAspectRatio="xMidYMax slice">
          <path :d="PANORAMA_FOOTHILLS" fill="var(--lay3)" />
        </svg>
        <img
          src="/copeton.png"
          alt=""
          class="bd-copeton bd-lay bd-lay-bird"
          width="586"
          height="433"
          loading="lazy"
          decoding="async"
        >
        <svg class="bd-lay bd-lay4" aria-hidden="true" focusable="false" viewBox="0 0 1440 440" preserveAspectRatio="xMidYMax slice">
          <path :d="PANORAMA_CITY" fill="var(--lay4)" />
          <path class="bd-lights" :d="PANORAMA_CITY_LIGHTS" fill="var(--monjita)" fill-opacity=".6" />
          <g fill="var(--lay4)" stroke="var(--bld-edge)" stroke-width="1">
            <path d="M318 440 V292 H316 V286 H354 V292 H352 V440 Z"><title>{{ t('bd.footer.panorama.cci') }}</title></path>
            <path d="M370 440 V293 L402 279 V440 Z"><title>{{ t('bd.footer.panorama.atrio') }}</title></path>
            <path
              d="M430 440 V370 Q432 356 444 356 Q456 358 456 374 V440 Z M458 440 V384 Q460 370 472 370 Q484 372 484 388 V440 Z M484 440 V398 Q486 384 498 384 Q510 386 510 402 V440 Z"
              fill="var(--brick)"
            ><title>{{ t('bd.footer.panorama.parque') }}</title></path>
            <path d="M528 440 V288 H531 V283 H553 V288 H556 V440 Z"><title>{{ t('bd.footer.panorama.colpatria') }}</title></path>
            <path d="M590 440 V285 L620 267 V440 Z"><title>{{ t('bd.footer.panorama.bacataSouth') }}</title></path>
            <path d="M624 440 V306 L648 318 V440 Z"><title>{{ t('bd.footer.panorama.bacataNorth') }}</title></path>
            <path d="M690 440 V315 H694 V311 H716 V315 H720 V440 Z"><title>{{ t('bd.footer.panorama.avianca') }}</title></path>
          </g>
          <g class="bd-bld-line" stroke="var(--bld-edge)" stroke-width="1" fill="none">
            <path d="M372 432 L400 380 M372 380 L400 328 M372 328 L400 276 M400 432 L372 380 M400 380 L372 328 M400 328 L372 290" />
          </g>
          <rect class="bd-colpatria" x="530" y="290" width="24" height="150" />
          <g class="bd-bld-line" stroke="var(--bld-edge)" stroke-width="1" fill="none">
            <path d="M533 289 V440 M537 289 V440 M541 289 V440 M545 289 V440 M549 289 V440" />
            <path d="M694 317 V440 M697 317 V440 M700 317 V440 M703 317 V440 M706 317 V440 M709 317 V440 M712 317 V440 M715 317 V440" />
          </g>
          <path class="bd-crown" d="M590 285 L620 267" stroke="var(--chillon)" stroke-width="1.5" />
          <path class="bd-floors" :d="PANORAMA_FLOORS" stroke="var(--bld-edge)" stroke-width="1" fill="none" />
          <path class="bd-lights" :d="PANORAMA_TOWER_LIGHTS" fill="var(--monjita)" fill-opacity=".75" />
          <g class="bd-lights" fill="var(--mirla)">
            <circle class="bd-beacon" cx="605" cy="271" r="1.8" />
            <circle class="bd-beacon bd-beacon-2" cx="542" cy="280" r="1.8" />
            <circle class="bd-beacon bd-beacon-3" cx="386" cy="276" r="1.8" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
