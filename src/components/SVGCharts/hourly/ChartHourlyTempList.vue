<template>
  <svg
    :view-box.camel="viewbox"
    ref="svg-temp-hourly"
    class="svg-temp-hourly"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ChartHourlyTempItem
      v-for="(points, index) in dataPoints"
      :key="`ch-${index}`"
      :datasetChart="points"
    />
  </svg>
</template>

<script>
import ChartHourlyTempItem from "./ChartHourlyTempItem.vue";
import { addPlus } from "@/constants/functions";

export default {
  components: {
    ChartHourlyTempItem,
  },
  /**
   * Объект с данными для отображения графика.
   */
  props: { datasets: Object },
  data() {
    return {
      /**
       * Ширина элемента SVG.
       */
      width: 300,
      /**
       * Высота элемента SVG.
       */
      height: 170,
      /**
       * Размер шрифта значения температуры.
       */
      textSizeMax: 16,
      /**
       * Размер шрифта значения ощущаемой температуры.
       */
      textSizeMin: 14,
      /**
       * Радиус окружности точки на графике.
       */
      circleRadius: 3,
      /**
       * Отступ от соседней ячейки.
       */
      marginFromCell: 8,
      /**
       * Отступ текста от графика.
       */
      marginText: 5,
    };
  },
  mounted() {
    this.size();
  },
  watch: {
    /**
     * Следим за изменением данных, которые приходят через пропсы.
     * При их изменении вызываем отработчик, который пересчитывает
     * размеры svg элемента.
     */
    datasets() {
      this.size();
    },
  },
  computed: {
    /**
     * Определяет размеры окна отображения SVG.
     */
    viewbox() {
      return `0 0 ${this.width} ${this.height}`;
    },
    /**
     * Вычисление общего отступа графика от
     * соседних ячеек.
     */
    totalYMargin() {
      return (
        this.textSizeMax +
        this.marginFromCell +
        this.marginText +
        this.circleRadius / 2
      );
    },
    /**
     * Возвращает массив объектов, которые содержат координаты Х У, значения температур для
     * отображения графиков и меток температурных.
     * @example
     *[
     *  { x: 27.35, y: 85, temp: 11, feels_like: 12, textYFeels: 166, textYMax: 149, unit: '°' },
     *  { x: 28, y: 88, temp: 14, feels_like: 17, textYFeels: 180, textYMax: 199, unit: '°' },
     *];
     */
    dataPoints() {
      let max = this.datasets.max;
      let min = this.datasets.min;
      const colCount = this.datasets.data[0].value.length;

      const arr = this.datasets.data.map((item) => {
        let x = this.width / (colCount * 2);

        const dataset = item.value.reduce(
          (total, { temp, feels_like }, index) => {
            if (temp.value !== undefined && temp.value !== null) {
              let x1 = index === 0 ? x : 2 * x * index + x;
              const obj = {
                x: x1,
                y: this.calcY(temp.value, max, min),
                textYMax:
                  this.calcY(temp.value, max, min) -
                  (this.circleRadius + this.marginText + 2),
                textYFeels:
                  this.calcY(temp.value, max, min) +
                  (this.circleRadius + this.textSizeMin + 2),
                temp: addPlus(temp.value),
                feels_like: addPlus(feels_like.value),
                unit: temp.unit,
                feels_like_unit: feels_like.unit,
              };
              total.push(obj);
            }
            return total;
          },
          []
        );
        return { dataset, descr: item.descr };
      });
      return arr;
    },
  },
  methods: {
    /**
     * Переводит принимаемый параметр в координату У элемента svg
     * с учетом текстовой метки и других маржинов.
     * @param temp - Значение температуры.
     * @param max - Максимальное значение.
     * @param min - Минимальное значение.
     */
    calcY(temp, max, min) {
      const y = Math.round(
        ((this.height - 2 * this.totalYMargin) * (max - temp)) / (max - min) +
          this.totalYMargin
      );
      return y;
    },
    /**
     * Находим размеры SVG элемента и записываем их в объект data.
     */
    size() {
      /**
       * Определяет и устанавливает требуемые для отрисовки графика параметры.
       * @param element - строка содержит ключ ссылку $refs на элемент в шаблоне
       * компонента.
       */
      const getWidth = (element) => {
        return Math.round(this.$refs[element].getBoundingClientRect().width);
      };
      const getHeight = (element) => {
        return Math.round(this.$refs[element].getBoundingClientRect().height);
      };
      this.width = getWidth("svg-temp-hourly");
      this.height = getHeight("svg-temp-hourly");
    },
  },
};
</script>

<style lang="scss" scoped>
.svg-temp-hourly {
  display: inline-block;
  fill: none;
  width: 100%;
  height: 170px;
}
</style>
