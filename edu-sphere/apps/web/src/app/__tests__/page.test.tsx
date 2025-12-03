import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../page';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    const heading = screen.getByText('EduSphere');
    expect(heading).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<HomePage />);
    expect(screen.getByText('LMS')).toBeInTheDocument();
    expect(screen.getByText('SMS')).toBeInTheDocument();
    expect(screen.getByText('Cloud')).toBeInTheDocument();
  });
});
