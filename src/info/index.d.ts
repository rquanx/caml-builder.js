import XmlBuilder from "../xml";
declare namespace CamlBuilder {
    class CamlInfo {
        constructor(camlInfo?: CamlInfo);
        Condition: any;
        Count: number;
        Orderby: XmlBuilder;
        RowLimit: XmlBuilder;
        View: XmlBuilder;
        ViewFields: XmlBuilder;
        GroupBy: XmlBuilder;
        ProjectedFields: XmlBuilder;
        Joins: XmlBuilder;
        Aggregations: XmlBuilder;
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
}
export default CamlBuilder.CamlInfo;