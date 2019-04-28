import GATE from '../gates'

export default {
  title: '"Half Adder"',
  alert: 'Level 9. New tool!',
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
      detail: 'When both buttons are off, both lights should be off',
    },
    {
      cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-on', 'bulb org-off'],
      score: null,
      detail: 'When only the green button is on, the blue light should be on and the orange light should be off',
    },
    {
      cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-on', 'bulb org-off'],
      score: null,
      detail: 'When only the pink button is on, the blue light should be on and the orange light should be off',
    },
    {
      cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-off', 'bulb org-on'],
      score: null,
      detail: 'When both buttons are on, both lights should be on',
    },
  ],
  explanation: 'The blue light is on if exactly one button is on; the orange light is on if both buttons are on.',
}
