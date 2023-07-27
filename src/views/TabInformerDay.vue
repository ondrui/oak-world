<template>
  <div class="wrapper">
    <ScrollableModeInformer
      :labelCoordinates="{
        temp: '135px',
        wind: '333px',
        pressure: '386px',
        humidity: '423px',
      }"
    >
      <template #row-caption>
        <RowCaptionInformer class="temp">
          {{ getConstantLocale("climateIndicators", "temp") }}
        </RowCaptionInformer>
        <RowCaptionInformer class="wind">
          {{ getConstantLocale("climateIndicators", "windDirSpeed") }}
        </RowCaptionInformer>
        <RowCaptionInformer class="pressure">
          {{ getConstantLocale("climateIndicators", "pressure") }},
          {{ getConstantLocale("units", "pressure")[0] }}
        </RowCaptionInformer>
        <RowCaptionInformer class="humidity">
          {{ getConstantLocale("climateIndicators", "humidity") }}
        </RowCaptionInformer>
      </template>
      <TabInformerDayContent
    /></ScrollableModeInformer>
  </div>
</template>

<script>
import ScrollableModeInformer from "@/components/ScrollableModeInformer.vue";
import TabInformerDayContent from "@/components/TabInformerDayContent.vue";
import RowCaptionInformer from "@/components/RowCaptionInformer.vue";
import { mapGetters } from "vuex";
import { cityIn } from "lvovich";

export default {
  name: "TabInformerDay",
  /**
   * Параметр компонента, который содержит всю информацию,
   * которая преобразуется в различные метатеги и атрибуты страницы.
   * Добавляет информацию в тег <title>
   * Добавляет на страницу метатег <meta> с атрибутом name и keywords.
   * Добавляет на страницу метатег <meta> с атрибутом name и description.
   */
  head() {
    const inflectCityName = cityIn(this.getCitySelected.nameLoc);
    const country = cityIn(this.getCountrySelected);
    const daysNum = this.tenDaysTabTable.length;
    const strTitle = this.getConstantLocale("day", "title")
      .replace("$_city", inflectCityName)
      .replace("$_days", daysNum);
    const strDescr =
      this.getLocale === "am"
        ? this.getConstantLocale("day", "description")
            .replace("$_days", daysNum)
            .replace("$_city", inflectCityName)
        : this.getConstantLocale("day", "description")
            .replace("$_city", inflectCityName)
            .replace("$_days", daysNum);
    const strKeywords = this.getConstantLocale("day", "keywords")
      .replace("$_city", inflectCityName)
      .replace("$_days", daysNum)
      .replace("$_country", country)
      .replace("$_days", daysNum);
    return {
      title: strTitle,
      meta: [
        {
          name: "description",
          content: strDescr,
        },
        {
          name: "keywords",
          content: strKeywords,
        },
      ],
    };
  },
  components: {
    ScrollableModeInformer,
    TabInformerDayContent,
    RowCaptionInformer,
  },
  computed: {
    ...mapGetters([
      "getConstantLocale",
      "tenDaysTabTable",
      "getCitySelected",
      "getCountrySelected",
      "getLocale",
    ]),
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 20px;
  width: 100%;
}
@media only screen and (max-width: $media-width-lg) {
  .wrapper {
    padding: 20px 5px;
  }
}
</style>
