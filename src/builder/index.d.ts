import CamlInfo from "../info";
class CamlBuilder {
    constructor();

    CamlInfo: CamlInfo;

    /**
     * 返回一个内容完全相同的全新caml对象
     * @param caml 
     */
    static Copy(caml: CamlBuilder): CamlBuilder;

    /**
     * 创建纯表达式的caml，用于合并
     */
    static Express(): CamlBuilder;

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
    static MergeList(logic: string, camlList: CamlBuilder[]): CamlBuilder;

    /**
     * 将两个caml合并
     * <logic> c1 + c2 </logic>
     * @param  logic
     * @param  camlFirst
     * @param  camlSecond
     */
    static Merge(logic: string, camlFirst: CamlBuilder, camlSecond: CamlBuilder): CamlBuilder;

    /**
     * 最外层增加一个And条件
     * <And><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </And>
     * 传入数组会使用<In></In>处理
     * @param  relation   Eq,Neq,Leq,Geq,Contains
     * @param  fieldName 字段内部名称
     * @param  valueType Text,LookupId,LookupValue
     * @param  value 可以是数组或字符串
     */
    And(relation: string, fieldName: string, valueType: string, value: string | number | string[] | number[]): CamlBuilder;

    /**
     * 最外层增加一个Or条件
     * <Or><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </Or>
     * 传入数组会使用<In></In>处理
     * @param  relation   Eq,Neq,Leq,Geq,Contains
     * @param  fieldName 字段内部名称
     * @param  valueType Text,LookupId,LookupValue
     * @param  value 可以是数组或字符串
     */
    Or(relation: string, fieldName: string, valueType: string, value: string | number | string[] | number[]): CamlBuilder;

    /**
     * 设置排序,不设置按默认排序,
     * @param  orderByList
     */
    OrderBy(orderByList: CamlBuilder.IOrderBy[]): CamlBuilder;

    /**
     * 设置搜索范围,不设置默认搜索最顶层
     * @param  scope 
     */
    Scope(scope?: string): CamlBuilder;

    /**
     * 设置搜索条数,不设置默认搜索100条,搜索全部设置为0
     * @param  rowLimit 
     */
    RowLimit(rowLimit?: number | string): CamlBuilder;

    /**
     *结束caml 
     */
    End(): CamlBuilder;


    /**
     * 输出caml字符串
     * @return  caml字符串
     */
    ToString(): string;

    /**
     * 清空条件设置
     */
    Clear(): CamlBuilder;

    /**
     * 合并两个caml对象 "<logic> ConditionStr + camlStr</logic>"
     * @param  logic And/Or 
     * @param  caml caml对象或string没有end的
     */
    Merge(logic: string, caml: CamlBuilder | string): CamlBuilder;

    /**
     * 合并两个caml对象 "<logic> ConditionStr + camlStr</logic>"
     * @param  collapse   是否聚合,聚合时按分组返回部分相关数据，不聚合时按item项返回全部字段数据，配合ViewFields可以限制返回的字段,
     * @param  groupLimit 返回的试图Row数量
     * @param  fieldName     分组字段
     */
    GroupBy(collapse: boolean, groupLimit: number, fieldName: string): CamlBuilder;


    /**
     * 设置返回的字段
     * @param  fieldNames 
     */
    ViewFields(fieldNames: string | string[]): CamlBuilder;

    /**
     * 待完善
     * @param  type 
     * @param  listAlias 
     * @param  field 
     * @param  showField 
     * @param  fieldName 
     */
    Joins(type: string, listAlias: string, field: string, showField: string, fieldName: string): CamlBuilder;

    /**
     * 对字段进行函数计算，返回 field.[type.agg] => 当前分组的函数计算值   field.[type] => 总的值
     * @param  aggregationList  field应用的列, type引用的函数
     */
    Aggregations(aggregationList: CamlBuilder.IAggregationType[]): CamlBuilder;

    /** 
     * 设置路径
     * @param  folderPath  文件夹相对路径，
     * 顶层站点 /list/folder
     * 子站点/site/list/folder
     */
    SetFolder(folderPath: string);

    /** 
     * 读取文件夹路径
     */
    GetFolder();

}
export default CamlBuilder;