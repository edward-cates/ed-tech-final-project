const NOT = {
  cl: 'not-gate-0',
  inputs: [
    { rowDiff: 0, colDiff: -1, isOn: false },
  ],
  outputs: [
    { rowDiff: 0, colDiff: 1, isOn: true },
  ],
  evaluate: function evaluate() {
    const isOutOn = this.outputs[0].isOn = !this.inputs[0].isOn
    this.cl = `not-gate-${isOutOn ? '0' : '1'}`
  },
}

const OR = {
  cl: 'or-gate-000',
  inputs: [
    { rowDiff: -1, colDiff: 0, isOn: false },
    { rowDiff: 0, colDiff: -1, isOn: false },
    { rowDiff: 1, colDiff: 0, isOn: false },
  ],
  outputs: [
    { rowDiff: 0, colDiff: 1, isOn: false },
  ],
  evaluate: function evaluate() {
    const cl = this.inputs.map(input => input.isOn ? '1' : '0').join('')
    this.outputs[0].isOn = cl.indexOf('1') > -1
    this.cl = `or-gate-${cl}`
  },
}

export default {
  NOT,
  OR,
}