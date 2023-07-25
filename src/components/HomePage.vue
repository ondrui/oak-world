<template>
  <div class="home-page">
    <TheHeader />
    <SectionOtherCities />
    <div class="page-wrapper">
      <div class="main">
        <BreadCrumbs v-if="isBreadcrumbsShow" />
        <SearchBar />
        <div class="link-city">
          <router-link :to="pushNewURL()">{{ getTitleLink }}</router-link>
          <div class="arrow-icon">
            <BaseIcon width="9" nameIcon="arrow-right" pick="common" />
          </div>
        </div>
        <router-view></router-view>
      </div>
      <TheAside class="sidebar">
        <HistoryAside />
      </TheAside>
    </div>
    <SectionHistoryCities class="middle-section" />
    <HistoryAside class="mob-section" />
    <ScrollTop />
  </div>
</template>

<script>
import SectionOtherCities from "@/components/SectionOtherCities.vue";
import TheAside from "@/components/TheAside.vue";
import TheHeader from "@/components/TheHeader.vue";
import HistoryAside from "@/components/HistoryAside.vue";
import SectionHistoryCities from "@/components/SectionHistoryCities.vue";
import ScrollTop from "@/components/ScrollTop.vue";
import { mapGetters } from "vuex";
import { cityIn } from "lvovich";

export default {
  name: "HomePage",
  components: {
    TheHeader,
    TheAside,
    SectionOtherCities,
    HistoryAside,
    SectionHistoryCities,
    ScrollTop,
  },
  computed: {
    ...mapGetters([
      "getCountryNameLoc",
      "getListAllCities",
      "getConstantLocale",
      "getCitySelected",
      "getLocaleURL",
    ]),
    isBreadcrumbsShow() {
      return this.$route.meta.breadcrumb[0].name !== "404";
    },
    /**
     * Возвращает строку с текстовым содержимым ссылки.
     */
    getTitleLink() {
      const country = cityIn(this.getCountryNameLoc);
      return this.getConstantLocale("allCityBtnCaption")
        .replace("$_length", this.getListAllCities.length)
        .replace("$_country", country);
    },
  },
  methods: {
    /**
     * Функция возвращает объект описывающий маршрут перехода на новый URL.
     * @param name Строка содержит имя маршрута для роутера.
     * @param lang Текущая локаль берется из стора.
     * @param city Город для которого выводится прогноз погоды берется из стора.
     */
    pushNewURL() {
      return {
        name: "countries",
        params: {
          lang: this.getLocaleURL,
          city: this.getCitySelected.name_en,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.home-page {
  position: relative;
  // margin-top: 30px;
}
.page-wrapper {
  display: grid;
  min-height: 100vh;
  grid-template-columns: minmax(0, 1fr) 300px;
  column-gap: 48px;
  row-gap: 36px;
  max-width: $width-page-xl;
  padding: 0 10px;
  width: 100%;
  min-width: 390px;
  margin: 0 auto;
  margin-bottom: 40px;
}
.main {
  max-width: 100%;
  min-width: 390px;
}
.mob-section,
.middle-section {
  display: none;
  margin-bottom: 50px;
}
.link-city {
  position: relative;
  margin: 0 auto;
  bottom: 32px;
  left: 0;
  right: 0;
  width: max-content;

  & .arrow-icon {
    pointer-events: none;
    display: flex;
    transition: transform 0.3s ease-in-out;
    width: 9px;
    height: 9px;
    position: absolute;
    margin: auto 0;
    right: 14px;
    bottom: 0;
    top: 0;
  }
  &:hover .arrow-icon {
    transform: scale(1.2);
  }

  & a {
    text-decoration: none;
    display: inline-block;
    padding: 12px 30px 12px 14px;
    background: #e1ecf9;
    border-radius: 20px;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: #04569c;
    &:hover {
      text-decoration: underline;
      background: #d0e3f8;
    }
  }
}
@media only screen and (max-width: $media-width-xl) {
  .page-wrapper,
  .app-container {
    display: block;
    max-width: $width-page-lg;
    .sidebar {
      display: none;
    }
  }
  .middle-section {
    display: block;
  }
}
@media only screen and (max-width: $media-width-sm) {
  .mob-section {
    display: block;
    padding: 0 10px;
  }
  .middle-section {
    display: none;
  }
}
</style>
