import GATE from '../gates'

export default {
  title: '"Mux"',
  alert: 'Level 8. New tool!',
  squares: {
    3: {
      6: { cl: 'ylw-btn-off' },
    },
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
    GATE.MUX,
  ],
  objective: [
    {
      cl: ['ball ylw-off', 'ball pnk-off', 'ball grn-off', 'bulb blu-off'],
      score: null,
      detail: 'When the yellow and pink buttons are off, the blue light should be off',
    },
    {
      cl: ['ball ylw-off', 'ball pnk-off', 'ball grn-on', 'bulb blu-off'],
      score: null,
      detail: 'When the yellow and pink buttons are off, the blue light should be off',
    },
    {
      cl: ['ball ylw-off', 'ball pnk-on', 'ball grn-off', 'bulb blu-on'],
      score: null,
      detail: 'When the yellow button is off and the pink button is on, the blue light should be on',
    },
    {
      cl: ['ball ylw-off', 'ball pnk-on', 'ball grn-on', 'bulb blu-on'],
      score: null,
      detail: 'When the yellow button is off and the pink button is on, the blue light should be on',
    },
    {
      cl: ['ball ylw-on', 'ball pnk-off', 'ball grn-off', 'bulb blu-off'],
      score: null,
      detail: 'When the yellow button is on and the green button is off, the blue light should be off',
    },
    {
      cl: ['ball ylw-on', 'ball pnk-off', 'ball grn-on', 'bulb blu-on'],
      score: null,
      detail: 'When the yellow are green buttons are on, the blue light should be on',
    },
    {
      cl: ['ball ylw-on', 'ball pnk-on', 'ball grn-off', 'bulb blu-off'],
      score: null,
      detail: 'When the yellow button is on and the green button is off, the blue light should be off',
    },
    {
      cl: ['ball ylw-on', 'ball pnk-on', 'ball grn-on', 'bulb blu-on'],
      score: null,
      detail: 'When the yellow are green buttons are on, the blue light should be on',
    },
  ],
  explanation: 'The yellow button chooses which button controls the light.',
}
