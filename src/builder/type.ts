
import { Aggregations, Value, ValueType, Logic, Relation, Scope, Tag, ValueTypeKey, ValueKey, ValueTypeValue } from "./enum";
export type Property<T extends string = ValueTypeValue, I extends string = ValueKey> = {
  Type?: T,
  IncludeTimeValue?: I;
  LookupId?: Value;
  Name?: string;
}

export type Data = LookupId | LookupValue | Date | string | number | string[] | number[]

export type Order = {
  field: string; ascend: boolean;
}
export type AggregationData = {
  field: string; type: string;
}

export type LookupId = {
  id?: string;
  get_lookupId: () => string;
}

export type LookupValue = {
  value?: string;
  get_lookupValue: () => string;
}

interface SourceValueTypeMap {
  Text: string;
  Number: number;
  DateTime: Date;
  Date: Date;
  Lookup: LookupValue;
  LookupId: LookupId;
  LookupValue: LookupValue;
  Boolean: 0 | 1
  Integer: number;
  Url: string;
  FSObjType: string;
  GUID: string;
}

export type ValueTypeMap = Omit<{
  [key: string]: string;
}, keyof SourceValueTypeMap> & SourceValueTypeMap;

// type UnionToIntersection<U> =
//   (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown
//   ? R
//   : never

// export type ValueTypeToData<T extends keyof ValueTypeMap> =
//   UnionToIntersection<
//     T extends any ? ValueTypeMap[T] : never
//   >;