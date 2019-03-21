<template>
  <div class="board">
    <square
      :key="index"
      v-for="index in squares"
    />
  </div>
</template>

<script>
import Square from './Square'

export default {
  name: 'Board',
  components: {
    Square,
  },
  data() {
    const squares = []

    for (let i = 0; i < 100; ++i) {
      squares[i] = i
    }

    return {
      squares,
    }
  },
}
</script>
