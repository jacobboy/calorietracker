import * as React from 'react';

export const tableStyle: React.CSSProperties = {
    'borderCollapse': 'collapse',
    'border': '1px solid black'
};

export const tdStyle: React.CSSProperties = {
    'border': '1px solid black',
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
    'whiteSpace': 'nowrap',
    // TODO Is maxWidth valid here?
    // how do i make this a percent?
    'maxWidth': 500
};

export const thStyle: React.CSSProperties = {
    'border': '1px solid black'
};
