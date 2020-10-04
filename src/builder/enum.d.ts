/** 逻辑选项 */
export enum Logic {
    And = "And",
    Or = "Or"
}

/** 关系选项 */
export enum Relation {
    In = "In",
    Eq = "Eq",
    Gt = "Gt",
    Lt = "Lt",
    Geq = "Geq",
    Leq = "Leq",
    Neq = "Neq",
    Contains = "Contains",
    BeginsWith = "BeginsWith",
    IsNull = "IsNull",
    IsNotNull = "IsNotNull",
    DateRangesOverlap = "DateRangesOverlap",

    Includes = "Includes",
    NotIncludes = "NotIncludes",
    /**
     * 查阅项数组使用？ 
     *  <Includes>
            <FieldRef    Name = "Field_Name"/>
            <Value    Type = "Field_Type"/>
            <XML />
        </Includes> 
    */

    Membership = "Membership"
}

/** 数据类型选项 */
export enum ValueType {
    Text = "Text",
    Number = "Number",
    DateTime = "DateTime", // yyyy-MM-ddTHH:mm:ss
    Date = "Date",
    Lookup = "Lookup",  // === LookupValue
    LookupId = "LookupId",
    LookupValue = "LookupValue",
    Boolean = "Boolean",
    Integer = "Integer",
    Url = "Url", // 检查
    FSObjType = "FSObjType", //文件夹
    GUID = "Text"
}

/** 标签选项 */
export enum Tag {
    Aggregations = "Aggregations",
    Field = "Field",
    FieldRef = "FieldRef",
    Join = "Join",
    Joins = "Joins",
    Values = "Values",
    Value = "Value",
    And = "And",
    Or = "Or",
    OrderBy = "OrderBy",
    ViewFields = "ViewFields",
    RowLimit = "RowLimit",
    View = "View",
    Query = "Query",
    Where = "Where",
    GroupBy = "GroupBy",
    ProjectedFields = "ProjectedFields",
    Eq = "Eq",
    Lt = "Lt",
    Gt = "Gt",
    Geq = "Geq",
    Leq = "Leq",
    In = "In",
    Neq = "Neq",
    Contains = "Contains",
    BeginsWith = "BeginsWith",
    IsNull = "IsNull",
    IsNotNull = "IsNotNull",
    DateRangesOverlap = "DateRangesOverlap",
}

/** 处理函数选项 */
export enum Aggregations {
    Count = "COUNT", // 计数
    Average = "AVG", // 取平均值
    Maximum = "MAX", // 取最大值
    Minimum = "MIN", // 最小值
    Sum = "SUM", // 总计
    StdDeviation = "STDEV", // 开方?
    Variance = "VAR"
}

/** 范围选项 */
export enum Scope {
    FilesOnly = "FilesOnly",
    Recursive = "Recursive",
    RecursiveAll = "RecursiveAll"
}

export const Value = {
    None = "",
    Boolean = {
        True = "True",
        False = "False"
    }
}

export as namespace CamlEnum;
