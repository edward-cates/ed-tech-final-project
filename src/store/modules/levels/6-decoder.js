import GATE from '../gates'

export default {
  title: '"Decoder"',
  alert: 'Level 6. Pretty lights',
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
      detail: 'When both buttons are off, only the red light should be on',
    },
    {
      cl: ['ball pnk-off', 'ball grn-on', 'bulb red-off', 'bulb blu-on', 'bulb org-off', 'bulb pur-off'],
      score: null,
      detail: 'When only the green button is on, only the blue light should be on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-off', 'bulb red-off', 'bulb blu-off', 'bulb org-on', 'bulb pur-off'],
      score: null,
      detail: 'When only the pink button is on, only the orange light should be on',
    },
    {
      cl: ['ball pnk-on', 'ball grn-on', 'bulb red-off', 'bulb blu-off', 'bulb org-off', 'bulb pur-on'],
      score: null,
      detail: 'When both buttons are on, only the purple light should be on',
    },
  ],
  explanation: 'Use the buttons to select which light is lit.',
}
