import {
  addGridColumn,
  parseGridSizes,
  removeGridColumn,
  resizeGridColumns,
} from '@/interpreter/layout/gridColumns';

describe('view builder grid columns', () => {
  it('derives column count from size and section', () => {
    expect(parseGridSizes('6,6', 1)).toEqual([6, 6]);
    expect(parseGridSizes('4,8', 3)).toEqual([4, 8, 4]);
    expect(parseGridSizes(undefined, 0, 1)).toEqual([12]);
    expect(parseGridSizes(null, 3)).toEqual([4, 4, 4]);
  });

  it('adds a column using free space or by splitting the widest', () => {
    expect(addGridColumn([12])).toEqual([6, 6]);
    expect(addGridColumn([4, 4])).toEqual([4, 4, 4]);
    expect(addGridColumn([6, 6])).toEqual([6, 3, 3]);
    expect(addGridColumn([1])).toEqual([1, 11]);
  });

  it('gives a removed column width to its neighbour', () => {
    expect(removeGridColumn([4, 4, 4], 1)).toEqual([8, 4]);
    expect(removeGridColumn([3, 9], 0)).toEqual([12]);
    expect(removeGridColumn([12], 0)).toEqual([12]);
  });

  it('resizes two adjacent columns keeping their total', () => {
    expect(resizeGridColumns([6, 6], 0, 2)).toEqual([8, 4]);
    expect(resizeGridColumns([6, 6], 0, 10)).toEqual([11, 1]);
    expect(resizeGridColumns([6, 6], 0, -10)).toEqual([1, 11]);
    expect(resizeGridColumns([4, 4, 4], 1, 1)).toEqual([4, 5, 3]);
  });
});
