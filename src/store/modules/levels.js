import GATE from './gates'

export default [
  {
    title: 'Turn on light',
    alert: 'Level 1. Pass the Objective to complete the level.',
    squares: {
      4: {
        9: { txt: 'Release Here' },
        10: { cl: 'blu-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
      },
      5: {
        6: { txt: 'Drag Slowly' },
      },
      6: {
        2: { cl: 'pnk-btn-off' },
        3: { txt: 'Click Here' },
      },
    },
    tools: [
    ],
    objective: [
      {
        cl: ['ball pnk-off', 'bulb blu-off'],
        score: null,
        detail: 'When the pink button is off, the blue bulb should be off.',
      },
      {
        cl: ['ball pnk-on', 'bulb blu-on'],
        score: null,
        detail: 'When the pink button is on, the blue bulb should be on.',
      },
    ],
    explanation: 'The button should power on the bulb.',
  },
  {
    title: 'Invert signal',
    alert: 'Level 2. There is a new tool in your toolbox.',
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
    alert: 'Level 3. There is a new tool in your toolbox.',
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
    alert: 'Level 4. No new tools this time.',
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
    alert: 'Level 5. New tools!',
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
