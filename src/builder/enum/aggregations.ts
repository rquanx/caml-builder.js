/** 处理函数选项 */
export enum Aggregations {
  Count = "COUNT", // 计数
  Average = "AVG", // 取平均值
  Maximum = "MAX", // 取最大值
  Minimum = "MIN", // 最小值
  Sum = "SUM", // 总计
  StdDeviation = "STDEV", // 开方?
  Variance = "VAR"
};

export type AggregationsKey = keyof typeof Aggregations;
