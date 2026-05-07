import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import ShowDetailPage from '../views/ShowDetailPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/show/:id',
            name: 'show-detail',
            component: ShowDetailPage,
        },
    ],
});

export default router;
