import GATE from './gates'

export default [
  {
    title: 'Turn on light',
    squares: {
      4: {
        9: { txt: 'Release Here' },
        10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
      },
      6: {
        2: { cl: 'pnk-btn-off' },
        3: { txt: 'Click Here' },
      },
    },
    tools: [
    ],
    objective: [
      { cl: ['ball pnk-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-on', 'bulb blu-on'], score: null },
    ],
    explanation: 'The button should power on the bulb.',
  },
  {
    title: 'Invert signal',
    squares: {
      4: {
        10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
      },
      6: {
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
    explanation: 'When the button is off, the bulb should be on. When the button is on, the bulb should be off.',
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
      GATE.NOT,
      GATE.OR,
    ],
    objective: [
      { cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-on'], score: null },
      { cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-on'], score: null },
      { cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-on'], score: null },
    ],
    explanation: 'The bulb should be on if either button is on.',
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
    explanation: 'The bulb should be on only when both buttons are on.',
  },
  {
    title: '"Xor"',
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
      GATE.SPLIT,
      GATE.AND,
    ],
    objective: [
      { cl: ['ball pnk-off', 'ball grn-off', 'bulb blu-off'], score: null },
      { cl: ['ball pnk-off', 'ball grn-on', 'bulb blu-on'], score: null },
      { cl: ['ball pnk-on', 'ball grn-off', 'bulb blu-on'], score: null },
      { cl: ['ball pnk-on', 'ball grn-on', 'bulb blu-off'], score: null },
    ],
    explanation: 'The bulb should be on when exactly one button is on.',
  },
]
