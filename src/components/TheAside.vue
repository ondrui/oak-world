<template>
  <aside class="asidebar" v-observe="calcHeightAsidebar">
    <div class="asidebar-sticky">
      <div class="asidebar-ad-1"></div>
      <slot />
      <div class="asidebar-ad-2"></div>
    </div>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      /**
       * Значение свойства содержит высоту блока.
       */
      heightSidebarContent: "",
    };
  },
  mounted() {
    this.calcHeightAsidebar();
  },
  methods: {
    /**
     * Находим высоту блока.
     * Нужно для правильного позиционирования
     * блока при скролле страницы.
     */
    calcHeightAsidebar() {
      const height = document
        .querySelector(".asidebar-sticky")
        .getBoundingClientRect().height;
      this.heightSidebarContent = `${height}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
$height: v-bind(heightSidebarContent);
.asidebar-sticky {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  position: sticky;
  top: calc(90vh - #{$height});
}
.asidebar-ad-1 {
  min-width: 300px;
  min-height: 800px;
  background: url("@/assets/images/ad_1.jpg") no-repeat;
}
.asidebar-ad-2 {
  min-width: 300px;
  min-height: 800px;
  background: url("@/assets/images/ad_2.jpg") no-repeat;
}
</style>
