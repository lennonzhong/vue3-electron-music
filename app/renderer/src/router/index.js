import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import BasicLayout from "./../layout/BasicLayout.vue"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: BasicLayout,
      redirect: "/search",
      children: [
        {
          path: '/search',
          name: 'search',
          component: () =>
            import(/* webpackChunkName: "search" */ "@/views/home/index.vue")
        },
        {
          path: '/collect',
          name: 'collect',
          component: () =>
            import(/* webpackChunkName: "collect" */ "@/views/collect/index.vue")
        }
      ]
    }
  ]
})

export default router
