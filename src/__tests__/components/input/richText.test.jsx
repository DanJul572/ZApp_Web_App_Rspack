import EditorJS from '@editorjs/editorjs';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Richtext from '@/components/input/RichText';

// Define mock data and instance before mocking the module
const mockSaveResult = {
  blocks: [{ type: 'paragraph', data: { text: 'hello' } }],
};
let lastEditorConfig = null;
const mockEditorInstance = {
  save: jest.fn().mockResolvedValue(mockSaveResult),
  clear: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn(),
};

// Mock editor tools and EditorJS before importing the component
jest.mock('@editorjs/checklist', () => jest.fn());
jest.mock('@editorjs/code', () => jest.fn());
jest.mock('@editorjs/delimiter', () => jest.fn());
jest.mock('@editorjs/embed', () => jest.fn());
jest.mock('@editorjs/header', () => jest.fn());
jest.mock('@editorjs/image', () => jest.fn());
jest.mock('@editorjs/inline-code', () => jest.fn());
jest.mock('@editorjs/link', () => jest.fn());
jest.mock('@editorjs/list', () => jest.fn());
jest.mock('@editorjs/marker', () => jest.fn());
jest.mock('@editorjs/quote', () => jest.fn());
jest.mock('@editorjs/table', () => jest.fn());
jest.mock('@editorjs/warning', () => jest.fn());

jest.mock('@editorjs/editorjs', () => {
  return jest.fn().mockImplementation((config) => {
    lastEditorConfig = config;
    return mockEditorInstance;
  });
});

afterEach(() => {
  jest.clearAllMocks();
  lastEditorConfig = null;
});

describe('Richtext Input Component', () => {
  test('renders label and buttons, Save calls onChange with saved data, Clear emits empty blocks', async () => {
    const handleChange = jest.fn();
    render(<Richtext label="My Label" onChange={handleChange} />);

    await waitFor(() => expect(EditorJS).toHaveBeenCalled());

    expect(screen.getByText('My Label')).toBeInTheDocument();
    const saveBtn = screen.getByRole('button', { name: /save/i });
    const clearBtn = screen.getByRole('button', { name: /clear/i });
    expect(saveBtn).toBeInTheDocument();
    expect(clearBtn).toBeInTheDocument();

    // Click Save -> onChange called with editor save result
    fireEvent.click(saveBtn);
    await waitFor(() => expect(mockEditorInstance.save).toHaveBeenCalled());
    expect(handleChange).toHaveBeenCalledWith(mockSaveResult);

    // Click Clear -> onChange called with empty blocks
    fireEvent.click(clearBtn);
    await waitFor(() => expect(mockEditorInstance.clear).toHaveBeenCalled());
    expect(handleChange).toHaveBeenCalledWith({ blocks: [] });
  });

  test('when disabled, editor initialized with autofocus false and placeholder null and buttons hidden', async () => {
    render(<Richtext disabled={true} />);

    await waitFor(() => expect(EditorJS).toHaveBeenCalled());

    // Check constructor config reflects disabled state
    expect(lastEditorConfig).not.toBeNull();
    expect(lastEditorConfig.autofocus).toBe(false);
    expect(lastEditorConfig.placeholder).toBeNull();

    // Buttons should not be rendered when disabled
    expect(screen.queryByRole('button', { name: /save/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
  });

  test('logs error when save fails', async () => {
    const error = new Error('save failed');

    // Make save reject
    mockEditorInstance.save.mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Richtext />);

    await waitFor(() => expect(EditorJS).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Save Failed:', error);
    });

    consoleSpy.mockRestore();
  });
  test('logs error when clear fails', async () => {
    const error = new Error('clear failed');

    // Make clear reject
    mockEditorInstance.clear.mockRejectedValueOnce(error);

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Richtext />);

    await waitFor(() => expect(EditorJS).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Clear Failed:', error);
    });

    consoleSpy.mockRestore();
  });
});
