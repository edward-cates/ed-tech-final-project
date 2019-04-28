import GATE from '../gates'

export default {
  title: '"And"',
  alert: 'Level 4. No new tools this time, just the old ones.',
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
      detail: 'When both buttons are off, the blue light should be off.',
    },
    {
      cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-off'],
      score: null,
      detail: 'When only the green button is on, the blue light should off.',
    },
    {
      cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-off'],
      score: null,
      detail: 'When only the pink button is on, the blue light should be off.',
    },
    {
      cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-on'],
      score: null,
      detail: 'When both buttons are on, the blue light should be on.',
    },
  ],
  explanation: 'The light should only be on when both buttons are on.',
}
