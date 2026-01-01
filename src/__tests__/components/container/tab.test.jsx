import { fireEvent, render, screen } from '@testing-library/react';
import Tab from '@/components/container/Tab';

let counter = 0;
jest.mock('uuid', () => ({
  v4: () => `mock-uuid-${counter++}`,
}));

describe('Tab Component', () => {
  const labels = [
    {
      label: 'Tab 1',
    },
    {
      label: 'Tab 2',
    },
    {
      label: 'Tab 3',
    },
  ];
  const items = [
    [{ id: 'c1', name: 'Component 1' }],
    [{ id: 'c2', name: 'Component 2' }],
    [{ id: 'c3', name: 'Component 3' }],
  ];

  const renderFn = (childs) => (
    <div>
      {childs.map((component) => (
        <span key={component.id}>{component.name}</span>
      ))}
    </div>
  );

  const getPanels = () => ({
    panel0: document.getElementById('simple-tabpanel-0'),
    panel1: document.getElementById('simple-tabpanel-1'),
    panel2: document.getElementById('simple-tabpanel-2'),
  });

  test('renders tabs and panels', () => {
    render(<Tab labels={labels} items={items} render={renderFn} />);

    labels.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });

    const { panel0, panel1, panel2 } = getPanels();

    expect(panel0).not.toHaveAttribute('hidden', '');
    expect(panel1).toHaveAttribute('hidden', '');
    expect(panel2).toHaveAttribute('hidden', '');
  });

  test('switches tab on click', () => {
    render(<Tab labels={labels} items={items} render={renderFn} />);

    fireEvent.click(screen.getByText('Tab 2'));

    let { panel0, panel1, panel2 } = getPanels();

    expect(panel0).toHaveAttribute('hidden', '');
    expect(panel1).not.toHaveAttribute('hidden', '');
    expect(panel2).toHaveAttribute('hidden', '');

    fireEvent.click(screen.getByText('Tab 3'));

    ({ panel0, panel1, panel2 } = getPanels());

    expect(panel0).toHaveAttribute('hidden', '');
    expect(panel1).toHaveAttribute('hidden', '');
    expect(panel2).not.toHaveAttribute('hidden', '');
  });

  test('shows error if label is not array', () => {
    render(<Tab label="Invalid Label" items={items} render={renderFn} />);
    expect(screen.getByText('Label is not valid.')).toBeInTheDocument();
  });
});
