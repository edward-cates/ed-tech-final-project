import GATE from '../gates'

export default {
  title: '"And"',
  alert: 'Level 5. No new tools this time, just the old ones.',
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
  ],
  objective: [
    {
      cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off'],
      score: null,
      detail: 'Pink button off, green button off; blue bulb off.',
    },
    {
      cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-off'],
      score: null,
      detail: 'Pink button off, green button on; blue bulb off.',
    },
    {
      cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-off'],
      score: null,
      detail: 'Pink button on, green button off; blue bulb off.',
    },
    {
      cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-on'],
      score: null,
      detail: 'Pink button on, green button on; blue bulb on.',
    },
  ],
  explanation: 'The bulb should be on only when both buttons are on.',
}
