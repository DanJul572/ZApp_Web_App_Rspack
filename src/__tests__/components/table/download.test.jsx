import { fireEvent, render, waitFor } from '@testing-library/react';
import Download from '@/components/table/Download';

jest.mock('@configs/CApiUrl', () => ({
  file: { download: '/api/download' },
}));
jest.mock('@/helpers/downloadFile', () => ({
  downloadFileFromBuffer: jest.fn(),
}));
jest.mock('@/helpers/readFile', () => ({
  extractFileNames: jest.fn((label) => `extracted-${label}`),
}));
jest.mock('@/hooks/Request', () => {
  return jest.fn(() => ({
    get: jest.fn(),
  }));
});

const mockRequest = require('@/hooks/Request');
const mockDownloadFileFromBuffer =
  require('@/helpers/downloadFile').downloadFileFromBuffer;
const mockExtractFileNames = require('@/helpers/readFile').extractFileNames;

describe('Download Table Component', () => {
  const mockGet = jest.fn();
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.mockReturnValue({ get: mockGet });
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('renders IconButton and file name when label is provided', () => {
    const { getByRole, getByText } = render(<Download label="test-file.pdf" />);
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('extracted-test-file.pdf')).toBeInTheDocument();
    expect(mockExtractFileNames).toHaveBeenCalledWith('test-file.pdf');
  });

  test('does not render IconButton when label is not provided', () => {
    const { queryByRole, getByText } = render(<Download />);
    expect(queryByRole('button')).not.toBeInTheDocument();
    expect(getByText('extracted-undefined')).toBeInTheDocument();
  });

  test('triggers download on button click and handles success', async () => {
    const mockResponse = {
      data: {
        data: { data: [1, 2, 3] },
        type: 'application/pdf',
      },
    };
    mockGet.mockResolvedValue(mockResponse);

    const { getByRole } = render(<Download label="test-file.pdf" />);
    fireEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/api/download', {
        name: 'test-file.pdf',
      });
      expect(mockDownloadFileFromBuffer).toHaveBeenCalledWith(
        new Uint8Array([1, 2, 3]),
        'extracted-test-file.pdf',
        'application/pdf',
      );
    });
  });

  test('logs error on download failure', async () => {
    const mockError = new Error('Download failed');
    mockGet.mockRejectedValueOnce(mockError);

    const { getByRole } = render(<Download label="test-file.pdf" />);
    fireEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/api/download', {
        name: 'test-file.pdf',
      });
      expect(consoleSpy).toHaveBeenCalledWith(mockError);
      expect(mockDownloadFileFromBuffer).not.toHaveBeenCalled();
    });
  });
});
