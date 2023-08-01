<template>
  <div class="pulse skeleton">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "TheSkeleton",
};
</script>

<style lang="scss" scoped>
.pulse {
  animation: pulse 1.5s ease-in-out 0.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
.skeleton {
  display: flex;
  flex-direction: column;
  column-gap: 10px;
  width: 100%;
  height: 100%;
  & div {
    flex: 1;
    // width: 40px;
    // height: 40px;
    background-color: #c4c4c4;
  }
}
</style>
