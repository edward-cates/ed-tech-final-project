import GATE from '../gates'

export default {
  title: 'Half Adder',
  alert: 'Level 6. New tools!',
  squares: {
    2: {
      2: { cl: 'grn-btn-off' },
      10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    6: {
      2: { cl: 'pnk-btn-off' },
      10: { cl: 'org-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
  },
  tools: [
    GATE.AND,
    GATE.XOR,
  ],
  objective: [
    {
      cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off', 'bulb org-off'],
      score: null,
      detail: 'Pink button off, green button off; blue bulb off',
    },
    {
      cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-on', 'bulb org-off'],
      score: null,
      detail: 'Pink button off, green button on; blue bulb on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-on', 'bulb org-off'],
      score: null,
      detail: 'Pink button on, green button off; blue bulb on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-off', 'bulb org-on'],
      score: null,
      detail: 'Pink button on, green button on; blue bulb off',
    },
  ],
  explanation: 'The bulb should be on when exactly one button is on.',
}
