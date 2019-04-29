import GATE from '../gates'

export default {
  title: '"Full Adder"',
  alert: 'Level 10. New tool!',
  squares: {
    3: {
      6: { cl: 'ylw-btn-off' },
    },
    4: {
      2: { cl: 'grn-btn-off' },
      10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    8: {
      2: { cl: 'pnk-btn-off' },
      10: { cl: 'org-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
  },
  tools: [
    GATE.OR,
    GATE.ADD,
  ],
  objective: [
    {
      cl: ['ball ylw-off', 'ball pnk-off', 'ball grn-off', 'bulb blu-off', 'bulb org-off'],
      score: null,
      detail: 'When all buttons are off, both lights should be off',
    },
    {
      cl: ['ball ylw-off', 'ball pnk-off', 'ball grn-on', 'bulb blu-on', 'bulb org-off'],
      score: null,
      detail: 'When only the green button is on, only the blue light should be on',
    },
    {
      cl: ['ball ylw-off', 'ball pnk-on', 'ball grn-off', 'bulb blu-on', 'bulb org-off'],
      score: null,
      detail: 'When only the pink button is on, only the blue light should be on',
    },
    {
      cl: ['ball ylw-off', 'ball pnk-on', 'ball grn-on', 'bulb blu-off', 'bulb org-on'],
      score: null,
      detail: 'When only the yellow button is off, only the orange light should be on',
    },
    {
      cl: ['ball ylw-on', 'ball pnk-off', 'ball grn-off', 'bulb blu-on', 'bulb org-off'],
      score: null,
      detail: 'When only the yellow button is on, only the blue light should be on',
    },
    {
      cl: ['ball ylw-on', 'ball pnk-off', 'ball grn-on', 'bulb blu-off', 'bulb org-on'],
      score: null,
      detail: 'When only the pink button is off, only the orange light should be on',
    },
    {
      cl: ['ball ylw-on', 'ball pnk-on', 'ball grn-off', 'bulb blu-off', 'bulb org-on'],
      score: null,
      detail: 'When only the green button is off, only the orange light should be on',
    },
    {
      cl: ['ball ylw-on', 'ball pnk-on', 'ball grn-on', 'bulb blu-on', 'bulb org-on'],
      score: null,
      detail: 'When all buttons are on, all lights should be on',
    },
  ],
  explanation: 'The blue light is on if an odd number of buttons is on; the orange light is on if two or more buttons are on.',
}
