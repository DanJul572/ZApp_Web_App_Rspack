import { fireEvent, render, screen } from '@testing-library/react';
import Code from '@/components/input/Code';

jest.mock('@uiw/react-textarea-code-editor', () => {
  return function MockCodeEditor(props) {
    return (
      <textarea
        placeholder={props.placeholder}
        disabled={props.disabled}
        value={props.value}
        onChange={props.onChange}
        data-testid="mock-code-editor"
      />
    );
  };
});

describe('Code Input Component', () => {
  const mockOnChange = jest.fn();

  it('renders the component with label', () => {
    render(<Code label="Code Editor" value="" onChange={mockOnChange} />);
    expect(screen.getByText('Code Editor')).toBeInTheDocument();
  });

  it('renders language options when withOptions is true', () => {
    render(<Code label="Code Editor" value="" withOptions />);
    expect(screen.getByText('JS')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
  });

  it('switches active language when a language chip is clicked', () => {
    render(<Code label="Code Editor" value="" withOptions />);

    const jsChip = screen.getByText('JS').closest('.MuiChip-root');
    const sqlChip = screen.getByText('SQL').closest('.MuiChip-root');

    // Initially, JS should be active
    expect(jsChip).toHaveClass('MuiChip-outlinedPrimary');

    // Click SQL chip
    fireEvent.click(screen.getByText('SQL'));

    expect(sqlChip).toHaveClass('MuiChip-outlinedPrimary');
    expect(jsChip).not.toHaveClass('MuiChip-outlinedPrimary');
  });

  it('calls onChange when the editor value changes', () => {
    render(<Code label="Code Editor" value="" onChange={mockOnChange} />);
    const textarea = screen.getByPlaceholderText('Write here...');
    fireEvent.change(textarea, {
      target: { value: 'console.log("Hello World");' },
    });
    expect(mockOnChange).toHaveBeenCalledWith('console.log("Hello World");');
  });

  it('disables the editor when the disabled prop is true', () => {
    render(<Code label="Code Editor" value="" disabled />);
    const textarea = screen.getByPlaceholderText('Write here...');
    expect(textarea).toBeDisabled();
  });
});
