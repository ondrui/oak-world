import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

// import WeatherInformer from "@/views/WeatherInformer.vue";
import NotFound from "@/views/NotFound.vue";
import ListTopWorldCities from "@/views/ListTopWorldCities.vue";
import ListCountries from "@/views/ListCountries.vue";
import CountryPage from "@/views/CountryPage.vue";
import ListCities from "@/views/ListCities.vue";
import WeatherInformerDay from "@/views/WeatherInformerDay.vue";
import WeatherInformerHourly from "@/views/WeatherInformerHourly.vue";
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
    path: "/:lang?/:country/:region?/:city/day",
    name: "day",
    component: WeatherInformerDay,
    meta: {
      breadcrumb: [{ name: "main" }, { name: "weather" }],
    },
  },
  {
    path: "/:lang?/:country/:region?/:city/hourly",
    name: "hourly",
    component: WeatherInformerHourly,
    meta: {
      breadcrumb: [{ name: "main" }, { name: "weather" }],
    },
  },
  {
    path: "/:lang?",
    name: "main",
    component: WeatherInformerHourly,
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
    // Прокручиваем страницу наверх при переходе на определенные страницы
    // и при нажатии кнопки со стрелкой вверх.
    if (
      (to.name !== "main" && to.name !== "day" && to.name !== "hourly") ||
      to.hash === "#top"
    ) {
      console.log("scroll to top!");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // Прокручиваем страницу к выбранной карточке при ее выборе
    // на графике дневного прогноза.
    if (to.hash && to.hash !== "#top") {
      console.log("hash");
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
router.beforeEach(async (to, from, next) => {
  console.table("from", from);
  console.table("to", to);
  const obj = {
    langURL: to.params.lang,
    cityURL: to.params.city,
    countryURL: to.params.country,
    regionURL: to.params.region,
    nameRouteURL: to.name,
  };
  console.log(obj, "call function in hook beforeEach router!");
  const code = await store.dispatch("setParams", obj);
  /**
   * Код 404 указывает на несуществующую страницу,
   */
  if (code === 404) {
    console.log("code 404");
    // Передаем параметры в маршрут, чтобы URL не изменился при вызове next().
    next({
      name: "not-found",
      params: {
        pathMatch: to.path.split("/").slice(1),
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
    console.log("code 100 initial download");
    next({
      name: to.name,
      params: {
        lang: store.getters.getLocaleURL,
        city: store.getters.getCitySelected.name_en,
        country: store.getters.getCountryNameLoc,
      },
    });
  } else {
    console.log("exit hook beforEach router");
    store.commit(LOADING, false);
    next();
  }
});

export default router;
