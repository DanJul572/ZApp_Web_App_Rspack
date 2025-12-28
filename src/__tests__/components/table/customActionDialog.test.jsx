import { fireEvent, render } from '@testing-library/react';
import RowCustomActionDialog from '@/components/table/CustomActionDialog';

jest.mock('@/components/dialog/List', () => {
  return function MockList({ items, onSelected, open, setOpen }) {
    return (
      <div data-testid="mock-list">
        {open &&
          items.map((item, index) => {
            const key = `action-${index}`;
            return (
              <button
                key={key}
                onClick={() => onSelected(item)}
                data-testid={`action-${index}`}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        <button
          onClick={() => setOpen(false)}
          data-testid="close-button"
          type="button"
        >
          Close
        </button>
      </div>
    );
  };
});

describe('RowCustomActionDialog Table Component', () => {
  const mockOnClickRowCustomAction = jest.fn();
  const mockSetOpenRowCustomActionDialog = jest.fn();
  const defaultProps = {
    onClickRowCustomAction: mockOnClickRowCustomAction,
    openRowCustomActionDialog: true,
    rowClicked: { id: 1, name: 'Test Row' },
    rowCustomAction: [
      { label: 'Edit', value: 'edit' },
      { label: 'Delete', value: 'delete' },
    ],
    setOpenRowCustomActionDialog: mockSetOpenRowCustomActionDialog,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the List component with correct props when open', () => {
    const { getByTestId } = render(<RowCustomActionDialog {...defaultProps} />);
    expect(getByTestId('mock-list')).toBeInTheDocument();
    expect(getByTestId('action-0')).toHaveTextContent('Edit');
    expect(getByTestId('action-1')).toHaveTextContent('Delete');
  });

  test('does not render actions when dialog is closed', () => {
    const { queryByTestId } = render(
      <RowCustomActionDialog
        {...defaultProps}
        openRowCustomActionDialog={false}
      />,
    );
    expect(queryByTestId('action-0')).not.toBeInTheDocument();
  });

  test('calls onClickRowCustomAction with correct action and row when an action is selected', () => {
    const { getByTestId } = render(<RowCustomActionDialog {...defaultProps} />);
    fireEvent.click(getByTestId('action-0')); // Click Edit
    expect(mockOnClickRowCustomAction).toHaveBeenCalledWith({
      action: { label: 'Edit', value: 'edit' },
      row: { id: 1, name: 'Test Row' },
    });
  });

  test('calls setOpenRowCustomActionDialog when close is triggered', () => {
    const { getByTestId } = render(<RowCustomActionDialog {...defaultProps} />);
    fireEvent.click(getByTestId('close-button'));
    expect(mockSetOpenRowCustomActionDialog).toHaveBeenCalledWith(false);
  });
});
