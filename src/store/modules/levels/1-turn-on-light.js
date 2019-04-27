export default {
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
}
