import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const headingElement = screen.getByText(/halstead metrics calculator/i);
  expect(headingElement).toBeInTheDocument();
});
