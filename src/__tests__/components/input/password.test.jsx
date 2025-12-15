import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import Password from '@/components/input/Password';

describe('Password Input Component', () => {
  it('renders label and input with default props', () => {
    render(<Password label="Password" />);

    expect(screen.getByText('Password')).toBeInTheDocument();

    const input = document.getElementsByClassName('MuiOutlinedInput-input')[0];
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('name', 'password');
  });

  it('renders input with provided value and name', () => {
    render(
      <Password label="User Password" value="secret" name="userPassword" />,
    );

    const input = screen.getByDisplayValue('secret');
    expect(input).toHaveAttribute('name', 'userPassword');
  });

  it('toggles password visibility when icon button is clicked', () => {
    render(<Password label="Password" />);

    const input = document.getElementsByClassName('MuiOutlinedInput-input')[0];
    const toggleButton = screen.getByRole('button');

    // Initially hidden
    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('prevents default on mouse down for visibility button', () => {
    render(<Password label="Password" />);

    const toggleButton = screen.getByRole('button');
    const mouseDownEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = jest.spyOn(mouseDownEvent, 'preventDefault');

    act(() => {
      toggleButton.dispatchEvent(mouseDownEvent);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('calls onChange with input value when provided', () => {
    const handleChange = jest.fn();

    render(<Password label="Password" onChange={handleChange} />);

    const input = document.getElementsByClassName('MuiOutlinedInput-input')[0];

    fireEvent.change(input, { target: { value: 'newpass' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('newpass');
  });

  it('does not throw when onChange is not provided', () => {
    render(<Password label="Password" />);

    const input = document.getElementsByClassName('MuiOutlinedInput-input')[0];

    expect(() => {
      fireEvent.change(input, { target: { value: 'abc' } });
    }).not.toThrow();
  });

  it('calls onBlur with input value when provided', () => {
    const handleBlur = jest.fn();

    render(<Password label="Password" onBlur={handleBlur} value="blurpass" />);

    const input = screen.getByDisplayValue('blurpass');

    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledWith('blurpass');
  });

  it('does not throw when onBlur is not provided', () => {
    render(<Password label="Password" />);

    const input = document.getElementsByClassName('MuiOutlinedInput-input')[0];

    expect(() => {
      fireEvent.blur(input);
    }).not.toThrow();
  });

  it('disables the input when disabled is true', () => {
    render(<Password label="Password" disabled={true} />);

    const input = document.getElementsByClassName('MuiOutlinedInput-input')[0];
    expect(input).toBeDisabled();
  });
});
