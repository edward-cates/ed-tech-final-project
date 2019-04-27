import GATE from '../gates'

export default {
  title: '"Xor"',
  alert: 'Level 6. New tools!',
  squares: {
    2: {
      2: { cl: 'grn-btn-off' },
    },
    4: {
      10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    6: {
      2: { cl: 'pnk-btn-off' },
    },
  },
  tools: [
    GATE.NOT,
    GATE.OR,
    GATE.SPLIT,
    GATE.AND,
  ],
  objective: [
    {
      cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off'],
      score: null,
      detail: 'Pink button off, green button off; blue bulb off',
    },
    {
      cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-on'],
      score: null,
      detail: 'Pink button off, green button on; blue bulb on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-on'],
      score: null,
      detail: 'Pink button on, green button off; blue bulb on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-off'],
      score: null,
      detail: 'Pink button on, green button on; blue bulb off',
    },
  ],
  explanation: 'The bulb should be on when exactly one button is on.',
}
