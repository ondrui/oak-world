<template>
  <div>
    <div class="date-info">
      {{ currentBlock.timeText }}
    </div>
    <div class="content">
      <div class="content-left">
        <div>
          <BaseIcon
            :nameIcon="currentBlock.condition"
            pick="light"
            width="49"
          />
        </div>
        <div class="content-left-temp">{{ currentBlock.temp }}</div>
        <div class="content-left-descr">
          <div class="content-left-text">{{ currentBlock.condition_s }}</div>
          <div class="feeling">
            {{ currentBlock.realFeel }}
          </div>
        </div>
      </div>
      <div class="content-right">
        <CurrentBlockItem
          v-for="(value, index) in datasetCurrentBlockItem"
          :key="`cn-${index}`"
          :dataValue="value"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CurrentBlockItem from "./CurrentBlockItem.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    CurrentBlockItem,
  },
  computed: {
    ...mapGetters(["datasetCurrentBlockItem", "currentBlock"]),
  },
};
</script>

<style lang="scss" scoped>
.date-info {
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #9c9c9c;
  margin-bottom: 16px;

  &::first-letter {
    text-transform: capitalize;
  }
}
.content {
  display: flex;
  column-gap: 14px;
  row-gap: 12px;
  flex-wrap: nowrap;
  margin-bottom: 40px;
}
.content-left {
  display: flex;
  align-items: center;

  & .content-left-temp {
    font-weight: 400;
    font-size: 48px;
    line-height: 56px;
    color: #333333;
    padding-left: 8px;
  }

  & .content-left-descr {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    row-gap: 2px;
    width: 160px;
    padding-left: 15px;

    & .content-left-text {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #9c9c9c;
    }

    & .content-left-text::first-letter {
      text-transform: capitalize;
    }

    & .feeling {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #000000;
    }

    & .feeling::first-letter {
      text-transform: capitalize;
    }
  }
}
.content-right {
  display: flex;
  flex: 1;
  column-gap: 8px;
  justify-content: space-between;
  align-items: center;
}

@media only screen and (max-width: $media-width-3xl) {
  .content-right {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 8px 17px;
  }
  .content {
    flex-wrap: wrap;
  }
}
</style>
