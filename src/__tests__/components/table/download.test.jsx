import { render } from '@testing-library/react';
import Download from '@/components/table/Download';

const config = {
  api: {
    file: {
      host: 'http://localhost:8080',
    },
  },
};

jest.mock('@/contexts/ConfigProvider', () => ({
  useConfig: () => {
    return {
      config: config,
    };
  },
}));

const file = {
  id: '2b17f189-dd7b-408f-9570-c412899aadd1',
  name: 'report.pdf',
  path: 'uploads/products/manual/2b17f189-dd7b-408f-9570-c412899aadd1.pdf',
};

describe('Download Table Component', () => {
  test('renders the file name and a link to its public url', () => {
    const { getByRole, getByText } = render(<Download file={file} />);

    expect(getByText('report.pdf')).toBeInTheDocument();
    expect(getByRole('link')).toHaveAttribute(
      'href',
      `http://localhost:8080/${file.path}`,
    );
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
  });

  test('renders nothing when the row has no file', () => {
    const { container } = render(<Download file={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
