import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('Should redirect to board games list', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Board/i);
  expect(linkElement).toBeInTheDocument();
});
