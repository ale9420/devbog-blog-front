<script setup lang="ts">
import { Category } from '~/interfaces'
import { CATEGORY_INFO } from '~/helpers/categories'

interface FlightRoute {
  d: string
  opacity: number
}

interface Flyer {
  id: string
  route: string
  timing: number
  wing: number
}

interface SpeciesMark {
  category: Category
  cross: [number, number]
  square: [number, number]
  label: [number, number]
  anchor: 'start' | 'end'
}

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const { t } = useI18n()

const ROUTES: readonly FlightRoute[] = [
  { d: 'M -40 560 C 140 420, 300 520, 440 360 S 640 180, 820 120', opacity: 0.55 },
  { d: 'M -40 260 C 120 200, 260 320, 400 250 S 620 90, 820 170', opacity: 0.35 },
  { d: 'M 120 780 C 220 600, 380 640, 500 500 S 700 400, 820 420', opacity: 0.35 },
]

const COMPACT_ROUTES: readonly FlightRoute[] = [
  { d: 'M -30 220 C 60 160, 140 200, 200 140 S 300 60, 400 70', opacity: 0.55 },
  { d: 'M -30 90 C 60 70, 130 130, 200 100 S 320 30, 400 60', opacity: 0.35 },
  { d: 'M 40 320 C 100 250, 180 260, 240 200 S 340 170, 400 180', opacity: 0.35 },
]

const SPECIES: readonly SpeciesMark[] = [
  { category: Category.Software, cross: [440, 360], square: [452, 364], label: [464, 371], anchor: 'start' },
  { category: Category.Ai, cross: [400, 250], square: [412, 254], label: [424, 261], anchor: 'start' },
  { category: Category.Linux, cross: [500, 500], square: [512, 504], label: [524, 511], anchor: 'start' },
  { category: Category.Privacy, cross: [615, 202], square: [596, 206], label: [588, 213], anchor: 'end' },
  { category: Category.Diy, cross: [660, 400], square: [641, 404], label: [633, 411], anchor: 'end' },
]

const width = computed<number>(() => (props.compact ? 390 : 760))
const height = computed<number>(() => (props.compact ? 300 : 720))
const routes = computed<readonly FlightRoute[]>(() => (props.compact ? COMPACT_ROUTES : ROUTES))
const flyers = computed<Flyer[]>(() =>
  routes.value.flatMap((route, routeIndex) =>
    [0, 1, 2].map(wing => ({
      id: `${routeIndex}-${wing}`,
      route: `path("${route.d}")`,
      timing: routeIndex === 1 ? wing + 3 : wing,
      wing,
    })),
  ),
)

function crossPath([x, y]: [number, number]): string {
  return `M${x - 8} ${y} L${x + 8} ${y} M${x} ${y - 8} L${x} ${y + 8}`
}

function speciesColor(category: Category): string {
  return `var(--${CATEGORY_INFO[category].token})`
}
</script>

<template>
  <div :class="['bd-flight', { 'bd-flight-compact': compact }]" aria-hidden="true">
    <div class="bd-flight-contours" />
    <div class="bd-flight-contours bd-flight-contours-major" />
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" class="bd-flight-map" focusable="false">
      <path
        v-for="(route, index) in routes"
        :key="`route-${index}`"
        class="bd-flight-route"
        :d="route.d"
        fill="none"
        stroke="var(--chillon)"
        :stroke-opacity="route.opacity"
        stroke-width="1.2"
      />
      <template v-if="!compact">
        <g stroke="var(--ink-muted)" stroke-width="1">
          <path v-for="mark in SPECIES" :key="mark.category" :d="crossPath(mark.cross)" />
        </g>
        <rect
          v-for="mark in SPECIES"
          :key="`square-${mark.category}`"
          :x="mark.square[0]"
          :y="mark.square[1]"
          width="6"
          height="6"
          :fill="speciesColor(mark.category)"
        />
        <g class="bd-flight-labels" fill="var(--ink-muted)">
          <text
            v-for="mark in SPECIES"
            :key="`label-${mark.category}`"
            :x="mark.label[0]"
            :y="mark.label[1]"
            :text-anchor="mark.anchor"
          >{{ t(`home.hero.species.${mark.category}`) }}</text>
        </g>
      </template>
    </svg>
    <div
      v-for="flyer in flyers"
      :key="flyer.id"
      :class="['bd-flyer', `bd-flyer-t${flyer.timing}`, `bd-flyer-w${flyer.wing}`]"
      :style="{ offsetPath: flyer.route }"
    >
      <svg width="22" height="14" viewBox="0 0 22 14" focusable="false">
        <path d="M1 9 Q6 1 11 8 Q16 1 21 9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <p class="bd-meta bd-flight-caption">{{ compact ? t('home.hero.figureShort') : t('home.hero.figure') }}</p>
  </div>
</template>
