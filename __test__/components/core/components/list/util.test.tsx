import React from 'react';
import { describe, expect, it } from 'vitest';
import {
  flattenChildren,
  isWindow,
} from '@/components/core/components/list/util';

describe('flattenChildren', () => {
  it('should handle null and undefined', () => {
    expect(flattenChildren(null)).toEqual([]);
    expect(flattenChildren(undefined)).toEqual([]);
  });

  it('should handle single node', () => {
    const node = <div>test</div>;
    expect(flattenChildren(node)).toEqual([node]);
  });

  it('should handle array of nodes', () => {
    const nodes = [
      <div key="1">1</div>,
      <div key="2">2</div>,
      <div key="3">3</div>,
    ];
    expect(flattenChildren(nodes)).toEqual(nodes);
  });

  it('should handle React.Fragment', () => {
    const fragment = (
      <React.Fragment>
        <div>1</div>
        <div>2</div>
      </React.Fragment>
    );
    // eslint-disable-next-line react/jsx-key
    const expected = [<div>1</div>, <div>2</div>];
    expect(flattenChildren(fragment)).toEqual(expected);
  });

  it('should handle nested structure', () => {
    const nested = (
      <div>
        <React.Fragment>
          <div>1</div>
          {[<div key="2">2</div>, <div key="3">3</div>]}
          <React.Fragment>
            <div>4</div>
            <div>5</div>
          </React.Fragment>
        </React.Fragment>
      </div>
    );
    const expected = [nested];
    expect(flattenChildren(nested)).toEqual(expected);
  });

  it('should handle mixed content', () => {
    const mixed = [
      'text',
      <div key="1">1</div>,
      null,
      undefined,
      <React.Fragment key="frag">
        <div>2</div>
        <div>3</div>
      </React.Fragment>,
    ];
    // eslint-disable-next-line react/jsx-key
    const expected = ['text', <div key="1">1</div>, <div>2</div>, <div>3</div>];
    expect(flattenChildren(mixed)).toEqual(expected);
  });
});

describe('isWindow', () => {
  it('isWindow function', () => {
    expect(isWindow(window)).toEqual(true);
    expect(isWindow(document.body)).toEqual(false);
  });
});
