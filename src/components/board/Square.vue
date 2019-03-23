<template>
  <div
    :class="clss"
  >
    <img
      v-if="isGrnPwr"
      src="@/assets/img/grn-pwr-btn.svg"
    />

    <img
      v-else
      src="@/assets/img/blank-square.svg"
      style="visibility: hidden"
    />
  </div>
</template>

<script>
export default {
  name: 'Square',
  props: {
    isCenter: {
      type: Boolean,
      required: true,
    },
    label: {},
    type: {},
  },
  computed: {
    clss() {
      if (this.isCenter) {
        return 'square square-center'
      }
      return 'square'
    },
    isGrnPwr() {
      return this.type === 1
    },
  },
}
</script>
