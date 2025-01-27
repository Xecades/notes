<script setup lang="tsx">
/** @todo 图片缓存，不能每次都重新加载一遍 */

import { computed, onMounted, onUpdated } from "vue";
import { RouterView, useRoute } from "vue-router";
import { navigate, sleep } from "@/assets/ts/utils";

import Timestamp from "./Timestamp.vue";
import Comment from "./Comment.vue";
import Metadata from "./Metadata.vue";

import "@/assets/css/markdown.styl";

// Types
import type { Ref } from "vue";
import type { RouteMeta } from "vite-plugin-vue-xecades-note";

const props = defineProps<{ meta: RouteMeta }>();
const route = useRoute();

/**
 * Whether to show timestamp.
 *
 *  - If not specified in front-matter, return true if it is a post.
 *  - Otherwise, return the value in front-matter.
 */
const show_timestamp: Ref<boolean> = computed(() => {
    if (props.meta.attr.timestamp === undefined)
        return props.meta.type === "post";
    return props.meta.attr.timestamp;
});

/**
 * Whether to show comments.
 *
 *  - If not specified in front-matter, return true if it is a post.
 *  - Otherwise, return the value in front-matter.
 */
const show_comment: Ref<boolean> = computed(() => {
    if (props.meta.attr.comment === undefined)
        return props.meta.type === "post";
    return props.meta.attr.comment;
});

/**
 * Iterate through headings and register anchor click event.
 */
const registerAnchor = () => {
    const headings = document.querySelectorAll(".heading");

    headings.forEach((heading) => {
        const anchor = heading.querySelector(".header-anchor");
        if (anchor) {
            anchor.addEventListener("click", (e: Event) => {
                e.preventDefault();
                navigate(heading.id);
            });
        }
    });
};

const scrollToAnchor = async () => {
    await sleep(100);
    const hash = route.hash;
    navigate(hash.slice(1));
};

onMounted(scrollToAnchor);
onMounted(registerAnchor);
onUpdated(registerAnchor);
</script>

<template>
    <div id="content">
        <header>
            <h1>{{ meta.attr.displayTitle ?? meta.attr.title }}</h1>
        </header>

        <Metadata
            :breadcrumb="meta.breadcrumb"
            :type="meta.type"
            :key="meta.attr.title"
        />

        <main class="markdown">
            <RouterView />
        </main>

        <Timestamp
            v-if="show_timestamp"
            :created="meta.created"
            :updated="meta.updated"
        />

        <Comment v-if="show_comment" />
    </div>
</template>

<style scoped lang="stylus">
@import "../assets/css/global.styl";

#content
    dual(--width, 740px, 100%);
    dual(--margin-lr, 3rem, 2.1rem);
    dual(--margin-top, 4rem, 6.3rem);
    dual(--margin-bottom, 4rem, 3rem);
    dual(--header-size, 2.2rem, 2rem);
    dual(--header-line-height, 3.5rem, 3rem);

    scheme(--header-color, lighten($text-color, 23%), darken($text-color-d, 3%));

    width: var(--width);
    margin: 0 auto;
    z-index: 10;

main
    margin: 0 var(--margin-lr) var(--margin-bottom);

header
    margin: var(--margin-top) var(--margin-lr) 0.7rem;

    h1
        font-size: var(--header-size);
        color: var(--header-color);
        line-height: var(--header-line-height);
        font-weight: 500;
</style>
