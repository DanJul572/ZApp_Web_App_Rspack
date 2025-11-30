import { fireEvent, render, screen } from '@testing-library/react';
import Upload from '../../../components/button/Upload';

describe('Upload Button Component', () => {
  it('renders with the correct label', () => {
    render(<Upload label="Upload File" />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  it('renders a hidden file input', () => {
    render(<Upload label="Upload" />);
    const input = screen.getByLabelText('Upload');
    expect(input).toHaveAttribute('type', 'file');
  });

  it('calls onUpload when a file is selected', () => {
    const handleUpload = jest.fn();
    render(<Upload label="Upload" onUpload={handleUpload} />);
    const input = screen.getByLabelText('Upload');
    fireEvent.change(input, {
      target: { files: [new File([''], 'test.txt')] },
    });
    expect(handleUpload).toHaveBeenCalled();
  });

  it('accepts the correct file type', () => {
    render(<Upload label="Upload" type="image/*" />);
    const input = screen.getByLabelText('Upload');
    expect(input).toHaveAttribute('accept', 'image/*');
  });
});
