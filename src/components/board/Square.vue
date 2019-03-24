<template>
  <div
    :class="clss"
  >
    <img
      v-if="type.cl === 'grn-btn'"
      src="@/assets/img/grn-btn/on/nesw.svg"
    />

    <img
      v-else-if="type.cl === 'org-lgt'"
      src="@/assets/img/org-lgt/on/w.svg"
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
  },
}
</script>
