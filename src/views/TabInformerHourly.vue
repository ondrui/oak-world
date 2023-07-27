<template>
  <div class="wrapper">
    <ScrollableModeInformer
      :labelCoordinates="{
        temp: '156px',
        wind: '355px',
        pressure: '409px',
        humidity: '444px',
      }"
      isGrabCursor
    >
      <template #row-caption>
        <RowCaptionInformer class="temp">
          {{ getConstantLocale("climateIndicators", "temp") }} /
          {{ getConstantLocale("currentBlock", "feelsLike") }}
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
      <TabInformerHourlyContent
    /></ScrollableModeInformer>
  </div>
</template>

<script>
import ScrollableModeInformer from "@/components/ScrollableModeInformer.vue";
import TabInformerHourlyContent from "@/components/TabInformerHourlyContent.vue";
import RowCaptionInformer from "@/components/RowCaptionInformer.vue";
import { mapGetters } from "vuex";
import { cityIn } from "lvovich";

export default {
  name: "TabInformerHourly",
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
    const strKeywords = this.getConstantLocale("hourly", "keywords")
      .replace("$_city", inflectCityName)
      .replace("$_country", country);
    return {
      title: this.getConstantLocale("hourly", "title").replace(
        "$_city",
        inflectCityName
      ),
      meta: [
        {
          name: "description",
          content: this.getConstantLocale("hourly", "description").replace(
            "$_city",
            inflectCityName
          ),
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
    TabInformerHourlyContent,
    RowCaptionInformer,
  },
  computed: {
    ...mapGetters([
      "getConstantLocale",
      "getCitySelected",
      "getCountrySelected",
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
