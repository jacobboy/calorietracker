import * as React from 'react';

interface Props {
  id: string;
  amount: number;
  onChange: (input: number) => void;
}

interface State {
  input: string;
}

export class MathInput extends React.Component<Props, State> {
  // TODO parens creates Unexpected EOF errors in the eval
  // not sure why e.g. `15*` wouldn't
  /* OPERATIONS = new Set(['(', ')', '*', '-', '+', '.']); */
  OPERATIONS = new Set(['*', '-', '+', '.']);
  NUMBERS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

  constructor(props: Props) {
    super(props);
    this.state = {
      input: this.props.amount.toString()
    };
  }

  isMath(input: string) {
    const itIs = input
      .split('')
      .map(char => this.OPERATIONS.has(char) || this.NUMBERS.has(char))
      .every(bool => bool);
    return itIs;
  }

  doMath(value: string) {
    /*     try {
      // ensure it's raw math before eval */
    if (this.isMath(value) && this.NUMBERS.has(value[value.length - 1])) {
      // tslint:disable-next-line:no-eval
      return eval(value);
    }
    /*     } catch (err) {
      console.log(err);
      return undefined;
    } */
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (this.isMath(val)) {
      this.setState({
        input: val
      });
      const input = this.doMath(val);
      if (input) {
        this.props.onChange(input);
      }
    }
  }

  handleBlur() {
    this.setState({input: this.props.amount.toString()});
    this.props.onChange(this.props.amount);
  }

  render() {
    /* const value =
      this.props.amountOverride !== undefined
        ? this.props.amountOverride
        : this.state.input; */
    return (
      <input
        id={this.props.id}
        type="text"
        value={this.state.input}
        onChange={e => this.handleChange(e)}
        onBlur={e => this.handleBlur()}
      />
    );
  }
}
