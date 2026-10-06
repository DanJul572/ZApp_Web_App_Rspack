import {
  createComponent,
  findComponent,
  insertComponent,
  moveComponent,
  updateComponent,
} from '@/pages/view/create/dnd/tree';

let counter = 0;
jest.mock('uuid', () => ({
  v4: () => `mock-uuid-${counter++}`,
}));

const CONTAINER = { value: 1, label: 'Container' };
const BUTTON = { value: 5, label: 'Button' };

const leaf = (id) => ({ id, group: BUTTON, type: {}, properties: {} });
const grid = (id, section) => ({
  id,
  group: CONTAINER,
  type: {},
  properties: { size: '4,8' },
  section,
});

const ids = (list) => list.map((component) => component.id);

describe('view builder dnd tree', () => {
  it('creates container with empty section and leaf without section', () => {
    expect(createComponent(CONTAINER, {}).section).toEqual([]);
    expect(createComponent(BUTTON, {}).section).toBeUndefined();
  });

  it('reorders within the root list', () => {
    const content = [leaf('a'), leaf('b'), leaf('c')];

    expect(ids(moveComponent(content, 'a', { afterId: 'c' }))).toEqual([
      'b',
      'c',
      'a',
    ]);
    expect(ids(moveComponent(content, 'c', { beforeId: 'a' }))).toEqual([
      'c',
      'a',
      'b',
    ]);
  });

  it('moves between grid columns and keeps empty columns and size', () => {
    const content = [grid('g', [[leaf('a')], [leaf('b')]])];

    const next = moveComponent(content, 'a', { afterId: 'b' });
    const g = next[0];

    expect(g.section).toHaveLength(2);
    expect(g.section[0]).toEqual([]);
    expect(ids(g.section[1])).toEqual(['b', 'a']);
    expect(g.properties.size).toBe('4,8');
  });

  it('does not mutate the original content and keeps untouched references', () => {
    const other = leaf('x');
    const content = [other, grid('g', [[leaf('a')], []])];

    const next = moveComponent(content, 'a', { containerId: 'g', colIndex: 1 });

    expect(ids(content[1].section[0])).toEqual(['a']);
    expect(next[0]).toBe(other);
    expect(ids(next[1].section[1])).toEqual(['a']);
  });

  it('creates the first column when dropping into an empty grid', () => {
    const content = [grid('g', [])];
    const next = insertComponent(content, leaf('n'), {
      containerId: 'g',
      colIndex: 0,
    });

    expect(ids(next[0].section[0])).toEqual(['n']);
  });

  it('moves a nested component out to the root', () => {
    const content = [grid('g', [[leaf('a')]]), leaf('b')];
    const next = moveComponent(content, 'a', { beforeId: 'b' });

    expect(ids(next)).toEqual(['g', 'a', 'b']);
    expect(next[0].section[0]).toEqual([]);
  });

  it('refuses to move a container into its own descendant', () => {
    const inner = grid('inner', [[leaf('a')]]);
    const content = [grid('outer', [[inner]])];

    expect(moveComponent(content, 'outer', { beforeId: 'a' })).toBe(content);
    expect(
      moveComponent(content, 'outer', { containerId: 'inner', colIndex: 0 }),
    ).toBe(content);
  });

  it('returns the same content for a no-op or unknown target', () => {
    const content = [leaf('a'), leaf('b')];

    expect(moveComponent(content, 'a', { beforeId: 'a' })).toBe(content);
    expect(moveComponent(content, 'a', { beforeId: 'missing' })).toBe(content);
    expect(insertComponent(content, leaf('n'), { afterId: 'missing' })).toBe(
      null,
    );
  });

  it('finds nested components by id', () => {
    const a = leaf('a');
    const content = [grid('g', [[], [grid('h', [[a]])]])];

    expect(findComponent(content, 'a')).toBe(a);
    expect(findComponent(content, 'missing')).toBeNull();
  });
});

describe('view builder updateComponent', () => {
  it('replaces a nested component and copies only its path', () => {
    const untouched = leaf('x');
    const content = [untouched, grid('g', [[leaf('a')], [leaf('b')]])];

    const next = updateComponent(content, 'b', (component) => ({
      ...component,
      properties: { label: 'B' },
    }));

    expect(next[0]).toBe(untouched);
    expect(next[1].section[0]).toBe(content[1].section[0]);
    expect(next[1].section[1][0].properties).toEqual({ label: 'B' });
    expect(updateComponent(content, 'missing', (c) => c)).toBe(content);
  });
});
