import type { FilterCondition, FilterMap, SortDirection, SortMap } from '../types/index.js';

export class FilterBuilder {
  private readonly conditions: FilterMap = {};

  where(field: string, op: FilterCondition['op'], val: FilterCondition['val']): this {
    if (!this.conditions[field]) {
      this.conditions[field] = [];
    }
    this.conditions[field].push({ op, val });
    return this;
  }

  eq(field: string, val: FilterCondition['val']): this {
    return this.where(field, '=', val);
  }

  gt(field: string, val: number): this {
    return this.where(field, '>', val);
  }

  gte(field: string, val: number): this {
    return this.where(field, '>=', val);
  }

  lt(field: string, val: number): this {
    return this.where(field, '<', val);
  }

  lte(field: string, val: number): this {
    return this.where(field, '<=', val);
  }

  like(field: string, val: string): this {
    return this.where(field, 'like', val);
  }

  build(): FilterMap {
    return { ...this.conditions };
  }
}

export function filter(): FilterBuilder {
  return new FilterBuilder();
}

export function sort(fields: Record<string, SortDirection>): SortMap {
  return { ...fields };
}

export function paginate(
  limit: number,
  offset = 0,
  params: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...params,
    listlimit: limit,
    listoffset: offset,
  };
}
