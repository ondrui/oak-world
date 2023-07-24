import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

// import WeatherInformer from "@/views/WeatherInformer.vue";
import NotFound from "@/views/NotFound.vue";
import ListTopWorldCities from "@/views/ListTopWorldCities.vue";
import ListCountries from "@/views/ListCountries.vue";
import CountryPage from "@/views/CountryPage.vue";
import ListCities from "@/views/ListCities.vue";
import TabInformerDay from "@/views/TabInformerDay.vue";
import TabInformerHourly from "@/views/TabInformerHourly.vue";
import { LOADING } from "@/store/mutations";

Vue.use(VueRouter);

const routes = [
  {
    // Список стран + популярные города страны.
    path: "/:lang?/countries",
    name: "countries",
    component: ListCountries,
    /**
     * В метаданных маршрутов указываем информацию для навигации по
     * хлебным крошкам.
     */
    meta: {
      breadcrumb: [{ name: "main" }, { name: "cities" }],
    },
  },
  {
    // Список популярных городов всех стран.
    path: "/:lang?/cities",
    name: "topWorldCities",
    component: ListTopWorldCities,
    /**
     * В метаданных маршрутов указываем информацию для навигации по
     * хлебным крошкам.
     */
    meta: {
      breadcrumb: [{ name: "main" }, { name: "cities" }],
    },
  },
  {
    //  Список регионов страны.
    path: "/:lang?/:country/regions",
    name: "country",
    component: CountryPage,
    /**
     * В метаданных маршрутов указываем информацию для навигации по
     * хлебным крошкам.
     */
    meta: {
      breadcrumb: [{ name: "main" }, { name: "cities" }],
    },
  },
  {
    // Список городов для выбранной страны и опционально выбранного региона.
    path: "/:lang?/:country/:region?/cities",
    name: "cities",
    component: ListCities,
    /**
     * В метаданных маршрутов указываем информацию для навигации по
     * хлебным крошкам.
     */
    meta: {
      breadcrumb: [{ name: "main" }, { name: "cities" }],
    },
  },

  {
    path: "/:lang?:country/:region?/:city/day",
    name: "day",
    component: TabInformerDay,
    meta: {
      breadcrumb: [{ name: "main" }, { name: "weather" }],
    },
  },
  {
    path: "/:lang?:country/:region?/:city/hourly",
    name: "hourly",
    component: TabInformerHourly,
    meta: {
      breadcrumb: [{ name: "main" }, { name: "weather" }],
    },
  },
  {
    path: "/:lang?",
    name: "main",
    component: TabInformerHourly,
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
     */
    if (code === 404) {
      console.log(to.path.split("/").slice(2));
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
