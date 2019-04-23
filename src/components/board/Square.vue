<template>
  <div
    class="square"
    @click.right.prevent="$emit('rightClick')"
    @mousedown.prevent="$emit('mouseDown')"
    @mouseenter="$emit('mouseEnter')"
    @mouseleave="$emit('mouseLeave')"
    @mouseup.stop="$emit('mouseUp')"
  >
    <!-- buttons -->
    <!---- green ---->
    <img v-if="square.cl === 'grn-btn-off'" src="@/assets/img/grn-btn/off/nsew.svg" />
    <img v-else-if="square.cl === 'grn-btn-on'" src="@/assets/img/grn-btn/on/nsew.svg" />
    <!---- pink ---->
    <img v-else-if="square.cl === 'pnk-btn-off'" src="@/assets/img/pnk-btn/off/nsew.svg" />
    <img v-else-if="square.cl === 'pnk-btn-on'" src="@/assets/img/pnk-btn/on/nsew.svg" />

    <!-- lights -->
    <!---- orange ---->
    <img v-else-if="square.cl === 'org-lgt-w-off'" src="@/assets/img/org-lgt/off/w.svg" />
    <img v-else-if="square.cl === 'org-lgt-w-on'" src="@/assets/img/org-lgt/on/w.svg" />
    <!---- blue ---->
    <img v-else-if="square.cl === 'blu-lgt-s-off'" src="@/assets/img/blu-lgt/off/s.svg" />
    <img v-else-if="square.cl === 'blu-lgt-w-off'" src="@/assets/img/blu-lgt/off/w.svg" />
    <img v-else-if="square.cl === 'blu-lgt-s-on'" src="@/assets/img/blu-lgt/on/s.svg" />
    <img v-else-if="square.cl === 'blu-lgt-w-on'" src="@/assets/img/blu-lgt/on/w.svg" />

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
    <!---- split ---->
    <img v-else-if="square.cl === 'split-gate-0'" src="@/assets/img/split-gate/0.png" />
    <img v-else-if="square.cl === 'split-gate-1'" src="@/assets/img/split-gate/1.png" />
    <!---- not ---->
    <img v-else-if="square.cl === 'not-gate-0'" src="@/assets/img/not-gate/0.png" />
    <img v-else-if="square.cl === 'not-gate-1'" src="@/assets/img/not-gate/1.png" />
    <!---- or ---->
    <img v-else-if="square.cl === 'or-gate-000'" src="@/assets/img/or-gate/000.png" />
    <img v-else-if="square.cl === 'or-gate-001'" src="@/assets/img/or-gate/001.png" />
    <img v-else-if="square.cl === 'or-gate-010'" src="@/assets/img/or-gate/010.png" />
    <img v-else-if="square.cl === 'or-gate-011'" src="@/assets/img/or-gate/011.png" />
    <img v-else-if="square.cl === 'or-gate-100'" src="@/assets/img/or-gate/100.png" />
    <img v-else-if="square.cl === 'or-gate-101'" src="@/assets/img/or-gate/101.png" />
    <img v-else-if="square.cl === 'or-gate-110'" src="@/assets/img/or-gate/110.png" />
    <img v-else-if="square.cl === 'or-gate-111'" src="@/assets/img/or-gate/111.png" />
    <!---- and ---->
    <img v-else-if="square.cl === 'and-gate-000'" src="@/assets/img/and-gate/000.png" />
    <img v-else-if="square.cl === 'and-gate-001'" src="@/assets/img/and-gate/001.png" />
    <img v-else-if="square.cl === 'and-gate-010'" src="@/assets/img/and-gate/010.png" />
    <img v-else-if="square.cl === 'and-gate-011'" src="@/assets/img/and-gate/011.png" />
    <img v-else-if="square.cl === 'and-gate-100'" src="@/assets/img/and-gate/100.png" />
    <img v-else-if="square.cl === 'and-gate-101'" src="@/assets/img/and-gate/101.png" />
    <img v-else-if="square.cl === 'and-gate-110'" src="@/assets/img/and-gate/110.png" />
    <img v-else-if="square.cl === 'and-gate-111'" src="@/assets/img/and-gate/111.png" />

    <!-- text -->
    <img v-else-if="square.txt === 'Click Here'" src="@/assets/img/click-here.png" />
    <img v-else-if="square.txt === 'Drag Slowly'" src="@/assets/img/drag-slowly.png" />
    <img v-else-if="square.txt === 'Release Here'" src="@/assets/img/release-here.png" />

    <!-- blank -->
    <img v-else src="@/assets/img/blank-square.svg" style="visibility: hidden" />

    <div
      v-if="square.text"
      class="text"
    >
      {{ square.text }}
    </div>

    <div
      class="tooltip"
      v-if="tooltip">
      {{ tooltip }}
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Square',
  props: {
    square: {},
    tooltip: {},
  },
}
</script>
