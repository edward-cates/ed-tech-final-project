<template>
  <div
    class="square"
    @mousedown="mouseDown"
    @mouseenter="$emit('mouseEnter')"
    @mouseleave="$emit('mouseLeave')"
    @mouseup="$emit('mouseUp')"
  >
    <!-- buttons -->
    <img v-if="square.cl === 'grn-btn-off'" src="@/assets/img/grn-btn/off/nsew.svg" />
    <img v-else-if="square.cl === 'grn-btn-on'" src="@/assets/img/grn-btn/on/nsew.svg" />

    <!-- lights -->
    <!---- off ---->
    <img v-else-if="square.cl === 'org-lgt-w-off'" src="@/assets/img/org-lgt/off/w.svg" />
    <!---- on ---->
    <img v-else-if="square.cl === 'org-lgt-w-on'" src="@/assets/img/org-lgt/on/w.svg" />

    <!-- wires -->
    <!---- off ---->
    <img v-else-if="square.cl === 'wire-ne-off'" src="@/assets/img/wire/off/ne.svg" />
    <img v-else-if="square.cl === 'wire-ns-off'" src="@/assets/img/wire/off/ns.svg" />
    <img v-else-if="square.cl === 'wire-nw-off'" src="@/assets/img/wire/off/nw.svg" />
    <img v-else-if="square.cl === 'wire-se-off'" src="@/assets/img/wire/off/se.svg" />
    <img v-else-if="square.cl === 'wire-sw-off'" src="@/assets/img/wire/off/sw.svg" />
    <img v-else-if="square.cl === 'wire-ew-off'" src="@/assets/img/wire/off/ew.svg" />
    <!---- on ---->
    <img v-else-if="square.cl === 'wire-ne-on'" src="@/assets/img/wire/on/ne.svg" />
    <img v-else-if="square.cl === 'wire-ns-on'" src="@/assets/img/wire/on/ns.svg" />
    <img v-else-if="square.cl === 'wire-nw-on'" src="@/assets/img/wire/on/nw.svg" />
    <img v-else-if="square.cl === 'wire-se-on'" src="@/assets/img/wire/on/se.svg" />
    <img v-else-if="square.cl === 'wire-sw-on'" src="@/assets/img/wire/on/sw.svg" />
    <img v-else-if="square.cl === 'wire-ew-on'" src="@/assets/img/wire/on/ew.svg" />
    <!---- cross ---->
    <img v-else-if="square.cl === 'wire-nsew-vert-off-horiz-off'" src="@/assets/img/wire/off/nsew.svg" />
    <img v-else-if="square.cl === 'wire-nsew-vert-off-horiz-on'" src="@/assets/img/wire/on/nsew-horiz.svg" />
    <img v-else-if="square.cl === 'wire-nsew-vert-on-horiz-off'" src="@/assets/img/wire/on/nsew-vert.svg" />
    <img v-else-if="square.cl === 'wire-nsew-vert-on-horiz-on'" src="@/assets/img/wire/on/nsew-both.svg" />

    <!-- gates -->
    <img v-else-if="square.cl === 'not-gate-0'" src="@/assets/img/not-gate/0.png" />
    <img v-else-if="square.cl === 'not-gate-1'" src="@/assets/img/not-gate/1.png" />

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
  },
}
</script>
