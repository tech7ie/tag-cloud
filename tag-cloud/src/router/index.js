import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../MainPage.vue';
import AdminPanel from '../views/AdminPanel.vue';
import AdminLogin from '../views/AdminLogin.vue'

const routes = [
  { path: '/web/admin-login', component: AdminLogin },
  { path: '/web/', name: 'Home', component: MainPage },
  { path: '/web/admin', name: 'Admin', component: AdminPanel },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
