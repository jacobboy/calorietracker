import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { server } from "./test/mockServer";

beforeAll(() => {
      server.listen(
          {
            onUnhandledRequest: (req) => {
              throw Error(`unhandled request to ${req.url}`)
            }
          }
      )
    }
);


test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
