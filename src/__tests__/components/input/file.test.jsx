import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@tanstack/react-query';
import File from '@/components/input/File';
import { useFile } from '@/contexts/FileProvider';
import { downloadFile } from '@/helpers/downloadFile';

const mockFile = new Blob(['file content'], { type: 'text/plain' });
const setFileMock = jest.fn();
mockFile.name = 'test-file.txt';

jest.mock('@/contexts/FileProvider', () => ({
  useFile: jest.fn(),
}));

jest.mock('@/helpers/downloadFile', () => ({
  downloadFile: jest.fn(),
}));

jest.mock('mui-file-input', () => ({
  MuiFileInput: jest.fn(
    ({ onChange, clearIconButtonProps, value, fullWidth, ...rest }) => (
      <input
        data-testid="mui-file-input-mock"
        type="file"
        onChange={() => onChange?.(mockFile)}
        {...rest}
      />
    ),
  ),
}));

jest.mock('@/hooks/Translator', () => () => (key) => key);

let counter = 0;
jest.mock('uuid', () => ({
  v4: () => `mock-uuid-${counter++}`,
}));

jest.mock('@/hooks/Request', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

describe('File Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useFile.mockReturnValue({
      file: [],
      setFile: setFileMock,
    });

    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });
  });

  it('renders the component with label', () => {
    render(<File label="Test Label" name="test" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles file upload', () => {
    render(<File label="Test Label" name="test" />);

    const input = screen.getByTestId('mui-file-input-mock');

    fireEvent.change(input, { target: { files: [mockFile] } });

    expect(setFileMock).toHaveBeenCalled();
  });

  it('handles file removal', () => {
    useFile.mockReturnValue({
      file: [{ name: 'test', file: mockFile }],
      setFile: setFileMock,
    });

    render(<File label="Test Label" name="test" />);
    const input = screen.getByTestId('mui-file-input-mock');

    fireEvent.change(input);

    expect(setFileMock).toHaveBeenCalled();
  });

  it('handles file download', () => {
    useFile.mockReturnValue({
      file: [{ name: 'test', file: mockFile }],
      setFile: setFileMock,
    });

    render(<File label="Test Label" name="test" />);
    const downloadButton = screen.getByRole('button');

    fireEvent.click(downloadButton);

    expect(downloadFile).toHaveBeenCalledWith(mockFile);
  });
});
