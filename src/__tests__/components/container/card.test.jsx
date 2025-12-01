import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from '@/components/container/Card';

describe('Card Container Component', () => {
  test('renders children', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies default border and color', () => {
    const { container } = render(<Card>Content</Card>);
    const outerBox = container.firstChild;

    expect(outerBox).toHaveStyle(`
      border: 0px solid;
    `);
    expect(outerBox).toHaveStyle(`border-color: #e0e0e0`); // grey[300]
  });

  test('applies custom border and color props', () => {
    const { container } = render(
      <Card border={2} color="#123456">
        Content
      </Card>,
    );
    const outerBox = container.firstChild;

    expect(outerBox).toHaveStyle(`border: 2px solid`);
    expect(outerBox).toHaveStyle(`border-color: #123456`);
  });

  test('applies flex layout when flex prop is true', () => {
    const { container } = render(<Card flex>Content</Card>);
    const innerBox = container.firstChild.firstChild;

    expect(innerBox).toHaveStyle('display: flex');
    expect(innerBox).toHaveStyle('justify-content: flex-start');
    expect(innerBox).toHaveStyle('gap: 8px');
  });

  test('applies horizontal display alignment', () => {
    const display = {
      horizontal: { value: 'center' },
    };

    const { container } = render(
      <Card flex display={display}>
        Content
      </Card>,
    );

    const innerBox = container.firstChild.firstChild;

    expect(innerBox).toHaveStyle('justify-content: center');
  });

  test('default padding is applied', () => {
    const { container } = render(<Card>Content</Card>);
    const innerBox = container.firstChild.firstChild;

    expect(innerBox).toHaveStyle('padding: 8px');
  });

  test('custom padding is applied', () => {
    const { container } = render(<Card padding={3}>Content</Card>);
    const innerBox = container.firstChild.firstChild;

    expect(innerBox).toHaveStyle('padding: 24px');
  });
});
