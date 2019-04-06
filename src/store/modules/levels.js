import GATE from './gates'

export default [
  {
    squares: {
      2: {
        3: { cl: 'pnk-btn-off' },
        9: { cl: 'blu-lgt-s-off', conn: { rowDiff: 1, colDiff: 0 } },
      },
    },
    tools: [],
    objective: [
      { cl: ['ball pnk-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-on', 'bulb blu-on'], score: null },
    ],
  },
  {
    squares: {
      2: {
        3: { cl: 'pnk-btn-off' },
        9: { cl: 'blu-lgt-s-off', conn: { rowDiff: 1, colDiff: 0 } },
      },
    },
    tools: [
      GATE.NOT,
    ],
    objective: [
      { cl: ['ball pnk-off', 'bulb blu-on'], score: null },
      { cl: ['ball pnk-on', 'bulb blu-off'], score: null },
    ],
  },
  {
    squares: {
      2: {
        7: { cl: 'blu-lgt-s-off', conn: { rowDiff: 1, colDiff: 0 } },
      },
      5: {
        2: { cl: 'pnk-btn-off' },
        5: { cl: 'grn-btn-off' },
      },
    },
    tools: [
      GATE.SPLIT,
      GATE.NOT,
      GATE.OR,
      GATE.AND,
    ],
    objective: [
      { cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-on'], score: null },
    ],
  },
]
