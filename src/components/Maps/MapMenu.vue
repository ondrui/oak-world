<template>
  <ul class="menu">
    <li
      v-for="(item, index) in menuItemName"
      :key="`i-${index}`"
      :class="{ active: isActive(item[0]) }"
    >
      <button @click="select(item[0])">
        <span :data-text="item[1]">
          {{ item[1] }}
        </span>
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    /**
     * Массив для отрисовки списка с кнопками и названиями
     * кнопок на выбранном языке.
     */
    menuItemName: {
      type: Array,
      required: true,
    },
    /**
     * Выбранный пункт списка.
     */
    selected: {
      type: String,
      required: true,
    },
  },
  methods: {
    /**
     * Подсвечиваем выбранный пункт item.
     */
    isActive(item) {
      return this.selected === item;
    },
    /**
     * Передаем выбранный пункт списка item в родительский компонент.
     */
    select(item) {
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  column-gap: 16px;
  & li {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    &.active {
      & span {
        font-weight: 500;
        font-size: 13px;
        line-height: 15px;
        color: #04569c;
      }
      &::after {
        opacity: 0.8;
        background-color: #04569c;
      }
    }
    &::after {
      position: absolute;
      content: "";
      display: inline-block;
      width: 100%;
      height: 2px;
      border-radius: 1px;
      background-color: #8e9fb4;
      opacity: 0;
      bottom: -5px;
      left: 0;
      transition: 200ms all ease-in-out;
    }
    & button {
      border: none;
      background-color: transparent;
      padding: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      & span {
        font-weight: 400;
        font-size: 13px;
        line-height: 15px;
        color: #8e9fb4;
        text-transform: capitalize;
        transition: 200ms all ease-in-out;
        &::before {
          display: block;
          content: attr(data-text);
          content: attr(data-text) / "";
          height: 0;
          visibility: hidden;
          overflow: hidden;
          user-select: none;
          pointer-events: none;
          font-weight: 700;
          font-size: 13px;
          line-height: 15px;
        }
      }
    }
    &:not(.active):hover {
      & span {
        font-weight: 500;
        color: #8e9fb4;
      }
      &::after {
        opacity: 0.8;
      }
    }
  }
}
</style>
