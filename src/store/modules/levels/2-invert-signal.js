import GATE from '../gates'

export default {
  title: 'Invert signal',
  alert: 'Level 2. There is a new tool in your toolbox.',
  squares: {
    4: {
      10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    6: {
      2: { cl: 'pnk-btn-off' },
    },
  },
  tools: [
    GATE.NOT,
  ],
  objective: [
    {
      cl: ['ball pnk-off', 'bulb blu-on'],
      score: null,
      detail: 'When the pink button is off, the blue bulb should be on.',
    },
    {
      cl: ['ball pnk-on', 'bulb blu-off'],
      score: null,
      detail: 'When the pink button is on, the blue bulb should be off.',
    },
  ],
  explanation: 'When the button is off, the bulb should be on. When the button is on, the bulb should be off.',
}
