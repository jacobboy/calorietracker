import * as React from 'react';

interface Props {
  id?: string;
  amountOverride?: string;
  onChange: (input: number) => void;
}

interface State {
  input: string;
  amountModified: boolean;
}

export class MathInput extends React.Component<Props, State> {
  OPERATIONS = new Set(['*', '-', '+', '.']);
  NUMBERS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

  constructor(props: Props) {
    super(props);
    this.state = {
      input: '',
      amountModified: false
    };
  }

  isMath(value: string) {
    const itIs = value
      .split('')
      .map(char => this.OPERATIONS.has(char) || this.NUMBERS.has(char))
      .every(bool => bool);
    console.log(`isMath: ${itIs}`);
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
    console.log(`handling change ${val}`);
    if (this.isMath(val)) {
      this.setState({
        input: val,
        amountModified: true
      });
      const input = this.doMath(val);
      if (input) {
        this.props.onChange(input);
      }
    }
  }

  render() {
    const props = { id: this.props.id };
    return (
      <input
        {...props}
        type="text"
        value={
          this.props.amountOverride !== undefined
            ? this.props.amountOverride
            : this.state.input
        }
        onChange={e => this.handleChange(e)}
      />
    );
  }
}
