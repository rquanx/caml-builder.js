import XmlBuilder from "../xml/index";
import { Tag } from "../builder/enum";

export class CamlInfo {
  condition: string | XmlBuilder;
  count: number;
  orderby?: XmlBuilder;
  rowLimit?: XmlBuilder;
  viewFields?: XmlBuilder;
  groupBy?: XmlBuilder;
  projectedFields: XmlBuilder[];
  joins: XmlBuilder[];
  aggregations?: XmlBuilder;
  folderStr: string;
  view: XmlBuilder;

  static maxNested = 160;
  static maxIn = 500

  constructor(info?: CamlInfo) {
    this.condition = info?.condition ?? "";
    this.count = info?.count ?? 0;
    this.orderby = info?.orderby;
    this.rowLimit = info?.rowLimit;
    this.viewFields = info?.viewFields;
    this.groupBy = info?.groupBy;
    this.projectedFields = info?.projectedFields ?? [];
    this.joins = info?.joins ?? [];
    this.aggregations = info?.aggregations;
    this.folderStr = info?.folderStr ?? "";
    this.view = info?.view ?? new XmlBuilder(Tag.View, "", "");
  }

  /**增加嵌套层数 */
  nest(count = 0) {
    this.count += count > 0 ? count : 1;
    if (this.count > CamlInfo.maxNested) {
      throw `Error, Number of nesting layers is over ${CamlInfo.maxNested}`;
    }
  }
}


export default CamlInfo;
