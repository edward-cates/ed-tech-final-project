import GATE from '../gates'

export default {
  title: '"Decoder"',
  alert: 'Level 6. New tools!',
  squares: {
    1: {
      10: { cl: 'red-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    2: {
      2: { cl: 'grn-btn-off' },
    },
    3: {
      10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    5: {
      10: { cl: 'org-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    6: {
      2: { cl: 'pnk-btn-off' },
    },
    7: {
      10: { cl: 'pur-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
  },
  tools: [
    GATE.NOT,
    GATE.OR,
    GATE.AND,
  ],
  objective: [
    {
      cl: ['ball pnk-off', 'ball grn-off', 'bulb red-on', 'bulb blu-off', 'bulb org-off', 'bulb pur-off'],
      score: null,
      detail: 'Pink button off, green button off; blue bulb off',
    },
    {
      cl: ['ball pnk-off', 'ball grn-on', 'bulb red-off', 'bulb blu-on', 'bulb org-off', 'bulb pur-off'],
      score: null,
      detail: 'Pink button off, green button on; blue bulb on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-off', 'bulb red-off', 'bulb blu-off', 'bulb org-on', 'bulb pur-off'],
      score: null,
      detail: 'Pink button on, green button off; blue bulb on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-on', 'bulb red-off', 'bulb blu-off', 'bulb org-off', 'bulb pur-on'],
      score: null,
      detail: 'Pink button on, green button on; blue bulb off',
    },
  ],
  explanation: 'The bulb should be on when exactly one button is on.',
}
