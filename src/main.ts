import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'
import App from './App.vue'

const routes = [
    { path: '/', component: () => import('./components/HelloWorld.vue') },
    { path: '/p/:key', component: () => import('./components/Purchase.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).mount('#app')
