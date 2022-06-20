import XmlBuilder from "../xml/index";
import CamlInfo from "../info/index";
import CamlEnum from "./enum";
import Aggregations from "../modal/Aggregations";
import { getCamlDateTime } from "../helper/index";

/** @constructor */
let CamlBuilder = function() {
  this.CamlInfo = new CamlInfo();
};

/**
 * 返回一个内容完全相同的全新caml对象
 * @param {CamlBuilder} caml
 */
CamlBuilder.Copy = function(caml) {
  let newCaml = CamlBuilder.Express();
  newCaml.CamlInfo = new CamlInfo(caml.CamlInfo);
  return newCaml;
};

/**
 * new caml
 */
CamlBuilder.Express = function() {
  return new CamlBuilder();
};

/**
 * 根据值的关系进行值标签生成的选择
 * @param {string} relation
 * @param {string} valueType
 * @param {string} value
 */
CamlBuilder.Value = function(relation, valueType, value) {
  let calcValue = {
    [CamlEnum.Relation.In]: () =>
      XmlBuilder.Create(
        CamlEnum.Tag.Values,
        CamlEnum.Value.None,
        value.map(v => CamlBuilder.CaseValueType(valueType, v))
      ),
    [CamlEnum.Relation.IsNotNull]: () => CamlEnum.Value.None,
    [CamlEnum.Relation.IsNull]: () => CamlEnum.Value.None,
    default: () => CamlBuilder.CaseValueType(valueType, value)
  };

  return calcValue.hasOwnProperty(relation)
    ? calcValue[relation]()
    : calcValue.default();
};

/**
 * 根据值类型返回值标签的字符串
 * @param {string} valueType
 * @param {string} value
 */
CamlBuilder.CaseValueType = function(valueType, value) {
  let property = {
    Type: valueType
  };
  switch (valueType) {
    case CamlEnum.ValueType.DateTime: {
      property.IncludeTimeValue = CamlEnum.Value.Boolean.True;
      if (typeof value === "object") {
        value = getCamlDateTime(value);
      }
      break;
    }
    case CamlEnum.ValueType.Date: {
      property.Type = CamlEnum.ValueType.DateTime;
      if (typeof value === "object") {
        value = getCamlDateTime(value);
      }
      break;
    }
    case CamlEnum.ValueType.Boolean: {
      if(typeof value === "string") {
        value = value.toLowerCase() === CamlEnum.Value.Boolean.True.toLowerCase() ? 1 : 0;
      }
      else {
        value = Number(value) ? 1 : 0;
      }
      break;
    }
    case CamlEnum.ValueType.LookupId: {
      property.Type = CamlEnum.ValueType.Integer;
      if (typeof value === "object") {
        if (value.id) {
          value = value.id;
        } else if (value.get_lookupId) {
          value = value.get_lookupId();
        }
        else {
          throw(value,`lookupid is not defined`);
        }
      }
      break;
    }
    case CamlEnum.ValueType.LookupValue: {
      property.Type = CamlEnum.ValueType.Text;
      if (typeof value === "object") {
        if (value.value) {
          value = value.value;
        } else if (value.get_lookupId) {
          value = value.get_lookupValue();
        }
        else {
          throw(value,`lookupvalue is not defined`);
        }
      }
      break;
    }
    default: {
      break;
    }
  }

  return XmlBuilder.Create(CamlEnum.Tag.Value, property, value);
};

/**
 * 将全部的camlList用logic合并起来,两两进行递归合并
 * @param {string} logic
 * @param {CamlBuilder[]} camlList
 */
CamlBuilder.MergeList = function(logic, camlList) {
  let newCamlList = [];
  for (let i = 0; i < camlList.length - 1; i += 2) {
    newCamlList.push(CamlBuilder.Merge(logic, camlList[i], camlList[i + 1]));
  }
  if (camlList.length % 2 !== 0) {
    newCamlList.push(camlList[camlList.length - 1]);
  }

  return newCamlList.length > 1
    ? CamlBuilder.MergeList(logic, newCamlList)
    : newCamlList.length > 0
    ? newCamlList[0]
    : CamlBuilder.Express();
};

/**
 * 将两个caml合并
 * <logic> c1 + c2 </logic>
 * @param {string} logic
 * @param {CamlBuilder} camlFirst
 * @param {CamlBuilder} camlSecond
 */
CamlBuilder.Merge = function(logic, camlFirst, camlSecond) {
  let firstCamlInfo = camlFirst.CamlInfo;
  let secondCamlInfo = camlSecond.CamlInfo;
  let tag = logic;
  let count = 1;
  if (firstCamlInfo.Condition && secondCamlInfo.Condition) {
    count +=
      firstCamlInfo.Count > secondCamlInfo.Count
        ? firstCamlInfo.Count
        : secondCamlInfo.Count;
  } else if (firstCamlInfo.Condition || secondCamlInfo.Condition) {
    tag = CamlEnum.Value.None;
    count += firstCamlInfo.Count + secondCamlInfo.Count;
  }

  let caml = CamlBuilder.Express();
  caml.CamlInfo.Condition = XmlBuilder.Create(tag, CamlEnum.Value.None, [
    firstCamlInfo.Condition,
    secondCamlInfo.Condition
  ]);
  caml.CamlInfo.AddCount(count);
  return caml;
};

/**
 * 最外层增加一个And条件
 * <And><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </And>
 * 传入数组会使用<In></In>处理
 * @param {string} relation   Eq,Neq,Leq,Geq,Contains,In....
 * @param {string} fieldName 字段内部名称
 * @param {string} valueType Text,LookupId,LookupValue,DateTime,Date
 * @param {string | number | string[] | number[]} value 可以是数组或字符串
 */
CamlBuilder.prototype.And = function(relation, fieldName, valueType, value) {
  let property = {
    Name: fieldName
  };

  if (valueType === CamlEnum.ValueType.LookupId) {
    property.LookupId = CamlEnum.Value.Boolean.True;
  }

  let fieldRef = XmlBuilder.Create(
    CamlEnum.Tag.FieldRef,
    property,
    CamlEnum.Value.None
  );

  if (relation === CamlEnum.Relation.In) {
    let camlList = [];
    for (let i = 0; i < value.length; i += CamlInfo.Options.MaxIn) {
      let valueList = value.slice(i, i + CamlInfo.Options.MaxIn);
      let camlValue = CamlBuilder.Value(relation, valueType, valueList);
      let xml = XmlBuilder.Create(relation, CamlEnum.Value.None, [
        fieldRef,
        camlValue
      ]);
      camlList.push(CamlBuilder.Express().Merge(CamlEnum.Logic.Or, xml));
    }
    this.Merge(
      CamlEnum.Logic.And,
      CamlBuilder.MergeList(CamlEnum.Logic.Or, camlList)
    );
  } else {
    let xml = XmlBuilder.Create(relation, CamlEnum.Value.None, [
      fieldRef,
      CamlBuilder.Value(relation, valueType, value)
    ]);
    let child = [this.CamlInfo.Condition, xml];

    this.CamlInfo.Condition = XmlBuilder.Create(
      CamlEnum.Value.None,
      CamlEnum.Value.None,
      child
    );
    if (this.CamlInfo.Count >= 1) {
      this.CamlInfo.Condition = XmlBuilder.Create(
        CamlEnum.Tag.And,
        CamlEnum.Value.None,
        this.CamlInfo.Condition
      );
    }
  }
  this.CamlInfo.AddCount();
  return this;
};

/**
 * 最外层增加一个Or条件
 * <Or><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </Or>
 * 传入数组会使用<In></In>处理
 * @param {string} relation   Eq,Neq,Leq,Geq,Contains,In....
 * @param {string} fieldName 字段内部名称
 * @param {string} valueType Text,LookupId,LookupValue,DateTime,Date
 * @param {string | number | string[] | number[]} value 可以是数组或字符串
 */
CamlBuilder.prototype.Or = function(relation, fieldName, valueType, value) {
  let property = {
    Name: fieldName
  };

  if (valueType === CamlEnum.ValueType.LookupId) {
    property.LookupId = CamlEnum.Value.Boolean.True;
  }
  let fieldRef = XmlBuilder.Create(
    CamlEnum.Tag.FieldRef,
    property,
    CamlEnum.Value.None
  );
  if (relation === CamlEnum.Relation.In) {
    let camlList = [];
    for (let i = 0; i < value.length; i += CamlInfo.Options.MaxIn) {
      let valueList = value.slice(i, i + CamlInfo.Options.MaxIn);
      let camlValue = CamlBuilder.Value(relation, valueType, valueList);
      let xml = XmlBuilder.Create(relation, CamlEnum.Value.None, [
        fieldRef,
        camlValue
      ]);
      camlList.push(CamlBuilder.Express().Merge(CamlEnum.Logic.Or, xml));
    }
    this.Merge(
      CamlEnum.Logic.Or,
      CamlBuilder.MergeList(CamlEnum.Logic.Or, camlList)
    );
  } else if (Array.isArray(value)) {
    let camlList = value.map(v =>
      CamlBuilder.Express().Or(relation, fieldName, valueType, v)
    );
    this.Merge(
      CamlEnum.Logic.Or,
      CamlBuilder.MergeList(CamlEnum.Logic.Or, camlList)
    );
  } else {
    this.CamlInfo.Condition = XmlBuilder.Create(
      CamlEnum.Value.None,
      CamlEnum.Value.None,
      [
        this.CamlInfo.Condition,
        XmlBuilder.Create(relation, CamlEnum.Value.None, [
          fieldRef,
          CamlBuilder.Value(relation, valueType, value)
        ])
      ]
    );
    if (this.CamlInfo.Count >= 1) {
      this.CamlInfo.Condition = XmlBuilder.Create(
        CamlEnum.Tag.Or,
        CamlEnum.Value.None,
        this.CamlInfo.Condition
      );
    }
  }
  this.CamlInfo.AddCount();
  return this;
};

/**
 * 设置排序,不设置按默认排序,
 * false 从小到大倒序
 * @param { {field: string, ascend: boolean}[] } orderByList
 */
CamlBuilder.prototype.OrderBy = function(orderByList) {
  let orderByArray = orderByList.map(item =>
    XmlBuilder.Create(
      CamlEnum.Tag.FieldRef,
      {
        Name: item.field,
        Ascending: item.ascend
          ? CamlEnum.Value.Boolean.True
          : CamlEnum.Value.Boolean.False
      },
      CamlEnum.Value.None
    )
  );
  this.CamlInfo.Orderby = XmlBuilder.Create(
    CamlEnum.Tag.OrderBy,
    CamlEnum.Value.None,
    orderByArray
  );
  return this;
};

/**
 * 设置搜索范围,默认值设置为RecursiveAll，不调用此函数为默认搜索最顶层
 * @param {string} scope
 */
CamlBuilder.prototype.Scope = function(scope = CamlEnum.Scope.RecursiveAll) {
  this.CamlInfo.View.property = {
    Scope: scope
  };
  return this;
};

/**
 * 设置搜索条数,不调用此函数默认搜索100条,搜索全部设置为0，参数默认为0
 * @param {number | string} rowLimit
 */
CamlBuilder.prototype.RowLimit = function(rowLimit = 0) {
  this.CamlInfo.RowLimit = XmlBuilder.Create(
    CamlEnum.Tag.RowLimit,
    CamlEnum.Value.None,
    rowLimit
  );
  return this;
};

/**
 * 结束caml拼接，追加Query、Where、View...
 */
CamlBuilder.prototype.End = function() {
  let where = XmlBuilder.Create(
    CamlEnum.Tag.Where,
    CamlEnum.Value.None,
    this.CamlInfo.Condition
  );
  let queryChildren = [where, this.CamlInfo.GroupBy, this.CamlInfo.Orderby];

  let query = XmlBuilder.Create(
    CamlEnum.Tag.Query,
    CamlEnum.Value.None,
    queryChildren
  );

  let join = this.CamlInfo.Joins
    ? XmlBuilder.Create(
        CamlEnum.Tag.Joins,
        CamlEnum.Value.None,
        this.CamlInfo.Joins
      )
    : this.CamlInfo.Joins;

  let projectedFields = (this.CamlInfo.ProjectedFields = this.CamlInfo
    .ProjectedFields
    ? XmlBuilder.Create(
        CamlEnum.Tag.ProjectedFields,
        CamlEnum.Value.None,
        this.CamlInfo.ProjectedFields
      )
    : this.CamlInfo.ProjectedFields);
  this.CamlInfo.View.children = [
    this.CamlInfo.ViewFields,
    this.CamlInfo.Aggregations,
    query,
    join,
    projectedFields,
    this.CamlInfo.RowLimit
  ];

  this.CamlInfo.Condition = this.CamlInfo.View;
  return this;
};

/**
 * 输出caml字符串
 * @return {string} caml字符串
 */
CamlBuilder.prototype.ToString = function() {
  return this.CamlInfo.Condition.CreateElement
    ? this.CamlInfo.Condition.CreateElement()
    : XmlBuilder.RenderChildren(this.CamlInfo.Condition);
};

/**
 * 清空条件设置
 */
CamlBuilder.prototype.Clear = function() {
  this.CamlInfo = new CamlInfo();
  return this;
};

/**
 * 合并两个caml对象 "<logic> Condition + camlStr</logic>"
 * @param {string} logic And/Or
 * @param {string | CamlBuilder | XmlBuilder} caml caml对象或string没有end的
 */
CamlBuilder.prototype.Merge = function(logic, caml) {
  let camlStr = CamlEnum.Value.None;
  let count = 0;
  if (typeof caml === "string") {
    camlStr = caml;
  } else if (caml.CamlInfo) {
    camlStr = caml.CamlInfo.Condition;
    count = caml.CamlInfo.Count;
  } else {
    camlStr = caml;
  }
  if (camlStr) {
    this.CamlInfo.AddCount(count);
    if (this.CamlInfo.Condition) {
      this.CamlInfo.Condition = XmlBuilder.Create(logic, CamlEnum.Value.None, [
        this.CamlInfo.Condition,
        camlStr
      ]);
    } else {
      this.CamlInfo.Condition = XmlBuilder.Create(
        CamlEnum.Value.None,
        CamlEnum.Value.None,
        [camlStr]
      );
    }
  }

  return this;
};

/**
 * 需要使用 RenderListData api
 * @param {boolean} collapse   是否聚合,聚合时按分组返回部分相关数据，不聚合时按item项返回全部字段数据，配合ViewFields可以限制返回的字段,
 * @param {number} groupLimit 返回的视图Row数量
 * @param {string} fieldName     分组字段
 */
CamlBuilder.prototype.GroupBy = function(collapse, groupLimit, fieldName) {
  let fieldRef = XmlBuilder.Create(CamlEnum.Tag.FieldRef, {
    Name: fieldName
  });

  this.CamlInfo.GroupBy = XmlBuilder.Create(
    CamlEnum.Tag.GroupBy,
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
 * @param {string | string[]} fieldNames
 */
CamlBuilder.prototype.ViewFields = function(fieldNames) {
  let viewFields;
  if (Array.isArray(fieldNames)) {
    viewFields = fieldNames.map(item =>
      XmlBuilder.Create(
        CamlEnum.Tag.FieldRef,
        {
          Name: item
        },
        CamlEnum.Value.None
      )
    );
  } else {
    viewFields = XmlBuilder.Create(
      CamlEnum.Tag.FieldRef,
      {
        Name: fieldNames
      },
      CamlEnum.Value.None
    );
  }

  this.CamlInfo.ViewFields = XmlBuilder.Create(
    CamlEnum.Tag.ViewFields,
    CamlEnum.Value.None,
    viewFields
  );
  return this;
};

/**
 * 待完善
 * @param {string} type
 * @param {string} listAlias
 * @param {string} field
 * @param {string} showField
 * @param {string} fieldName
 */
CamlBuilder.prototype.Joins = function(
  type,
  listAlias,
  field,
  showField,
  fieldName
) {
  let fieldList = [
    XmlBuilder.Create(
      CamlEnum.Tag.FieldRef,
      {
        Name: field,
        RefType: "ID"
      },
      CamlEnum.Value.None
    ),
    XmlBuilder.Create(
      CamlEnum.Tag.FieldRef,
      {
        Name: "ID",
        List: listAlias
      },
      CamlEnum.Value.None
    )
  ];

  let eq = XmlBuilder.Create(CamlEnum.Tag.Eq, CamlEnum.Value.None, fieldList);

  if (!this.CamlInfo.Joins) {
    this.CamlInfo.Joins = [];
  }
  this.CamlInfo.Joins.push(
    XmlBuilder.Create(
      CamlEnum.Tag.Join,
      {
        Type: type,
        ListAlias: listAlias
      },
      eq
    )
  );

  if (this.CamlInfo.ProjectedFields) {
    this.CamlInfo.ProjectedFields = [];
  }
  this.CamlInfo.ProjectedFields.push(
    ProjectedFields(showField, fieldName, listAlias)
  );

  /**
   * 待完善
   * @param {string} fieldName
   * @param {string} name
   * @param {string} listName
   */
  function ProjectedFields(fieldName, name, listName) {
    // <Field ShowField="titel111" Type="Lookup" Name="test1" List="test1" />
    let projectedFields = XmlBuilder.Create(CamlEnum.Tag.Field, {
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
 * @param {[ { field: string, type: string } ] } aggregationList  field应用的列, type引用的函数
 */
CamlBuilder.prototype.Aggregations = function(aggregationList) {
  let childrenList = aggregationList.map(item => {
    let aggregation;
    if (Aggregations) {
      aggregation = new Aggregations(item.field, item.type);
    } else {
      aggregation = {
        Name: item.field,
        Type: item.type
      };
    }
    return XmlBuilder.Create(
      CamlEnum.Tag.FieldRef,
      aggregation,
      CamlEnum.Value.None
    );
  });

  this.CamlInfo.Aggregations = XmlBuilder.Create(
    CamlEnum.Tag.Aggregations,
    {
      Value: "On"
    },
    childrenList
  );

  return this;
};

/**
 * 设置路径
 * @param {string} folderPath  文件夹相对路径，
 * 顶层站点 /list/folder
 * 子站点/site/list/folder
 */
CamlBuilder.prototype.SetFolder = function(folderPath) {
  this.CamlInfo.FolderStr = folderPath;
  return this;
};

/**
 * 读取文件夹路径
 */
CamlBuilder.prototype.GetFolder = function() {
  return this.CamlInfo.FolderStr;
};

export default CamlBuilder;
