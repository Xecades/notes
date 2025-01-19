import { createRouter, createWebHistory } from "vue-router";
import routes from "@cache/routes";

import type { RouterScrollBehavior } from "vue-router";

const scrollBehavior: RouterScrollBehavior = (_, __, saved) => {
    let target = saved ?? { left: 0, top: 0 };

    const el = document.getElementById("app")!;
    const minHeight = target.top + window.innerHeight;

    el.style.setProperty("min-height", `${minHeight}px`);

    return target;
};

const router = createRouter({
    routes,
    scrollBehavior,
    history: createWebHistory(),
});

export default router;