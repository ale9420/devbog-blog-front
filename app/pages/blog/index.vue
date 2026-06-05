<script setup lang="ts">
import { Locale } from "~/interfaces";

const { locale, t } = useI18n();
const route = useRoute();
const router = useRouter();
const { useFetchPosts } = useStrapi();
const { localizePath } = useLocaleUtils();
const { siteUrl } = useSiteUrl();
const { canonicalUrl } = useCanonicalUrl('/blog');

const selectedCategory = ref<string>((route.query.category as string) || "");
const selectedTag = ref<string>((route.query.tag as string) || "");
const currentPage = ref<number>(Number(route.query.page) || 1);
const pageSize = 6;

const { data: postsResult, pending } = useFetchPosts({
  page: currentPage.value,
  pageSize,
  locale: locale.value as Locale,
});

const posts = computed(() => postsResult.value?.data || []);
const pagination = computed(
  () =>
    postsResult.value?.pagination || {
      total: 0,
      page: 1,
      pageSize: 6,
      pageCount: 1,
    },
);

watch(currentPage, () => {
  updateQuery();
});

const categories = computed(() => {
  if (!posts.value) return [];
  const catMap = new Map();
  posts.value.forEach((post: any) => {
    if (post.category) {
      const name = post.category.name;
      catMap.set(name, {
        id: post.category.id,
        name,
        count: (catMap.get(name)?.count || 0) + 1,
      });
    }
  });
  return Array.from(catMap.values());
});

const popularTags = ref([
  "AI",
  "Linux",
  "Vue",
  "TypeScript",
  "DevOps",
  "Python",
  "Docker",
]);

const recentPosts = computed(() => {
  if (!posts.value) return [];
  return posts.value.slice(0, 4);
});

const filteredPosts = computed(() => {
  if (!posts.value) return [];
  let result = posts.value;

  if (selectedCategory.value) {
    result = result.filter(
      (p: any) => p.category?.name === selectedCategory.value,
    );
  }

  if (selectedTag.value) {
    result = result.filter((p: any) => {
      const tags = p.tags?.data?.map((t: any) => t.attributes?.name) || [];
      return tags.includes(selectedTag.value);
    });
  }

  return result;
});

function handleCategorySelect(category: string) {
  selectedCategory.value = selectedCategory.value === category ? "" : category;
  currentPage.value = 1;
  updateQuery();
}

function handleTagSelect(tag: string) {
  selectedTag.value = selectedTag.value === tag ? "" : tag;
  currentPage.value = 1;
  updateQuery();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearFilters() {
  selectedCategory.value = "";
  selectedTag.value = "";
  currentPage.value = 1;
  updateQuery();
}

function updateQuery() {
  const query: Record<string, string | number> = {};
  if (selectedCategory.value) query.category = selectedCategory.value;
  if (selectedTag.value) query.tag = selectedTag.value;
  if (currentPage.value > 1) query.page = currentPage.value;
  router.push({ query });
}



useSeoMeta({
  title: "Blog - BogDev",
  ogTitle: "Blog - BogDev",
  description:
    "Browse all articles on AI, software development, Linux, DevOps, and more. Find tutorials, tips, and insights from my tech journey.",
  ogDescription:
    "Browse all articles on AI, software development, Linux, DevOps, and more. Find tutorials, tips, and insights from my tech journey.",
  ogImage: "/og-image.png",
  ogUrl: () => canonicalUrl.value,
  twitterCard: "summary_large_image",
  twitterTitle: "Blog - BogDev",
  twitterDescription:
    "Browse all articles on AI, software development, Linux, DevOps, and more.",
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
    <div class="mb-8">
      <h1 class="font-display text-3xl lg:text-4xl font-bold mb-2">
        {{ t("nav.blog") }}
      </h1>
      <p class="text-[var(--muted)]">{{ t("blog.exploreArticles") }}</p>
    </div>

    <div class="lg:grid lg:grid-cols-4 lg:gap-8">
      <div class="lg:col-span-3">
        <div v-if="pending" class="grid md:grid-cols-2 gap-6">
          <div
            v-for="i in 6"
            :key="i"
            class="card overflow-hidden animate-pulse"
          >
            <div class="aspect-[16/10] bg-[var(--surface-elevated)]"></div>
            <div class="p-5 space-y-3">
              <div class="h-4 bg-[var(--surface-elevated)] rounded w-1/4"></div>
              <div class="h-6 bg-[var(--surface-elevated)] rounded w-3/4"></div>
              <div class="h-4 bg-[var(--surface-elevated)] rounded"></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="filteredPosts.length > 0"
          class="grid md:grid-cols-2 gap-6"
        >
          <BlogPostCard
            v-for="(post, index) in filteredPosts"
            :key="post.id"
            :post="post"
            :index="index"
          />
        </div>

        <div v-else class="text-center py-16">
          <div
            class="w-20 h-20 mx-auto mb-6 rounded-full gradient-bogota-subtle flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-document-text"
              class="w-10 h-10 text-[var(--muted)]"
            />
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ t("blog.noPosts") }}</h3>
          <p class="text-[var(--muted)]">
            {{
              selectedCategory || selectedTag
                ? t("blog.tryAdjustingFilters")
                : t("blog.noArticlesYet")
            }}
          </p>
          <button
            v-if="selectedCategory || selectedTag"
            @click="clearFilters"
            class="btn-secondary mt-4"
          >
            {{ t("blog.clearFilters") }}
          </button>
        </div>

        <div
          v-if="!selectedCategory && !selectedTag && filteredPosts.length > 0"
          class="mt-8"
        >
          <BlogPagination
            :current-page="currentPage"
            :total-pages="pagination.pageCount"
            :total-items="pagination.total"
            @page-change="handlePageChange"
          />
        </div>
      </div>

      <aside class="hidden lg:block">
        <div class="sticky top-24">
          <BlogSidebar
            :categories="categories"
            :popular-tags="popularTags"
            :recent-posts="recentPosts"
            :selected-category="selectedCategory"
            :selected-tag="selectedTag"
            @select-category="handleCategorySelect"
            @select-tag="handleTagSelect"
          />
        </div>
      </aside>
    </div>
  </div>
</template>
