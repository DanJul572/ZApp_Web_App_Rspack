import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from '@tanstack/react-query';
import { MuiFileInput } from 'mui-file-input';
import File from '@/components/input/File';
import { downloadFile } from '@/helpers/downloadFile';

const mockFile = new globalThis.File(['file content'], 'test-file.txt', {
  type: 'text/plain',
});

const savedFileId = '2b17f189-dd7b-408f-9570-c412899aadd1';
const savedFile = {
  id: savedFileId,
  name: 'photo.png',
  path: `uploads/products/photo/${savedFileId}.png`,
  type: 'image/png',
};

const config = {
  api: {
    file: {
      detail: '/file/detail',
      host: 'http://localhost:8080',
    },
  },
};

jest.mock('@/helpers/downloadFile', () => ({
  downloadFile: jest.fn(),
  getFileUrl: jest.fn(
    (config, filePath) => `${config.api.file.host}/${filePath}`,
  ),
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

jest.mock('@/contexts/ConfigProvider', () => ({
  useConfig: () => {
    return {
      config: config,
    };
  },
}));

const getDisplayedFile = () => MuiFileInput.mock.calls.at(-1)[0].value;

describe('File Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });
  });

  it('renders the component with label', () => {
    render(<File label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange with the picked file', () => {
    const onChangeMock = jest.fn();

    render(<File label="Test Label" onChange={onChangeMock} />);
    fireEvent.change(screen.getByTestId('mui-file-input-mock'));

    expect(onChangeMock).toHaveBeenCalledWith(mockFile);
  });

  it('calls onChange with null when the file is cleared', () => {
    const onChangeMock = jest.fn();

    render(
      <File label="Test Label" value={mockFile} onChange={onChangeMock} />,
    );
    fireEvent.click(screen.getByTestId('clear'));

    expect(onChangeMock).toHaveBeenCalledWith(null);
  });

  it('shows a picked file without fetching it', () => {
    render(<File label="Test Label" value={mockFile} />);

    expect(getDisplayedFile()).toBe(mockFile);
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it('downloads a picked file from memory', () => {
    render(<File label="Test Label" value={mockFile} />);

    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(downloadFile).toHaveBeenCalledWith(mockFile);
  });

  it('shows the name of a saved file', () => {
    useQuery.mockReturnValue({ data: savedFile, isLoading: false });

    render(<File label="Test Label" value={savedFileId} />);

    expect(getDisplayedFile().name).toBe('photo.png');
  });

  it('opens a saved file from its public url', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    useQuery.mockReturnValue({ data: savedFile, isLoading: false });

    render(<File label="Test Label" value={savedFileId} />);
    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(openSpy).toHaveBeenCalledWith(
      `http://localhost:8080/${savedFile.path}`,
      '_blank',
      'noopener',
    );
    expect(downloadFile).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('fetches the details of a saved file by id', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: savedFile });

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

    render(<File label="Test Label" value={savedFileId} />);

    await expect(queryFn()).resolves.toEqual(savedFile);
    expect(getMock).toHaveBeenCalledWith(config.api.file.detail, {
      id: savedFileId,
    });
  });

  it('shows loading state', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<File label="Test Label" value={savedFileId} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: 'File not found' },
    });

    render(<File label="Test Label" value={savedFileId} />);

    expect(screen.getByText('File not found')).toBeInTheDocument();
  });
});
