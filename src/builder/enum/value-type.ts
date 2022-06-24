/** 数据类型选项 */
export enum ValueType {
  Text = "Text",
  Number = "Number",
  DateTime = "DateTime", // yyyy-MM-ddTHH:mm:ss
  Date = "Date",
  Lookup = "Lookup", // === LookupValue
  LookupId = "LookupId",
  MultipleLookupId = "LookupId", // 多选的lookupId,跟普通lookupId一样，使用Eq即可
  LookupValue = "LookupValue",
  MultipleLookupValue = "LookupValue", // 待验证
  Boolean = "Boolean",
  Integer = "Integer",
  Url = "Url", // 检查
  FSObjType = "FSObjType", //文件夹
  GUID = "Text" // GUID查询当普通Text查询即可
};

export type ValueTypeValue = `${ValueType}`;
export type ValueTypeKey = keyof typeof ValueType;
