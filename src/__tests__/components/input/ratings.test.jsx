import { fireEvent, render, screen } from '@testing-library/react';
import Ratings from '@/components/input/Ratings';

describe('Ratings Input Component', () => {
  const mockOnChange = jest.fn();

  it('renders the label', () => {
    render(<Ratings label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders the default label from EInputType if no label is provided', () => {
    render(<Ratings />);
    expect(screen.getByText('Ratings')).toBeInTheDocument(); // Assuming EInputType.ratings.label is "Ratings"
  });

  it('renders the correct rating value', () => {
    render(<Ratings value={3} />);
    expect(screen.getByRole('radio', { name: /3 Stars/i })).toBeChecked();
  });

  it('handles onChange correctly', () => {
    render(<Ratings value={2} onChange={mockOnChange} />);
    const thirdStar = screen.getByRole('radio', { name: /3 Stars/i });
    fireEvent.click(thirdStar);
    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('disables the rating input when disabled prop is true', () => {
    render(<Ratings value={3} disabled />);
    const stars = screen.getAllByRole('radio');
    stars.forEach((star) => {
      expect(star).toBeDisabled();
    });
  });
});
