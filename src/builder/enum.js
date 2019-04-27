let CamlEnum = {};

/** 逻辑选项 */
CamlEnum.LogicType = {
    And: "And",
    Or: "Or"
}

/** 关系选项 */
CamlEnum.RelationType = {
    In: "In",
    Eq: "Eq",
    Gt: "Gt",
    Lt: "Lt",
    Geq: "Geq",
    Leq: "Leq",
    Neq: "Neq",
    Contains: "Contains",
    BeginsWith: "BeginsWith",
    IsNull: "IsNull",
    IsNotNull: "IsNotNull",
    DateRangesOverlap: "DateRangesOverlap",

    Includes: "Includes",
    NotIncludes: "NotIncludes",
    /**
     * 查阅项数组使用？ 
     *  <Includes>
            <FieldRef    Name = "Field_Name"/>
            <Value    Type = "Field_Type"/>
            <XML />
        </Includes> 
    */

    Membership: "Membership"
};

/** 数据类型选项 */
CamlEnum.ValueType = {
    Text: "Text",
    Number: "Number",
    DateTime: "DateTime", // yyyy-MM-ddTHH:mm:ss
    Date: "Date",
    Lookup: "Lookup", // === LookupValue
    LookupId: "LookupId",
    MultipleLookupId: "LookupId", // 多选的lookupId,跟普通lookupId一样，使用Eq即可
    LookupValue: "LookupValue",
    MultipleLookupValue: "LookupValue", // 待验证
    Boolean: "Boolean",
    Integer: "Integer",
    Url: "Url", // 检查
    FSObjType: "FSObjType", //文件夹
    GUID: "Text" // GUID查询当普通Text查询即可
};

/** 标签选项 */
CamlEnum.TagType = {
    Aggregations: "Aggregations",
    Field: "Field",
    FieldRef: "FieldRef",
    Join: "Join",
    Joins: "Joins",
    Values: "Values",
    Value: "Value",
    And: "And",
    Or: "Or",
    OrderBy: "OrderBy",
    ViewFields: "ViewFields",
    RowLimit: "RowLimit",
    View: "View",
    Query: "Query",
    Where: "Where",
    GroupBy: "GroupBy",
    ProjectedFields: "ProjectedFields",
    Eq: "Eq",
    Lt: "Lt",
    Gt: "Gt",
    Geq: "Geq",
    Leq: "Leq",
    In: "In",
    Neq: "Neq",
    Contains: "Contains",
    BeginsWith: "BeginsWith",
    IsNull: "IsNull",
    IsNotNull: "IsNotNull",
    DateRangesOverlap: "DateRangesOverlap",
};

/** 处理函数选项 */
CamlEnum.AggregationsType = {
    Count: "COUNT", // 计数
    Average: "AVG", // 取平均值
    Maximum: "MAX", // 取最大值
    Minimum: "MIN", // 最小值
    Sum: "SUM", // 总计
    StdDeviation: "STDEV", // 开方?
    Variance: "VAR"
};

/** 范围选项 */
CamlEnum.ScopeType = {
    FilesOnly: "FilesOnly",
    Recursive: "Recursive",
    RecursiveAll: "RecursiveAll"
}

CamlEnum.Value = {
    None: ""
}

CamlEnum.Boolean = {
    True: "True",
    False: "False"
}

export default CamlEnum;