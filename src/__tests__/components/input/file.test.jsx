import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@tanstack/react-query';
import File from '@/components/input/File';
import { useFile } from '@/contexts/FileProvider';
import { downloadFile } from '@/helpers/downloadFile';
import { getFileFromBuffer } from '@/helpers/readFile';

const mockFile = new Blob(['file content'], { type: 'text/plain' });
mockFile.name = 'test-file.txt';

let fileState = [];
const setFileMock = jest.fn((updater) => {
  if (typeof updater === 'function') {
    fileState = updater(fileState);
  } else {
    fileState = updater;
  }
});

jest.mock('@/contexts/FileProvider', () => ({
  useFile: jest.fn(),
}));

jest.mock('@/helpers/downloadFile', () => ({
  downloadFile: jest.fn(),
}));

jest.mock('mui-file-input', () => ({
  MuiFileInput: jest.fn(({ onChange }) => (
    <>
      <input
        data-testid="mui-file-input-mock"
        type="file"
        onChange={() => onChange?.(mockFile)}
      />
      <button
        data-testid="clear"
        type="submit"
        onClick={() => onChange?.(null)}
      />
    </>
  )),
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

jest.mock('@/helpers/readFile', () => ({
  getFileFromBuffer: jest.fn(),
}));

describe('File Input Component', () => {
  beforeEach(() => {
    fileState = [];
    jest.clearAllMocks();

    useFile.mockReturnValue({
      file: fileState,
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
    const downloadButton = screen.getAllByRole('button')[1];

    fireEvent.click(downloadButton);

    expect(downloadFile).toHaveBeenCalledWith(mockFile);
  });

  it('handles file fetched from API', () => {
    const apiFile = new Blob(['from api'], { type: 'text/plain' });

    getFileFromBuffer.mockReturnValue(apiFile);

    useQuery.mockReturnValue({
      data: { data: 'buffer-data' },
      isLoading: false,
      isError: false,
    });

    render(<File label="Test Label" name="test" value="server-file.txt" />);

    expect(getFileFromBuffer).toHaveBeenCalled();
    expect(setFileMock).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<File label="Test Label" name="test" value="file.txt" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: 'Download failed' },
    });

    render(<File label="Test Label" name="test" value="file.txt" />);

    expect(screen.getByText('Download failed')).toBeInTheDocument();
  });

  it('adds a new file when it does not exist', () => {
    render(<File label="Test Label" name="test" />);

    const input = screen.getByTestId('mui-file-input-mock');
    fireEvent.change(input);

    expect(fileState).toHaveLength(1);
    expect(fileState[0].name).toBe('test');
  });

  it('replaces an existing file with the same name', () => {
    fileState = [{ id: 'old-id', name: 'test', file: new Blob(['old']) }];

    useFile.mockReturnValue({
      file: fileState,
      setFile: setFileMock,
    });

    render(<File label="Test Label" name="test" />);

    const input = screen.getByTestId('mui-file-input-mock');
    fireEvent.change(input);

    expect(fileState).toHaveLength(1);
    expect(fileState[0].id).not.toBe('old-id');
  });

  it('removes file when cleared', () => {
    fileState = [{ id: '1', name: 'test', file: mockFile }];

    useFile.mockReturnValue({
      file: fileState,
      setFile: setFileMock,
    });

    render(<File label="Test Label" name="test" />);

    fireEvent.click(screen.getByTestId('clear'));

    expect(fileState).toHaveLength(0);
  });

  it('calls onChange with id when file is added', () => {
    const onChangeMock = jest.fn();

    render(<File label="Test Label" name="test" onChange={onChangeMock} />);

    fireEvent.change(screen.getByTestId('mui-file-input-mock'));

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.stringContaining('mock-uuid'),
    );
  });

  it('returns prevFiles when removing a file that does not exist', () => {
    fileState = [{ id: '1', name: 'other', file: mockFile }];

    useFile.mockReturnValue({
      file: fileState,
      setFile: setFileMock,
    });

    const onChangeMock = jest.fn();

    render(
      <File
        label="Test Label"
        name="test" // does NOT exist
        onChange={onChangeMock}
      />,
    );

    fireEvent.click(screen.getByTestId('clear'));

    expect(fileState).toHaveLength(1); // unchanged
  });

  it('calls onChange with null when file is removed', () => {
    fileState = [{ id: '1', name: 'test', file: mockFile }];

    useFile.mockReturnValue({
      file: fileState,
      setFile: setFileMock,
    });

    const onChangeMock = jest.fn();

    render(<File label="Test Label" name="test" onChange={onChangeMock} />);

    fireEvent.click(screen.getByTestId('clear'));

    expect(onChangeMock).toHaveBeenCalledWith(null);
  });

  it('calls request.get inside getFile', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: 'file' });

    require('@/hooks/Request').default.mockReturnValue({
      get: getMock,
    });

    let queryFn;

    useQuery.mockImplementation(({ queryFn: fn }) => {
      queryFn = fn;
      return {
        data: null,
        isLoading: false,
        isError: false,
      };
    });

    render(<File label="Test Label" name="test" value="server-file.txt" />);

    await queryFn();

    expect(getMock).toHaveBeenCalledWith(expect.anything(), {
      name: 'server-file.txt',
    });
  });
});
