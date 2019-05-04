import XmlBuilder from "../xml/index";
import {
    TagType
} from "../builder/enum";

'use strict';
class CamlInfo {
    /** @constructor 
     * caml数据存储对象
     * @param {CamllInfo} camllInfo
     */
    constructor(camlInfo = undefined) {
        if (camlInfo) {
            this.Condition = camlInfo.Condition;
            this.Count = camlInfo.Count;
            this.Orderby = camlInfo.Orderby;
            this.RowLimit = camlInfo.RowLimit;
            this.ViewFields = camlInfo.ViewFields;
            this.GroupBy = camlInfo.GroupBy;
            this.ProjectedFields = camlInfo.ProjectedFields;
            this.Joins = camlInfo.Joins;
            this.Aggregations = camlInfo.Aggregations;
            this.FolderStr = camlInfo.FolderStr;
            this.View = camlInfo.View;
        } else {
            this.Condition = "";
            this.Count = 0;
            this.Orderby = "";
            this.RowLimit = "";
            this.ViewFields = "";
            this.GroupBy = "";
            this.ProjectedFields = "";
            this.Joins = "";
            this.Aggregations = "";
            this.FolderStr = "";
            this.View = new XmlBuilder(TagType.View, "", "");
        }
    }

    /**增加嵌套层数 */
    AddCount(count = 0) {
        if (count > 0) {
            this.Count += count;
        } else {
            this.Count++;
        }

        if (this.Count > CamlInfo.Options.MaxNested) {
            throw Error(CamlInfo.ErrorType.NestedLimit);
        }
    }
}

/** 限制选项 */
CamlInfo.Options = {
    MaxIn: 500,
    MaxNested: 160
}

/**错误类型和信息 */
CamlInfo.ErrorType = {
    NestedLimit: `Error, Number of nesting layers is over ${CamlInfo.Options.MaxNested}`
}


export default CamlInfo;