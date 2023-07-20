<template>
  <div class="radio-switcher">
    <input
      v-for="value in radioValues"
      :key="`i-${value[0]}`"
      type="radio"
      name="radios"
      :id="value[0]"
      :value="value[0]"
      @change="radioHandler"
      :checked="isChecked(value[0])"
    />
    <label :for="value[0]" v-for="value in radioValues" :key="`l-${value[0]}`">
      {{ value[1] }}
    </label>
    <span class="highlighter"></span>
  </div>
</template>

<script>
export default {
  name: "SwitcherRadioBtn",
  /**
   * Изменяем входной параметр и событие, используемые для работы
   * v-model.
   */
  model: {
    prop: "checked",
    event: "change",
  },
  props: {
    /**
     * Массив содержит значенме и название радио кнопок в выбранной
     * локали.
     */
    radioValues: {
      type: Array,
    },
    /**
     * Пропс используется для v-model компоненты с родителем.
     */
    checked: {
      type: String,
    },
  },
  methods: {
    /**
     * Используется для указания стилей внешнего вида кнопок при их выборе.
     * @param value - содержит значение атрибута value радиокнопки.
     */
    isChecked(value) {
      return this.checked === value;
    },
    /**
     * Обработчик события для радио кнопок.
     * Отправляет значение атрибута value радиокнопки в родительский компонент.
     * @param e - объект Event.
     */
    radioHandler(e) {
      this.$emit("change", e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
$n: 2;
.radio-switcher {
  position: relative;
  display: inline-flex;
  justify-content: space-around;
  gap: 6px;
  padding: 2px;
  align-items: center;
  background: #ffffff;
  border-radius: 20px;

  & label {
    // padding: 8px 32px;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #04569c;
    text-align: center;
    cursor: pointer;
    border-radius: 8px;
    padding: 5px 28px;
    text-transform: capitalize;
    z-index: 1;
    transition: color 300ms ease-in-out;
  }

  & input[type="radio"] {
    appearance: none;
    margin: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;

    @for $i from 1 through $n {
      &:nth-of-type(#{$i}):checked ~ label:nth-of-type(#{$i}) {
        color: #000000;
        & ~ .highlighter {
          transform: translateX(#{($i - 1) * 100%});
        }
      }
      &:nth-of-type(#{$i}):not(:checked) ~ label:nth-of-type(#{$i}):hover {
        text-decoration: underline;
      }
    }
  }

  & .highlighter {
    position: absolute;
    top: 2px;
    left: 2px;
    width: calc(50% - 2px);
    height: calc(100% - 4px);
    border-radius: 20px;
    background: #f0f7fc;
    transition: transform 300ms cubic-bezier(0, 0.5, 0.5, 1.1);
  }
}
</style>
