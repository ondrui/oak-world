<template>
  <div class="scrolltop-wrap" v-resize:debounce.100="calcSize">
    <router-link to="#top" class="top-of-site-link">
      <BaseIcon width="10" nameIcon="chevron-scroll-left" pick="common" />
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewportHeight: "",
    };
  },
  mounted() {
    this.calcSize();
  },
  methods: {
    calcSize() {
      this.viewportHeight = `${window.innerHeight}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
// Для решения проблемы height: 100vh в мобильных браузерах
// задействуем VResize кастомную директиву периодического пересчета высоты
// окна браузера при изменении его размеров.
// Высоту окна передаем в CSS для установки вертикальной позиции кнопки со
// стрелкой вверх.
$view-height: v-bind(viewportHeight);

.scrolltop-wrap {
  position: absolute;
  top: 104vh;
  right: 16vw;
  bottom: -4px;
  pointer-events: none;
  backface-visibility: hidden;
}
.top-of-site-link {
  position: fixed;
  position: -webkit-sticky;
  position: sticky;
  top: calc(#{$view-height} - 5rem);
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  pointer-events: auto;
  background-color: #ffffff;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.21);
  border-radius: 50px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  touch-action: manipulation;
  transition: all 0.3s;
  & svg {
    transform: rotate(90deg);
  }
}
@media (hover: hover) and (pointer: fine) {
  .top-of-site-link:hover {
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.36);
  }
  .top-of-site-link:active {
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.45);
  }
}
@media only screen and (max-width: $media-width-xl) {
  .scrolltop-wrap {
    right: 12vw;
  }
}
@media only screen and (max-width: $media-width-lg) {
  .scrolltop-wrap {
    right: 10vw;
  }
}
</style>
