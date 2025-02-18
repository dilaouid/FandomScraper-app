import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import CharactersPage from '@/pages/CharactersPage.vue'
import CharacterPage from '@/pages/CharacterPage.vue'
import NotFound from '@/pages/NotFound.vue'

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
    {
        path: '/:wiki/characters/:id',
        name: 'character',
        component: CharacterPage,
        props: true,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router