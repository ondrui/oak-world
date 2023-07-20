import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import components from "./components/UI";
import directives from "./directives";

import VueMeta from "vue-meta";
/**
 * Библиотека для добавления атрибутов с динамическими метаданными в
 * приложение из компонентов.
 */
Vue.use(VueMeta, {
  keyName: "head",
});
/**
 * Регистрация часто используемых компонент и директив глобально.
 */
components.forEach((component) => {
  Vue.component(component.name, component);
});

directives.forEach((directive) => {
  Vue.directive(directive.name, directive);
});
/**
 * Создаем глобальную шину событий.
 */
export const eventBus = new Vue();
Vue.config.productionTip = false;

const vm = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

window.vm = vm;
