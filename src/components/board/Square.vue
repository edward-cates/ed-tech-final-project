<template>
  <div
    :class="clss"
    @mousedown="mouseDown"
    @mouseenter="$emit('mouseEnter')"
    @mouseup="mouseUp"
  >
    <img
      v-if="square.cl === 'grn-btn'"
      src="@/assets/img/grn-btn/off/nsew.svg"
    />

    <img
      v-else-if="square.cl === 'org-lgt'"
      src="@/assets/img/org-lgt/on/w.svg"
    />

    <img
      v-else-if="square.cl === 'wire-ne'"
      src="@/assets/img/wire/off/ne.svg"
    />

    <img
      v-else-if="square.cl === 'wire-ns'"
      src="@/assets/img/wire/off/ns.svg"
    />

    <img
      v-else-if="square.cl === 'wire-nw'"
      src="@/assets/img/wire/off/nw.svg"
    />

    <img
      v-else-if="square.cl === 'wire-se'"
      src="@/assets/img/wire/off/se.svg"
    />

    <img
      v-else-if="square.cl === 'wire-sw'"
      src="@/assets/img/wire/off/sw.svg"
    />

    <img
      v-else-if="square.cl === 'wire-ew'"
      src="@/assets/img/wire/off/ew.svg"
    />

    <img
      v-else-if="square.cl === 'wire-nsew'"
      src="@/assets/img/wire/off/nsew.svg"
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
    square: {},
  },
  computed: {
    clss() {
      if (this.isCenter) {
        return 'square square-center'
      }
      return 'square'
    },
  },
  methods: {
    mouseDown($ev) {
      $ev.preventDefault()
      this.$emit('mouseDown')
    },
    mouseUp($ev) {
      $ev.preventDefault()
      this.$emit('mouseUp')
    }
  },
}
</script>
