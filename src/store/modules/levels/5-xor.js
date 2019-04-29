import GATE from '../gates'

export default {
  title: '"Xor"',
  alert: 'Level 5. New tool!',
  squares: {
    4: {
      2: { cl: 'grn-btn-off' },
    },
    6: {
      10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    8: {
      2: { cl: 'pnk-btn-off' },
    },
  },
  tools: [
    GATE.NOT,
    GATE.OR,
    GATE.AND,
  ],
  objective: [
    {
      cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off'],
      score: null,
      detail: 'When both buttons are off, the blue light should be off',
    },
    {
      cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-on'],
      score: null,
      detail: 'When only the green button is on, the blue light should be on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-on'],
      score: null,
      detail: 'When only the pink button is on, the blue light should be on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-off'],
      score: null,
      detail: 'When both buttons are on, the blue light should be off',
    },
  ],
  explanation: 'The light should be on when exactly one button is on.',
}
