import { fireEvent, render, screen } from '@testing-library/react';
import List from '@/components/dialog/List';

describe('List Dialog Component', () => {
  const items = [
    { value: 'a', label: 'Item A' },
    { value: 'b', label: 'Item B' },
  ];

  it('renders all items when open', () => {
    render(
      <List
        items={items}
        open={true}
        setOpen={jest.fn()}
        onSelected={jest.fn()}
      />,
    );
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
  });

  it('calls onSelected and setOpen(false) when item is clicked', () => {
    const onSelected = jest.fn();
    const setOpen = jest.fn();
    render(
      <List
        items={items}
        open={true}
        setOpen={setOpen}
        onSelected={onSelected}
      />,
    );
    fireEvent.click(screen.getByText('Item B'));
    expect(onSelected).toHaveBeenCalledWith(items[1]);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('does not render items when open is false', () => {
    render(
      <List
        items={items}
        open={false}
        setOpen={jest.fn()}
        onSelected={jest.fn()}
      />,
    );
    expect(screen.queryByText('Item A')).not.toBeInTheDocument();
    expect(screen.queryByText('Item B')).not.toBeInTheDocument();
  });
});
