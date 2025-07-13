import { beforeEach, describe, expect, it, vi } from 'vitest';
import CellMeasurerCacheDecorator from '@/components/core/components/virtual-grid/cell-measurer-cache-decorator';

// Mock CellMeasurerCache
const mockCellMeasurerCache = {
  clear: vi.fn(),
  clearAll: vi.fn(),
  columnWidth: vi.fn(),
  defaultHeight: 30,
  defaultWidth: 100,
  hasFixedHeight: vi.fn(),
  hasFixedWidth: vi.fn(),
  getHeight: vi.fn(),
  getWidth: vi.fn(),
  has: vi.fn(),
  rowHeight: vi.fn(),
  set: vi.fn(),
};

describe('CellMeasurerCacheDecorator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates instance with default offsets', () => {
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
    });

    expect(decorator._cellMeasurerCache).toBe(mockCellMeasurerCache);
    expect(decorator._columnIndexOffset).toBe(0);
    expect(decorator._rowIndexOffset).toBe(0);
  });

  it('creates instance with custom offsets', () => {
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 5,
      rowIndexOffset: 10,
    });

    expect(decorator._columnIndexOffset).toBe(5);
    expect(decorator._rowIndexOffset).toBe(10);
  });

  it('calls clear with offset indices', () => {
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 2,
      rowIndexOffset: 3,
    });

    decorator.clear(1, 4);

    expect(mockCellMeasurerCache.clear).toHaveBeenCalledWith(4, 6); // 1+3, 4+2
  });

  it('calls clearAll', () => {
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
    });

    decorator.clearAll();

    expect(mockCellMeasurerCache.clearAll).toHaveBeenCalled();
  });

  it('calls columnWidth with offset index', () => {
    mockCellMeasurerCache.columnWidth.mockReturnValue(150);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 2,
    });

    const result = decorator.columnWidth({ index: 3 });

    expect(mockCellMeasurerCache.columnWidth).toHaveBeenCalledWith({
      index: 5,
    }); // 3+2
    expect(result).toBe(150);
  });

  it('returns defaultHeight', () => {
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
    });

    expect(decorator.defaultHeight).toBe(30);
  });

  it('returns defaultWidth', () => {
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
    });

    expect(decorator.defaultWidth).toBe(100);
  });

  it('calls hasFixedHeight', () => {
    mockCellMeasurerCache.hasFixedHeight.mockReturnValue(true);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
    });

    const result = decorator.hasFixedHeight();

    expect(mockCellMeasurerCache.hasFixedHeight).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('calls hasFixedWidth', () => {
    mockCellMeasurerCache.hasFixedWidth.mockReturnValue(false);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
    });

    const result = decorator.hasFixedWidth();

    expect(mockCellMeasurerCache.hasFixedWidth).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('calls getHeight with offset indices', () => {
    mockCellMeasurerCache.getHeight.mockReturnValue(50);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 1,
      rowIndexOffset: 2,
    });

    const result = decorator.getHeight(3, 4);

    expect(mockCellMeasurerCache.getHeight).toHaveBeenCalledWith(5, 5); // 3+2, 4+1
    expect(result).toBe(50);
  });

  it('calls getHeight with default columnIndex', () => {
    mockCellMeasurerCache.getHeight.mockReturnValue(40);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 1,
      rowIndexOffset: 2,
    });

    const result = decorator.getHeight(3);

    expect(mockCellMeasurerCache.getHeight).toHaveBeenCalledWith(5, 1); // 3+2, 0+1
    expect(result).toBe(40);
  });

  it('calls getWidth with offset indices', () => {
    mockCellMeasurerCache.getWidth.mockReturnValue(120);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 1,
      rowIndexOffset: 2,
    });

    const result = decorator.getWidth(3, 4);

    expect(mockCellMeasurerCache.getWidth).toHaveBeenCalledWith(5, 5); // 3+2, 4+1
    expect(result).toBe(120);
  });

  it('calls getWidth with default columnIndex', () => {
    mockCellMeasurerCache.getWidth.mockReturnValue(110);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 1,
      rowIndexOffset: 2,
    });

    const result = decorator.getWidth(3);

    expect(mockCellMeasurerCache.getWidth).toHaveBeenCalledWith(5, 1); // 3+2, 0+1
    expect(result).toBe(110);
  });

  it('calls has with offset indices', () => {
    mockCellMeasurerCache.has.mockReturnValue(true);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 1,
      rowIndexOffset: 2,
    });

    const result = decorator.has(3, 4);

    expect(mockCellMeasurerCache.has).toHaveBeenCalledWith(5, 5); // 3+2, 4+1
    expect(result).toBe(true);
  });

  it('calls has with default columnIndex', () => {
    mockCellMeasurerCache.has.mockReturnValue(false);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 1,
      rowIndexOffset: 2,
    });

    const result = decorator.has(3);

    expect(mockCellMeasurerCache.has).toHaveBeenCalledWith(5, 1); // 3+2, 0+1
    expect(result).toBe(false);
  });

  it('calls rowHeight with offset index', () => {
    mockCellMeasurerCache.rowHeight.mockReturnValue(60);
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      rowIndexOffset: 3,
    });

    const result = decorator.rowHeight({ index: 2 });

    expect(mockCellMeasurerCache.rowHeight).toHaveBeenCalledWith({ index: 5 }); // 2+3
    expect(result).toBe(60);
  });

  it('calls set with offset indices', () => {
    const decorator = new CellMeasurerCacheDecorator({
      cellMeasurerCache: mockCellMeasurerCache,
      columnIndexOffset: 1,
      rowIndexOffset: 2,
    });

    decorator.set(3, 4, 100, 50);

    expect(mockCellMeasurerCache.set).toHaveBeenCalledWith(5, 5, 100, 50); // 3+2, 4+1
  });
});
