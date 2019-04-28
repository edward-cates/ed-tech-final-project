import GATE from '../gates'

export default {
  title: 'Invert signal',
  alert: 'Level 2. Check the toolbox',
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
      detail: 'When the pink button is off, the blue light should be on.',
    },
    {
      cl: ['ball pnk-on', 'bulb blu-off'],
      score: null,
      detail: 'When the pink button is on, the blue light should be off.',
    },
  ],
  explanation: 'The light should be off when the button is on and vice versa.',
}
