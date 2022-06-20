import XmlBuilder from "../xml/index";
import { Tag } from "../builder/enum";

export class CamlInfo {
  condition: string;
  count: number;
  orderby: string;
  rowLimit?: number;
  viewFields: string;
  groupBy: string;
  projectedFields: string;
  joins: string;
  aggregations: string;
  folderStr: string;
  view: XmlBuilder;

  static maxNested = 160;
  static maxIn = 500

  constructor(camlInfo?: CamlInfo) {
    this.condition = camlInfo?.condition ?? "";
    this.count = camlInfo?.count ?? 0;
    this.orderby = camlInfo?.orderby ?? "";
    this.rowLimit = camlInfo?.rowLimit;
    this.viewFields = camlInfo?.viewFields ?? "";
    this.groupBy = camlInfo?.groupBy ?? "";
    this.projectedFields = camlInfo?.projectedFields ?? "";
    this.joins = camlInfo?.joins ?? "";
    this.aggregations = camlInfo?.aggregations ?? "";
    this.folderStr = camlInfo?.folderStr ?? "";
    this.view = camlInfo?.view ?? new XmlBuilder(Tag.View, "", "");
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
