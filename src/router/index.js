import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/signin",
    name: "signin",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/registration",
    name: "registration",
    component: () => import("../views/Registration.vue"),
  },
  {
    path: "/",
    name: "ribbon",
    component: () => import("../views/Ribbon.vue"),
  },
  {
    path: "/profile/:nickname",
    name: "profile",
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/conversations",
    name: "conversations",
    component: () => import("../views/Conversations.vue"),
  },
  {
    path: "/conversations/:user",
    name: "conversationUser",
    component: () => import("../views/Conversations.vue"),
  },
  {
    path: "/photo-redactor",
    name: "photo-redactor",
    component: () => import("../views/PhotoRedactor.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../views/Settings.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
