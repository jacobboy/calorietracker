import * as React from 'react';
import { SearchListItem } from '../ndbapi/classes';

interface ItemComponentProps {
  key: string;
  item: SearchListItem;
  onDetailsClick: (ndbno: string) => void;
  onTrackClick: (ndbno: string) => void;
}

interface ItemComponentState { }

export class ItemComponent extends React.Component<
  ItemComponentProps, ItemComponentState
  > {

  constructor(props: ItemComponentProps) {
    super(props);
  }

  handleDetailsClick() {
    this.props.onDetailsClick(this.props.item.ndbno);
  }

  handleTrackClick() {
    this.props.onTrackClick(this.props.item.ndbno);
  }

  render() {
    return (
      <tr>
        <td>{this.props.item.name}</td>
        <td>
          <button onClick={() => this.handleDetailsClick()}>
            Details
          </button>
        </td>
        <td>
          <button onClick={() => this.handleTrackClick()}>
            Track
          </button>
        </td>
      </tr >
    );
  }
}
