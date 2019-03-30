<template>
  <div
    class="square"
    @mousedown="mouseDown"
    @mouseenter="$emit('mouseEnter')"
    @mouseup="mouseUp"
  >
    <!-- buttons -->
    <img v-if="square.cl === 'grn-btn-off'" src="@/assets/img/grn-btn/off/nsew.svg" />
    <img v-else-if="square.cl === 'grn-btn-on'" src="@/assets/img/grn-btn/on/nsew.svg" />

    <!-- lights -->
    <img v-else-if="square.cl === 'org-lgt'" src="@/assets/img/org-lgt/on/w.svg" />

    <!-- wires -->
    <!---- off ---->
    <img v-else-if="square.cl === 'wire-ne-off'" src="@/assets/img/wire/off/ne.svg" />
    <img v-else-if="square.cl === 'wire-ns-off'" src="@/assets/img/wire/off/ns.svg" />
    <img v-else-if="square.cl === 'wire-nw-off'" src="@/assets/img/wire/off/nw.svg" />
    <img v-else-if="square.cl === 'wire-se-off'" src="@/assets/img/wire/off/se.svg" />
    <img v-else-if="square.cl === 'wire-sw-off'" src="@/assets/img/wire/off/sw.svg" />
    <img v-else-if="square.cl === 'wire-ew-off'" src="@/assets/img/wire/off/ew.svg" />
    <img v-else-if="square.cl === 'wire-nsew-off'" src="@/assets/img/wire/off/nsew.svg" />
    <!---- on ---->
    <img v-else-if="square.cl === 'wire-ne-on'" src="@/assets/img/wire/on/ne.svg" />
    <img v-else-if="square.cl === 'wire-ns-on'" src="@/assets/img/wire/on/ns.svg" />
    <img v-else-if="square.cl === 'wire-nw-on'" src="@/assets/img/wire/on/nw.svg" />
    <img v-else-if="square.cl === 'wire-se-on'" src="@/assets/img/wire/on/se.svg" />
    <img v-else-if="square.cl === 'wire-sw-on'" src="@/assets/img/wire/on/sw.svg" />
    <img v-else-if="square.cl === 'wire-ew-on'" src="@/assets/img/wire/on/ew.svg" />
    <!-- <img v-else-if="square.cl === 'wire-nsew-on'" src="@/assets/img/wire/on/nsew.svg" /> -->

    <!-- blank -->
    <img v-else src="@/assets/img/blank-square.svg" style="visibility: hidden" />
  </div>
</template>

<script>
export default {
  name: 'Square',
  props: {
    label: {},
    square: {},
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
