import { SearchListItem } from '../classes';
import * as React from 'react';

interface ItemComponentProps {
  key: string;
  item: SearchListItem;
  onDetailsClick: (ndbno: string) => void;
  onTrackClick: (ndbno: string) => void;
}

export function ItemComponent(props: ItemComponentProps) {
  return (
    <tr>
      <td>{props.item.name}</td>
      <td><button onClick={() => props.onDetailsClick(props.item.ndbno)}>Details</button></td>
      <td><button onClick={() => props.onTrackClick(props.item.ndbno)}>Track</button></td>
    </tr>
  );
}
