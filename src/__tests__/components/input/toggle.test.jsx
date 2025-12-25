import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Toggle from '@/components/input/Toggle';

describe('Toggle Input Component', () => {
  test('renders the label', () => {
    render(
      <Toggle label="Enable feature" value={false} onChange={jest.fn()} />,
    );

    expect(screen.getByText('Enable feature')).toBeInTheDocument();
  });

  test('switch is unchecked when value is false', () => {
    render(<Toggle label="Test toggle" value={false} onChange={jest.fn()} />);

    const switchInput = screen.getByRole('switch');
    expect(switchInput).not.toBeChecked();
  });

  test('switch is checked when value is true', () => {
    render(<Toggle label="Test toggle" value={true} onChange={jest.fn()} />);

    const switchInput = screen.getByRole('switch');
    expect(switchInput).toBeChecked();
  });

  test('calls onChange with inverted value when clicked', () => {
    const onChangeMock = jest.fn();

    render(
      <Toggle label="Test toggle" value={false} onChange={onChangeMock} />,
    );

    const switchInput = screen.getByRole('switch');
    fireEvent.click(switchInput);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  test('does not trigger onChange when disabled', () => {
    const onChangeMock = jest.fn();

    render(
      <Toggle
        label="Disabled toggle"
        value={false}
        onChange={onChangeMock}
        disabled={true}
      />,
    );

    const switchInput = screen.getByRole('switch');
    expect(switchInput).toBeDisabled();

    fireEvent.click(switchInput);
    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
