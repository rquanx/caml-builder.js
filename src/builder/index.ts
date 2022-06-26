import { ValueTypeKey, ValueTypeValue } from './enum/value-type';
import XmlBuilder, { renderChildren } from "../xml";
import CamlInfo from "../info";
import { Value, ValueType, Logic, Relation, Scope, Tag, RelationKey, LogicKey, ScopeKey } from "./enum";
import AggregationsModal from "../modal/Aggregations";
import { dateToString } from "../utils";
import { AggregationData, Order, Property, ValueTypeMap } from "./type";
export class CamlBuilder {
  camlInfo: CamlInfo;
  constructor() {
    this.camlInfo = new CamlInfo()
  }

  /**
   * 返回一个内容完全相同的全新caml对象
   */
  static copy(caml: CamlBuilder) {
    let newCaml = CamlBuilder.express();
    newCaml.camlInfo = new CamlInfo(caml.camlInfo);
    return newCaml;
  };

  static express() {
    return new CamlBuilder();
  };


  /**
   * 根据值的关系进行值标签生成的选择
   */
  static value<R extends string = RelationKey, V extends string = ValueTypeKey>(relation: R, valueType: V, value: ValueTypeMap[V] | ValueTypeMap[V][]): Value | XmlBuilder | XmlBuilder[] {
    const v = (Array.isArray(value) ? value : [value])
    const caseValues = v.map(v => CamlBuilder.caseValueType(valueType, v))
    let calcValue: Partial<Record<RelationKey, () => XmlBuilder[] | XmlBuilder | string>> & {
      default: () => XmlBuilder[] | XmlBuilder | string
    } = {
      [Relation.In]: () =>
        XmlBuilder.create(
          Tag.Values,
          Value.None,
          caseValues
        ),
      [Relation.IsNotNull]: () => Value.None,
      [Relation.IsNull]: () => Value.None,
      default: () => caseValues
    };

    return calcValue.hasOwnProperty(relation)
      ? calcValue[relation as keyof typeof caseValues]()
      : calcValue.default();
  };

  /**
   * 根据值类型返回值标签的字符串
   */
  static caseValueType<V extends string = ValueTypeValue>(valueType: V, value: any) {
    let property: Property<V | ValueTypeValue> = {
      Type: valueType,
    };
    switch (valueType) {
      case ValueType.DateTime: {
        property.IncludeTimeValue = Value.True;
        if (typeof value === "object") {
          if (value instanceof Date) {
            value = dateToString(value);
          }
          else {
            console.warn("DateTime value type only support Date object");
          }
        }
        break;
      }
      case ValueType.Date: {
        property.Type = ValueType.DateTime;
        if (typeof value === "object") {
          value = dateToString(value);
        }
        break;
      }
      case ValueType.Boolean: {
        if (typeof value === "string") {
          value = value.toLowerCase() === Value.True.toLowerCase() ? 1 : 0;
        }
        else {
          value = Number(value) ? 1 : 0;
        }
        break;
      }
      case ValueType.LookupId: {
        property.Type = ValueType.Integer;
        if (typeof value === "object") {
          if (value.id) {
            value = value.id;
          } else if (value.get_lookupId) {
            value = value.get_lookupId();
          }
          else {
            throw (`${value} lookupid is not defined`);
          }
        }
        break;
      }
      case ValueType.LookupValue: {
        property.Type = ValueType.Text;
        if (typeof value === "object") {
          if (value.value) {
            value = value.value;
          } else if (value.get_lookupId) {
            value = value.get_lookupValue();
          }
          else {
            throw (`${value} lookupvalue is not defined`);
          }
        }
        break;
      }
      default: {
        break;
      }
    }

    return XmlBuilder.create(Tag.Value, property, value);
  };

  /**
   * 将全部的camlList用logic合并起来,两两进行递归合并
   */
  static mergeList<L extends string = LogicKey>(logic: L, camlList: CamlBuilder[]): CamlBuilder {
    let newCamlList: CamlBuilder[] = [];
    for (let i = 0; i < camlList.length - 1; i += 2) {
      newCamlList.push(CamlBuilder.staticMerge(logic, camlList[i], camlList[i + 1]));
    }
    if (camlList.length % 2 !== 0) {
      newCamlList.push(camlList[camlList.length - 1]);
    }

    return newCamlList.length > 1
      ? CamlBuilder.mergeList(logic, newCamlList)
      : newCamlList.length > 0
        ? newCamlList[0]
        : CamlBuilder.express();
  };

  /**
   * 将两个caml合并
   * <logic> c1 + c2 </logic>
   */
  static staticMerge<L extends string = LogicKey>(logic: L, camlFirst: CamlBuilder, camlSecond: CamlBuilder) {
    let first = camlFirst.camlInfo;
    let second = camlSecond.camlInfo;
    let tag: string = logic;
    let count = 1;
    if (first.condition && second.condition) {
      count +=
        first.count > second.count
          ? first.count
          : second.count;
    } else if (first.condition || second.condition) {
      tag = Value.None;
      count += first.count + second.count;
    }

    let caml = CamlBuilder.express();
    caml.camlInfo.condition = XmlBuilder.create(tag, Value.None, [
      first.condition,
      second.condition
    ]);
    caml.camlInfo.nest(count);
    return caml;
  };

  /**
   * 最外层增加一个And条件
   * <And><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </And>
   * 传入数组会使用<In></In>处理
   * @param relation   Eq,Neq,Leq,Geq,Contains,In....
   * @param fieldName 字段内部名称
   * @param valueType Text,LookupId,LookupValue,DateTime,Date
   * @param value 可以是数组或字符串
   */
  and<R extends string = RelationKey, V extends string = ValueTypeKey>(relation: R, fieldName: string, valueType: V, value: ValueTypeMap[V] | ValueTypeMap[V][]): CamlBuilder {
    let property: Property = {
      Name: fieldName
    };

    if (valueType === ValueType.LookupId) {
      property.LookupId = Value.True;
    }

    let fieldRef = XmlBuilder.create(
      Tag.FieldRef,
      property,
      Value.None
    );

    if (relation === Relation.In) {
      let camlList: CamlBuilder[] = [];
      for (let i = 0; i < value.length; i += CamlInfo.maxIn) {
        let valueList = value.slice(i, i + CamlInfo.maxIn);
        let camlValue = CamlBuilder.value(relation, valueType, valueList);
        let xml = XmlBuilder.create(relation, Value.None, [
          fieldRef,
          camlValue as XmlBuilder
        ]);
        camlList.push(CamlBuilder.express().merge(Logic.Or, xml));
      }
      this.merge(
        Logic.And,
        CamlBuilder.mergeList(Logic.Or, camlList)
      );
    } else {
      let xml = XmlBuilder.create(relation, Value.None, [
        fieldRef,
        CamlBuilder.value(relation, valueType, value) as XmlBuilder
      ]);
      let child = [this.camlInfo.condition, xml];

      this.camlInfo.condition = XmlBuilder.create(
        Value.None,
        Value.None,
        child
      );
      if (this.camlInfo.count >= 1) {
        this.camlInfo.condition = XmlBuilder.create(
          Tag.And,
          Value.None,
          this.camlInfo.condition
        );
      }
    }
    this.camlInfo.nest();
    return this;
  };

  /**
   * 最外层增加一个Or条件
   * <Or><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </Or>
   * 传入数组会使用<In></In>处理
   * @param relation   Eq,Neq,Leq,Geq,Contains,In....
   * @param fieldName 字段内部名称
   * @param valueType Text,LookupId,LookupValue,DateTime,Date
   * @param value 可以是数组或字符串
   */
  or<R extends string = RelationKey, V extends string = ValueTypeKey>(relation: R, fieldName: string, valueType: V, value: ValueTypeMap[V] | ValueTypeMap[V][]) {
    let property: Property = {
      Name: fieldName
    };

    if (valueType === ValueType.LookupId) {
      property.LookupId = Value.True;
    }
    let fieldRef = XmlBuilder.create(
      Tag.FieldRef,
      property,
      Value.None
    );
    if (relation === Relation.In) {
      let camlList: CamlBuilder[] = [];
      for (let i = 0; i < value.length; i += CamlInfo.maxIn) {
        let valueList = value.slice(i, i + CamlInfo.maxIn);
        let camlValue = CamlBuilder.value(relation, valueType, valueList) as XmlBuilder;
        let xml = XmlBuilder.create(relation, Value.None, [
          fieldRef,
          camlValue
        ]);
        camlList.push(CamlBuilder.express().merge(Logic.Or, xml));
      }
      this.merge(
        Logic.Or,
        CamlBuilder.mergeList(Logic.Or, camlList)
      );
    } else if (Array.isArray(value)) {
      let camlList = value.map(v =>
        CamlBuilder.express().or(relation, fieldName, valueType, v)
      );
      this.merge(
        Logic.Or,
        CamlBuilder.mergeList(Logic.Or, camlList)
      );
    } else {
      this.camlInfo.condition = XmlBuilder.create(
        Value.None,
        Value.None,
        [
          this.camlInfo.condition,
          XmlBuilder.create(relation, Value.None, [
            fieldRef,
            CamlBuilder.value(relation, valueType, value) as XmlBuilder
          ])
        ]
      );
      if (this.camlInfo.count >= 1) {
        this.camlInfo.condition = XmlBuilder.create(
          Tag.Or,
          Value.None,
          this.camlInfo.condition
        );
      }
    }
    this.camlInfo.nest();
    return this;
  };

  /**
   * 设置排序,不设置按默认排序,
   * false 从小到大倒序
   * @param orderByList
   */
  orderBy(orderByList: Order[]) {
    let orderByArray = orderByList.map(item =>
      XmlBuilder.create(
        Tag.FieldRef,
        {
          Name: item.field,
          Ascending: item.ascend
            ? Value.True
            : Value.False
        },
        Value.None
      )
    );
    this.camlInfo.orderby = XmlBuilder.create(
      Tag.OrderBy,
      Value.None,
      orderByArray
    );
    return this;
  };

  /**
   * 设置搜索范围,默认值设置为RecursiveAll，不调用此函数为默认搜索最顶层
   */
  scope(scope: ScopeKey = Scope.RecursiveAll) {
    this.camlInfo.view.property = {
      Scope: scope
    };
    return this;
  };

  /**
   * 设置搜索条数,不调用此函数默认搜索100条,搜索全部设置为0，参数默认为0
   */
  rowLimit(rowLimit = 0) {
    this.camlInfo.rowLimit = XmlBuilder.create(
      Tag.RowLimit,
      Value.None,
      rowLimit
    );
    return this;
  };

  /**
   * 结束caml拼接，追加Query、Where、View...
   */
  end() {
    let where = XmlBuilder.create(
      Tag.Where,
      Value.None,
      this.camlInfo.condition
    );
    let queryChildren = [where, this.camlInfo.groupBy, this.camlInfo.orderby];

    let query = XmlBuilder.create(
      Tag.Query,
      Value.None,
      queryChildren
    );

    let join = this.camlInfo.joins
      ? XmlBuilder.create(
        Tag.Joins,
        Value.None,
        this.camlInfo.joins
      )
      : this.camlInfo.joins;

    let projectedFields = (this.camlInfo.projectedFields = this.camlInfo.projectedFields
      ? [XmlBuilder.create(
        Tag.ProjectedFields,
        Value.None,
        this.camlInfo.projectedFields
      )]
      : this.camlInfo.projectedFields);
    this.camlInfo.view.children = [
      this.camlInfo.viewFields,
      this.camlInfo.aggregations,
      query,
      join,
      projectedFields,
      this.camlInfo.rowLimit
    ];

    this.camlInfo.condition = this.camlInfo.view;
    return this;
  };

  /**
   * 输出caml字符串
   */
  toString() {
    return typeof this.camlInfo.condition !== "string"
      ? this.camlInfo.condition.toString()
      : renderChildren(this.camlInfo.condition);
  };

  /**
   * 清空条件设置
   */
  clear() {
    this.camlInfo = new CamlInfo();
    return this;
  };

  /**
   * 合并两个caml对象 "<logic> Condition + camlStr</logic>"
   * @param logic And/Or
   * @param caml caml对象或string没有end的
   */
  merge<L extends string = LogicKey>(logic: L, caml: string | CamlBuilder | XmlBuilder) {
    let camlStr: string = Value.None;
    let count = 0;
    if (typeof caml === "string") {
      camlStr = caml;
    } else if (caml instanceof CamlBuilder) {
      camlStr = caml.camlInfo.condition.toString();
      count = caml.camlInfo.count;
    }
    else {
      camlStr = caml.toString();
    }
    if (camlStr) {
      this.camlInfo.nest(count);
      if (this.camlInfo.condition) {
        this.camlInfo.condition = XmlBuilder.create(logic, Value.None, [
          this.camlInfo.condition,
          camlStr
        ]);
      } else {
        this.camlInfo.condition = XmlBuilder.create(
          Value.None,
          Value.None,
          [camlStr]
        );
      }
    }

    return this;
  };

  /**
   * 需要使用 RenderListData api
   * @param collapse   是否聚合,聚合时按分组返回部分相关数据，不聚合时按item项返回全部字段数据，配合ViewFields可以限制返回的字段,
   * @param groupLimit 返回的视图Row数量
   * @param fieldName     分组字段
   */
  groupBy(collapse: boolean, groupLimit: number, fieldName: string) {
    let fieldRef = XmlBuilder.create(Tag.FieldRef, {
      Name: fieldName
    });

    this.camlInfo.groupBy = XmlBuilder.create(
      Tag.GroupBy,
      {
        Collapse: collapse.toString(),
        GroupLimit: groupLimit
      },
      fieldRef
    );
    return this;
  };

  /**
   * 设置返回的字段
   * @param  fieldNames
   */
  viewFields(fieldNames: string | string[]) {
    let viewFields;
    if (Array.isArray(fieldNames)) {
      viewFields = fieldNames.map(item =>
        XmlBuilder.create(
          Tag.FieldRef,
          {
            Name: item
          },
          Value.None
        )
      );
    } else {
      viewFields = XmlBuilder.create(
        Tag.FieldRef,
        {
          Name: fieldNames
        },
        Value.None
      );
    }

    this.camlInfo.viewFields = XmlBuilder.create(
      Tag.ViewFields,
      Value.None,
      viewFields
    );
    return this;
  };

  /**
   * TODO:
   * 待完善
   */
  joins(
    type: string,
    listAlias: string,
    field: string,
    showField: string,
    fieldName: string
  ) {
    let fieldList = [
      XmlBuilder.create(
        Tag.FieldRef,
        {
          Name: field,
          RefType: "ID"
        },
        Value.None
      ),
      XmlBuilder.create(
        Tag.FieldRef,
        {
          Name: "ID",
          List: listAlias
        },
        Value.None
      )
    ];

    let eq = XmlBuilder.create(Tag.Eq, Value.None, fieldList);

    if (!this.camlInfo.joins) {
      this.camlInfo.joins = [];
    }
    this.camlInfo.joins.push(
      XmlBuilder.create(
        Tag.Join,
        {
          Type: type,
          ListAlias: listAlias
        },
        eq
      )
    );

    if (this.camlInfo.projectedFields) {
      this.camlInfo.projectedFields = [];
    }
    // this.camlInfo.projectedFields.push(
    //   projectedFields(showField, fieldName, listAlias)
    // );

    /**
     * 待完善
     */
    function projectedFields(fieldName: string, name: string, listName: string) {
      // <Field ShowField="titel111" Type="Lookup" Name="test1" List="test1" />
      let projectedFields = XmlBuilder.create(Tag.Field, {
        Name: name,
        ShowField: fieldName,
        Type: "Lookup",
        List: listName
      });

      return projectedFields;
    }
    return this;
  };

  /**
   * 需要使用 RenderListData api
   * 对字段进行函数计算，返回 field.[type.agg] => 当前分组的函数计算值   field.[type] => 总的值
   * @param aggregationList  field应用的列, type引用的函数
   */
  aggregations(aggregationList: AggregationData[]) {
    let childrenList = aggregationList.map(item => {
      let aggregation = new AggregationsModal(item.field, item.type);
      return XmlBuilder.create(
        Tag.FieldRef,
        aggregation as any,
        Value.None
      );
    });

    this.camlInfo.aggregations = XmlBuilder.create(
      Tag.Aggregations,
      {
        Value: "On"
      },
      childrenList
    );

    return this;
  };

  /**
   * 设置路径
   * @param folderPath  文件夹相对路径，
   * 顶层站点 /list/folder
   * 子站点/site/list/folder
   */
  setFolder(folderPath: `/${string}`) {
    this.camlInfo.folderStr = folderPath;
    return this;
  };

  /**
   * 读取文件夹路径
   */
  getFolder() {
    return this.camlInfo.folderStr;
  };
}
export default CamlBuilder;
