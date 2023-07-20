<template>
  <div class="container">
    <div v-show="isButtons" class="scroll-button-container">
      <button :class="['btn', { hidden: side.left }]" @click="scroll('left')">
        <BaseIcon width="7" nameIcon="chevron-scroll-left" pick="common" />
      </button>
      <button :class="['btn', { hidden: side.right }]" @click="scroll('right')">
        <BaseIcon width="7" nameIcon="chevron-scroll-right" pick="common" />
      </button>
    </div>
    <slot name="row-caption"></slot>
    <DragScrolling
      ref="wrapper-content"
      class="wrapper-content"
      v-resize:debounce.100="resizeBrowserHandler"
      ><slot />
    </DragScrolling>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DragScrolling from "./DragScrolling.vue";

export default {
  components: {
    DragScrolling,
  },
  props: {
    /**
     * Пропс получает координату Y подписей параметров на графике.
     */
    labelCoordinates: {
      type: Object,
      required: true,
    },
    isGrabCursor: {
      type: Boolean,
    },
  },
  data() {
    return {
      /**
       * Вспомогательные свойства помогают определить условия
       * показа/скрытия кнопок скролла графика.
       */
      clientWidth: 0,
      // Полная внутренняя ширина, включая прокрученную область.
      scrollWidth: 0,
      firstItem: null,
      lastItem: null,
      /**
       * Отвечает за скрытие кнопок скролла графика.
       */
      side: {
        left: true,
        right: false,
      },
      /**
       * Объект-наблюдатель за пересечением элемента который содержит график с боковыми
       * границами графика.
       */
      observer: null,
    };
  },
  mounted() {
    this.elemNameScroll = "wrapper-content";
    /**
     * Создаем объект-наблюдатель и задаем целевые наблюдаемые элементы.
     */
    this.observer = new IntersectionObserver(this.observerCallback, {
      root: this.$refs[this.elemNameScroll].$el,
      threshold: 0.99,
    });
    const coolElement = document.querySelectorAll(".item");
    this.firstItem = [...coolElement][0];
    this.lastItem = [...coolElement].at(-1);
    this.observer.observe(this.firstItem);
    this.observer.observe(this.lastItem);
    /**
     * После монтирования компоненты вызываем функцию обработчик, которая
     * отвечает за вычисление и установку следующих значений поля data:
     * width и height.
     */
    this.resizeBrowserHandler();
  },
  beforeDestroy() {
    /**
     * Отключаем объект-наблюдатель.
     */
    this.observer.disconnect();
  },
  computed: {
    ...mapGetters(["getConstantLocale"]),
    isButtons() {
      return this.scrollWidth > this.clientWidth;
    },
  },
  methods: {
    /**
     * Колбэк-функция вызывается при пересечении элемента, который содержит
     * график с боковыми границами графика.
     * @param entry Объект описывает пересечение между целевым элементом
     * и его корневым контейнером в определенный момент перехода.
     */
    observerCallback([entry]) {
      if (entry.isIntersecting && entry.target === this.firstItem) {
        this.side.left = true;
      } else if (!entry.isIntersecting && entry.target === this.lastItem) {
        this.side.right = false;
      } else if (entry.isIntersecting && entry.target === this.lastItem) {
        this.side.right = true;
      } else {
        this.side.left = false;
        this.side.right = false;
      }
    },
    /**
     * Возвращает количество пикселей, на которое необходимо прокрутить график.
     */
    scrollSize() {
      return this.firstItem.clientWidth * 3;
    },
    /**
     * Функция отвечает за прокручивание графика.
     * @param direction В параметр передается строка со стороной,
     * в которую нужно сдвинуть график.
     */
    scroll(direction) {
      const num = this.scrollSize();
      this.$refs[this.elemNameScroll].$el.scrollBy({
        left: direction === "right" ? num : -num,
        behavior: "smooth",
      });
    },
    /**
     * Функция обработчик вызывается, когда изменяется размер окна страницы.
     */
    resizeBrowserHandler() {
      /**
       * Определяет и устанавливает требуемые свойства прокручиваего элемента.
       */
      const elem = this.$refs[this.elemNameScroll].$el;
      this.clientWidth = Math.round(elem.clientWidth);
      this.scrollWidth = Math.round(elem.scrollWidth);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #d8e9f3;
}
.scroll-button-container {
  position: absolute;
  top: calc(50% - 18px);
  left: 18px;
  width: calc(100% - 36px);
  display: flex;
  justify-content: space-between;
  & .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
    visibility: visible;
    pointer-events: auto;
    background-color: rgba(29, 125, 188, 0.08);
    border: none;
    border-radius: 50px;
    cursor: pointer;
    width: 36px;
    height: 36px;
    touch-action: manipulation;
    transition: all 0.5s;

    & svg {
      transition: transform 0.5s;
    }

    &:hover {
      background-color: rgba(29, 125, 188, 0.16);

      & svg {
        transform: scale(1.4);
      }
    }

    &:active {
      background-color: rgba(29, 125, 188, 0.24);
    }

    &.hidden {
      visibility: hidden;
      opacity: 0;
      cursor: auto;
      transition: all 0.5s;
    }
  }
}
.temp {
  top: v-bind("labelCoordinates.temp");
}
.wind {
  top: v-bind("labelCoordinates.wind");
}
.pressure {
  top: v-bind("labelCoordinates.pressure");
}
.humidity {
  top: v-bind("labelCoordinates.humidity");
}
.wrapper-content {
  display: flex;
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  position: relative;
}
.grab {
  cursor: grab;
  &.grabbing {
    cursor: grabbing;
  }
}
</style>
