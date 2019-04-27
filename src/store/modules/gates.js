
const SPLIT = {
  cl: 'split-gate-0',
  create() {
    return {
      cl: 'split-gate-0',
      inputs: [
        { rowDiff: 0, colDiff: -1, isOn: false },
      ],
      outputs: [
        { rowDiff: -1, colDiff: 0, isOn: false },
        { rowDiff: 0, colDiff: 1, isOn: false },
        { rowDiff: 1, colDiff: 0, isOn: false },
      ],
      evaluate() {
        const on = this.inputs[0].isOn ? '1' : '0'
        this.outputs.forEach(out => out.isOn = (on === '1'))
        this.cl = `split-gate-${on}`
      },
    }
  },
  tooltip: 'Each output equals the input',
}

const NOT = {
  cl: 'not-gate-0',
  create() {
    return {
      cl: 'not-gate-0',
      inputs: [
        { rowDiff: 0, colDiff: -1, isOn: false },
      ],
      outputs: [
        { rowDiff: 0, colDiff: 1, isOn: true },
      ],
      evaluate() {
        const isOutOn = this.outputs[0].isOn = !this.inputs[0].isOn
        this.cl = `not-gate-${isOutOn ? '0' : '1'}`
      },
    }
  },
  tooltip: 'The output equals the opposite of the input',
}

const OR = {
  cl: 'or-gate-000',
  create() {
    return {
      cl: 'or-gate-000',
      inputs: [
        { rowDiff: -1, colDiff: 0, isOn: false },
        { rowDiff: 0, colDiff: -1, isOn: false },
        { rowDiff: 1, colDiff: 0, isOn: false },
      ],
      outputs: [
        { rowDiff: 0, colDiff: 1, isOn: false },
      ],
      evaluate() {
        const cl = this.inputs.map(input => input.isOn ? '1' : '0').join('')
        this.outputs[0].isOn = cl.indexOf('1') > -1
        this.cl = `or-gate-${cl}`
      },
    }
  },
  tooltip: 'Output is on if any input is on',
}

const AND = {
  cl: 'and-gate-00',
  create() {
    return {
      cl: 'and-gate-00',
      inputs: [
        { rowDiff: -1, colDiff: 0, isOn: false },
        { rowDiff: 0, colDiff: -1, isOn: false },
      ],
      outputs: [
        { rowDiff: 0, colDiff: 1, isOn: false },
      ],
      evaluate() {
        const cl = this.inputs.map(input => input.isOn ? '1' : '0').join('')
        this.outputs[0].isOn = cl === '11'
        this.cl = `and-gate-${cl}`
      },
    }
  },
  tooltip: 'Output is on if both inputs are on',
}

export default {
  SPLIT,
  NOT,
  OR,
  AND,
}