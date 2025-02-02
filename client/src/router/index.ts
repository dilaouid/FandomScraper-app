import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import CharactersPage from '@/pages/CharactersPage.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
        path: '/:wiki/characters',
        name: 'characters',
        component: CharactersPage,
        props: true,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router