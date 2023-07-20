<template>
  <div v-if="cardMapData.length" class="history">
    <div class="container">
      <h2 class="history-title">
        <span>{{ getHistoryTitle[0] }}&nbsp;</span>{{ getHistoryTitle[1] }}
      </h2>
      <DragScrolling
        :class="[
          'history-list',
          { 'grid-4': cardMapData.length === 4 },
          { 'grid-5': cardMapData.length === 5 },
        ]"
        role="list"
      >
        <div
          v-for="(item, index) in cardMapData"
          :key="`c-${item.name_en}`"
          class="history-item"
        >
          <component
            :itemDataset="item"
            :is="showComponent(index, cardMapData.length)"
          />
        </div>
        <div v-if="cardMapData.length < 2" class="ad"></div>
      </DragScrolling>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CardCityShort from "./CardCityShort.vue";
import CardCityBig from "./CardCityBig.vue";
import CardCityMiddle from "./CardCityMiddle.vue";
import DragScrolling from "./DragScrolling.vue";

export default {
  components: {
    CardCityShort,
    CardCityBig,
    CardCityMiddle,
    DragScrolling,
  },
  computed: {
    /**
     * Возвращает список городов.
     */
    cardMapData() {
      return this.$store.getters.cardMapData.slice(0, 5);
    },
    ...mapGetters(["getConstantLocale"]),
    /**
     * Заголовок блока.
     */
    getHistoryTitle() {
      const arr = this.getConstantLocale("asideHistory").split(" ");
      return [arr[0], arr[1]];
    },
  },
  methods: {
    /**
     * Функция в зависимости от порядкового номера карточки и общего количества
     * карточек задает ей нужный размер.
     */
    showComponent(index, length) {
      if (index === 0) return "CardCityBig";
      if (length < 4) return "CardCityBig";
      if (index === 4 || (index === 3 && length === 5)) return "CardCityShort";
      if (index > 0 && index < 4) return "CardCityMiddle";
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: $width-page-xl;
  margin: 0 auto;
  padding: 0 10px;
  width: 100%;
}
@media only screen and (max-width: $media-width-xl) {
  .container {
    max-width: $width-page-lg;
  }
}
.ad {
  min-width: 300px;
  min-height: 200px;
  background: url("@/assets/images/ad_3.jpg") no-repeat;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.12);
}
.history-title {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #9cabbe;
  margin-bottom: 16px;
  & span {
    color: #000000;
  }
}
.history-list {
  display: flex;
  overflow-x: auto;
  column-gap: 12px;
  margin: -8px;
  padding: 8px;
  margin-top: 8px;
}
.history-item {
  display: flex;
  flex: 1 0 300px;
}
.grid-4 {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(300px, 0.7fr);
  grid-template-rows: repeat(3, 1fr);
  row-gap: 10px;
  .history-item:first-child {
    grid-column: 1 / 2;
    grid-row: 1 / 4;
  }
}
.grid-5 {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) repeat(2, minmax(150px, 0.4fr));
  grid-template-rows: repeat(3, 1fr);
  row-gap: 10px;
  .history-item:first-child {
    grid-column: 1 / 2;
    grid-row: 1 / 4;
  }
  .history-item:nth-child(2),
  .history-item:nth-child(3) {
    grid-column: 2 / 4;
  }
}
</style>
