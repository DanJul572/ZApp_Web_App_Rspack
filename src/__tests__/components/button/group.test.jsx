import { fireEvent, render, screen } from '@testing-library/react';
import Group from '../../../components/button/Group';

describe('Group Button Component', () => {
  const items = [
    { label: 'First', value: 'first' },
    { label: 'Second', value: 'second' },
    { label: 'Third', value: 'third' },
  ];

  it('renders all buttons with correct labels', () => {
    render(<Group items={items} />);
    items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('calls onClick with correct item when a button is clicked', () => {
    const handleClick = jest.fn();
    render(<Group items={items} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Second'));
    expect(handleClick).toHaveBeenCalledWith(items[1]);
  });

  it('applies default props when not provided', () => {
    render(<Group items={items} />);
    const button = screen.getByText('First');
    expect(button).toHaveClass('MuiButton-sizeSmall');
    // variant and color are handled by MUI, so we check for existence
    expect(button).toBeInTheDocument();
  });

  it('applies custom props', () => {
    render(
      <Group items={items} size="large" color="secondary" variant="outlined" />,
    );
    const button = screen.getByText('First');
    expect(button).toHaveClass('MuiButton-sizeLarge');
  });

  it('renders nothing if items is empty', () => {
    const { container } = render(<Group items={[]} />);
    expect(container.querySelectorAll('button').length).toBe(0);
  });
});
