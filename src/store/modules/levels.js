import GATE from './gates'

export default [
  {
    title: 'Turn on light',
    squares: {
      2: {
        7: { cl: 'blu-lgt-s-off', conn: { rowDiff: 1, colDiff: 0 } },
      },
      5: {
        2: { cl: 'pnk-btn-off' },
      },
    },
    tools: [
      GATE.NOT,
    ],
    objective: [
      { cl: ['ball pnk-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-on', 'bulb blu-on'], score: null },
    ],
  },
  {
    title: 'Invert signal',
    squares: {
      2: {
        7: { cl: 'blu-lgt-s-off', conn: { rowDiff: 1, colDiff: 0 } },
      },
      5: {
        2: { cl: 'pnk-btn-off' },
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
    title: '"Or"',
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
      GATE.OR,
    ],
    objective: [
      { cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-on'], score: null },
      { cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-on'], score: null },
      { cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-on'], score: null },
    ],
  },
  {
    title: '"And"',
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
      GATE.NOT,
      GATE.OR,
    ],
    objective: [
      { cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-on'], score: null },
    ],
  },
]
