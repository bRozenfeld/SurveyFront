import {createRouter, createWebHistory} from 'vue-router';
import App from "./App.vue";
import Survey from "./components/Survey.vue";
import NotFound from "./components/NotFound.vue";
import Results from "./components/Results.vue";

const routes = [
  { path: '/', name: 'App', component: App },
  { path: '/surveys/:link', name: 'Survey', component: Survey, props: route => ({ link: route.params.link }) },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
  { path: '/surveys/:id/results', name: 'Results', component: Results, props: route => ({ id: route.params.id }) },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Debugging navigation
router.beforeEach((to, from, next) => {
  console.log('Navigating from', from.fullPath, 'to', to.fullPath);
  next();
});

export default router;
