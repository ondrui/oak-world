import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import axios from "axios";

import WeatherInformer from "@/views/WeatherInformer.vue";
import NotFound from "@/views/NotFound.vue";
import ListAllCities from "@/views/ListAllCities.vue";
import TabInformerDay from "@/views/TabInformerDay.vue";
import TabInformerHourly from "@/views/TabInformerHourly.vue";
import TabInformerMain from "@/views/TabInformerMain.vue";
import { LOADING } from "@/store/mutations";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:lang?/cities",
    name: "cities",
    component: ListAllCities,
    /**
     * В метаданных маршрутов указываем информацию для навигации по
     * хлебным крошкам.
     */
    meta: {
      breadcrumb: [{ name: "main" }, { name: "cities" }],
    },
  },
  {
    path: "/:lang?",
    component: WeatherInformer,
    children: [
      {
        path: "",
        name: "main",
        component: TabInformerMain,
        meta: {
          breadcrumb: [{ name: "main" }],
        },
      },
      {
        path: "pogoda/:city/day",
        name: "day",
        component: TabInformerDay,
        meta: {
          breadcrumb: [{ name: "main" }, { name: "weather" }],
        },
      },
      {
        path: "pogoda/:city/hourly",
        name: "hourly",
        component: TabInformerHourly,
        meta: {
          breadcrumb: [{ name: "main" }, { name: "weather" }],
        },
      },
    ],
    meta: {
      breadcrumb: [{ name: "main" }, { name: "weather" }],
    },
  },
  {
    path: "/:lang?/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: {
      breadcrumb: [{ name: "404" }],
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to) {
    if (to.name === "not-found" || to.name === "cities" || to.hash === "#top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    if (to.hash && to.hash !== "#top") {
      // Используем таймаут, чтобы к началу перехода к элементу карточка
      // с графиком успела раскрыться и размер страницы пересчитался.
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ selector: to.hash, offset: { x: 0, y: 50 } });
        }, 400);
      });
      // return { selector: to.hash, offset: { x: 0, y: 50 } };
    }
  },
});
/**
 * В хуке вызывается экшн стора, в который передаются нужные параметры.
 * Результатом его завершения будет код, который обрабатывается в хуке.
 */
router.beforeEach((to, from, next) => {
  const obj = {
    langURL: to.params.lang,
    cityURL: to.params.city,
    nameRouteURL: to.name,
  };
  store.dispatch("setParams", obj).then((code) => {
    /**
     * Код 404 указывает на не существующую страницу,
     * отправляется запрос на сервер для получения ответа с кодом 404.
     */
    if (code === 404) {
      axios.get(to.path).catch((err) => console.log(err));
      next({
        name: "not-found",
        params: {
          pathMatch: to.path.split("/").slice(2),
          lang: store.getters.getLocaleURL,
        },
        meta: {
          breadcrumb: [{ name: "404" }],
        },
      });
      /**
       * Код 100 означает первоначальную загрузку приложения.
       */
    } else if (code === 100) {
      next({
        name: to.name,
        params: {
          lang: store.getters.getLocaleURL,
          city: store.getters.getCitySelected.name_en,
        },
      });
    } else {
      store.commit(LOADING, false);
      next();
    }
  });
});

export default router;
