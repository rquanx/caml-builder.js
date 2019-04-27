declare namespace XmlBuilder {
    class XmlBuilder {
        /**
         * 
         * @param tagName 标签名
         * @param property 标签属性
         * @param children 子元素内容
         */
        constructor(tagName: string, property: Object, children: any): XmlBuilder.XmlBuilder;

        /**
        * 创建xml标签
        */
        CreateElement(): string;

        /**
         * 创建xml标签
         * @param  tagName  标签名
         * @param  property  标签属性
         * @param  children     子内容
         */
        static CreateElement(tagName: string, property: string | Object, children: string): string;

        /**
         * 拼接属性字符串
         * @param  property
         */
        static renderProps(property: string | Object): string;

        /**
        * 拼接子元素字符串
        * @param children
        */
        static renderChildren(children: any): string;


        /**
         * 普通标签
         * @param tagName 
         * @param propertyStr
         * @param childrenStr
         */
        static Tag(tagName: string, propertyStr: string, childrenStr: string): string;

        /**
         * 自闭标签
         * @param  tagName 
         * @param propertyStr
         */
        static AutoCloseTag(tagName: string, propertyStr: string): string;

        /**
         * 标签属性
         * @param  key 
         * @param  value 
         */
        static Value(key: string, value: string);
    }
}

declare namespace CamlXmlBuilder {
    class CamlXmlBuilder {
        constructor();

        CamlXmlInfo: CamlXmlBuilder.CamlXmlInfo;

        /** 逻辑选项 */
        static LogicType: {
            And: "And",
            Or: "Or"
        }

        /**
         * 筛选关系
         */
        static RelationType: {
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
        };

        /**
         * 值类型
         */
        static ValueType: {
            Text: "Text",
            Number: "Number",
            DateTime: "DateTime", // yyyy-MM-ddTHH:mm:ss
            Date: "Date",
            LookupId: "LookupId",
            LookupValue: "LookupValue",
            Integer: "Integer",
            Url: "Url", // 检查
            FSObjType: "FSObjType", //文件夹
            Boolean: "Boolean",
            Membership: "Membership"
        };

        /**
         * 可用的标签类型
         */
        static TagType: {
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

        /**
        * Aggregations选项
        */
        static AggregationsType: {
            Count: "COUNT", // 计数
            Average: "AVG", // 取平均值
            Maximum: "MAX", // 取最大值
            Minimum: "MIN", // 最小值
            Sum: "SUM", // 总计
            StdDeviation: "STDEV", // 开方?
            Variance: "VAR"
        };

        /**
         * scope选项
         */
        static ScopeType: {
            FilesOnly: "FilesOnly",
            Recursive: "Recursive",
            RecursiveAll: "RecursiveAll"
        }

        /**
         * 返回一个内容完全相同的全新caml对象
         * @param caml 
         */
        static Copy(caml: CamlXmlBuilder): CamlXmlBuilder;

        /**
         * 创建纯表达式的caml，用于合并
         */
        static Express(): CamlXmlBuilder;

        /**
         * 根据值的关系进行值标签生成的选择
         * @param  relation 
         * @param  valueType  
         * @param  value     
         */
        static Value(relation: string, valueType: string, value: string): string;

        /**
         * 根据值类型返回值标签的字符串
         * @param  valueType 
         * @param  value 
         */
        static CaseValueType(valueType: string, value: string): string;

        /**
         * 将全部的camlList用logic合并起来,两两进行递归合并
         * @param  logic
         * @param  camlList
         */
        static MergeList(logic: string, camlList: CamlXmlBuilder[]): CamlXmlBuilder;

        /**
         * 将两个caml合并
         * <logic> c1 + c2 </logic>
         * @param  logic
         * @param  camlFirst
         * @param  camlSecond
         */
        static Merge(logic: string, camlFirst: CamlXmlBuilder, camlSecond: CamlXmlBuilder): CamlXmlBuilder;

        /**
         * 最外层增加一个And条件
         * <And><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </And>
         * 传入数组会使用<In></In>处理 
         * @param  relation   Eq,Neq,Leq,Geq,Contains,In....
         * @param  fieldName 字段内部名称
         * @param  valueType Text,LookupId,LookupValue,DateTime,Date
         * @param  value 可以是数组或字符串
         */
        And(relation: string, fieldName: string, valueType: string, value: string | number | string[] | number[]): CamlXmlBuilder;

        /**
         * 最外层增加一个Or条件
         * <Or><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </Or>
         * 传入数组会使用<In></In>处理 
         * @param  relation   Eq,Neq,Leq,Geq,Contains,In....
         * @param  fieldName 字段内部名称
         * @param  valueType Text,LookupId,LookupValue,DateTime,Date
         * @param  value 可以是数组或字符串
         */
        Or(relation: string, fieldName: string, valueType: string, value: string | number | string[] | number[]): CamlXmlBuilder;

        /**
         * 设置排序,不设置按默认排序,
         * @param  orderByList
         */
        OrderBy(orderByList: CamlXmlBuilder.IOrderBy[]): CamlXmlBuilder;

        /**
         * 设置搜索范围,不设置默认搜索最顶层
         * @param  scope 
         */
        Scope(scope?: string): CamlXmlBuilder;

        /**
         * 设置搜索条数,不设置默认搜索100条,搜索全部设置为0
         * @param  rowLimit 
         */
        RowLimit(rowLimit?: number | string): CamlXmlBuilder;

        /**
         *结束caml 
         */
        End(): CamlXmlBuilder;


        /**
         * 输出caml字符串
         * @return  caml字符串
         */
        ToString(): string;

        /**
         * 清空条件设置
         */
        Clear(): CamlXmlBuilder;

        /**
         * 合并两个caml对象 "<logic> ConditionStr + camlStr</logic>"
         * @param  logic And/Or 
         * @param  caml caml对象或string没有end的
         */
        Merge(logic: string, caml: CamlXmlBuilder | XmlBuilder.XmlBuilder | string): CamlXmlBuilder;

        /**
         * 合并两个caml对象 "<logic> ConditionStr + camlStr</logic>"
         * @param  collapse   是否聚合,聚合时按分组返回部分相关数据，不聚合时按item项返回全部字段数据，配合ViewFields可以限制返回的字段,
         * @param  groupLimit 返回的试图Row数量
         * @param  fieldName     分组字段
         */
        GroupBy(collapse: boolean, groupLimit: number, fieldName: string): CamlXmlBuilder;


        /**
         * 设置返回的字段
         * @param  fieldNames 
         */
        ViewFields(fieldNames: string | string[]): CamlXmlBuilder;

        /**
         * 待完善
         * @param  type 
         * @param  listAlias 
         * @param  field 
         * @param  showField 
         * @param  fieldName 
         */
        Joins(type: string, listAlias: string, field: string, showField: string, fieldName: string): CamlXmlBuilder;

        /**
         * 对字段进行函数计算，返回 field.[type.agg] => 当前分组的函数计算值   field.[type] => 总的值
         * @param  aggregationList  field应用的列, type引用的函数
         */
        Aggregations(aggregationList: CamlXmlBuilder.IAggregationType[]): CamlXmlBuilder;

        /** 
         * 设置路径
         * @param  folderPath  文件夹相对路径，
         * 顶层站点 /list/folder
         * 子站点/site/list/folder
         */
        SetFolder(folderPath: string): string;

        /** 
         * 读取文件夹路径
         */
        GetFolder(): string;

    }

    /**
     * caml数据存储对象
     */
    class CamlXmlInfo {
        constructor(camlXmlInfo?: CamlXmlInfo);
        Condition: any;
        Count: number;
        Orderby: XmlBuilder.XmlBuilder;
        RowLimit: XmlBuilder.XmlBuilder;
        View: XmlBuilder.XmlBuilder;
        ViewFields: XmlBuilder.XmlBuilder;
        GroupBy: XmlBuilder.XmlBuilder;
        ProjectedFields: XmlBuilder.XmlBuilder;
        Joins: XmlBuilder.XmlBuilder;
        Aggregations: XmlBuilder.XmlBuilder;
        FolderStr: string;

        /** 限制选项 */
        static Options: {
            MaxIn: 500,
            MaxNested: 160
        };

        /**错误类型和信息 */
        static ErrorType: {
            NestedLimit: "Error, Number of nesting layers is over 160"
        }

        /**
         * 嵌套层数计数
         * @param count 嵌套层数
         */
        AddCount(count?: number);
    }



    interface IAggregationType {
        field: string, type: string
    }

    interface IOrderBy {
        field: string,
        ascend: boolean,
    }

    interface IProperty {
        [field: string]: string;
    }

    interface ITag {
        tagName: string,
        property: IProperty,
        children: string | IProperty | IProperty[]
    }

    enum Logic {
        And = "And",
        Or = "Or"
    }
}
export default CamlXmlBuilder.CamlXmlBuilder;