/**CamlXmlBuilder
 * 重构
 */
'use strict';
class CamlXmlInfo {
    /** @constructor 
     * caml数据存储对象
     * @param {CamlXmlInfo} camlXmlInfo
     */
    constructor(camlXmlInfo = undefined) {
        if (camlXmlInfo) {
            this.Condition = camlXmlInfo.Condition;
            this.Count = camlXmlInfo.Count;
            this.Orderby = camlXmlInfo.Orderby;
            this.RowLimit = camlXmlInfo.RowLimit;
            this.ViewFields = camlXmlInfo.ViewFields;
            this.GroupBy = camlXmlInfo.GroupBy;
            this.ProjectedFields = camlXmlInfo.ProjectedFields;
            this.Joins = camlXmlInfo.Joins;
            this.Aggregations = camlXmlInfo.Aggregations;
            this.FolderStr = camlXmlInfo.FolderStr;
            this.View = camlXmlInfo.View;
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
            this.View = new XmlBuilder(CamlXmlBuilder.TagType.View, "", "");
        }
    }

    /**增加嵌套层数 */
    AddCount(count = 0) {
        if (count > 0) {
            this.Count += count;
        } else {
            this.Count++;
        }

        if (this.Count > CamlXmlInfo.Options.MaxNested) {
            throw Error(CamlXmlInfo.ErrorType.NestedLimit);
        }
    }
}

/** 限制选项 */
CamlXmlInfo.Options = {
    MaxIn: 500,
    MaxNested: 160
}

/**错误类型和信息 */
CamlXmlInfo.ErrorType = {
    NestedLimit: `Error, Number of nesting layers is over ${CamlXmlInfo.Options.MaxNested}`
}

class XmlBuilder {
    /**
     * Xml操作对象
     * @param {string} tagName
     * @param {Object} property
     * @param {any} children
     */
    constructor(tagName, property, children) {
        this.tagName = tagName;
        this.property = property;
        this.children = children;
    }

    /**
     * 创建字符串
     */
    CreateElement() {
        return XmlBuilder.CreateElement(this.tagName, this.property, this.children);
    }
}


/**
 * 创建xml标签
 * @param {string} tagName  标签名
 * @param {string | {Object} property  标签属性 "" / {} /false 都是代表为空
 * @param {any} children     子内容
 */
XmlBuilder.CreateElement = function (tagName, property, children) {
    let result = "";
    let propertyStr = XmlBuilder.renderProps(property);
    if (children || children === 0) {
        let childrenStr = XmlBuilder.renderChildren(children);
        result = XmlBuilder.Tag(tagName, propertyStr, childrenStr);
    } else {
        result = XmlBuilder.AutoCloseTag(tagName, propertyStr);
    }
    return result;
}

/**
 * 拼接属性字符串
 * @param {string | {Object} property
 */
XmlBuilder.renderProps = function (property) {
    let propertyStr = ""
    if (property) {
        if (typeof (property) === "string") {
            propertyStr = property;
        } else {
            Object.keys(property).forEach(key => {
                propertyStr += XmlBuilder.Value(key, property[key]);
            });
        }
    }
    return propertyStr;
}

/**
 * 递归拼接子元素
 * @param {any} children
 */
XmlBuilder.renderChildren = function (children) {
    let childrenStr = "";
    if (Array.isArray(children)) {
        children.forEach((item) => {
            if (Array.isArray(item)) {
                childrenStr += XmlBuilder.renderChildren(item);
            } else if (typeof (item) === "object") {
                childrenStr += XmlBuilder.CreateElement(item.tagName, item.property, item.children)
            } else if (typeof (item) === "string") {
                childrenStr += item;
            }
        });
    } else if (typeof (children) === "object") {
        childrenStr = children.CreateElement();
    } else {
        childrenStr = children;
    }
    return childrenStr;
}

/**
 * 自闭标签
 * @param {string} tagName 
 * @param {string} propertyStr
 */
XmlBuilder.AutoCloseTag = function (tagName, propertyStr) {
    if (tagName) {
        return `<${tagName}${propertyStr}/>`;
    } else {
        return "";
    }
}

/**
 * 普通标签
 * @param {string} tagName 
 * @param {string} propertyStr 
 * @param {string} childrenStr 
 */
XmlBuilder.Tag = function (tagName, propertyStr, childrenStr) {
    if (tagName) {
        return `<${tagName}${propertyStr}>${childrenStr}</${tagName}>`;
    } else {
        return childrenStr;
    }
}

/**
 * 标签属性
 * @param {string} key 
 * @param {string} value 
 */
XmlBuilder.Value = function (key, value) {
    return ` ${key}='${value}' `;
}



/** @constructor */
let CamlXmlBuilder = function () {
    this.CamlXmlInfo = new CamlXmlInfo();
};

/** 逻辑选项 */
CamlXmlBuilder.LogicType = {
    And: "And",
    Or: "Or"
}

/** 关系选项 */
CamlXmlBuilder.RelationType = {
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
CamlXmlBuilder.ValueType = {
    Text: "Text",
    Number: "Number",
    DateTime: "DateTime", // yyyy-MM-ddTHH:mm:ss
    Date: "Date",
    LookupId: "LookupId",
    LookupValue: "LookupValue",
    Boolean: "Boolean",
    Integer: "Integer",
    Url: "Url", // 检查
    FSObjType: "FSObjType", //文件夹
    Boolean: "Boolean"
};

/** 标签选项 */
CamlXmlBuilder.TagType = {
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
CamlXmlBuilder.AggregationsType = {
    Count: "COUNT", // 计数
    Average: "AVG", // 取平均值
    Maximum: "MAX", // 取最大值
    Minimum: "MIN", // 最小值
    Sum: "SUM", // 总计
    StdDeviation: "STDEV", // 开方?
    Variance: "VAR"
};

/** 范围选项 */
CamlXmlBuilder.ScopeType = {
    FilesOnly: "FilesOnly",
    Recursive: "Recursive",
    RecursiveAll: "RecursiveAll"
}

/**
 * 返回一个内容完全相同的全新caml对象
 * @param {CamlXmlBuilder} caml 
 */
CamlXmlBuilder.Copy = function (caml) {
    let newCaml = new CamlXmlBuilder();
    newCaml.CamlXmlInfo = new CamlXmlInfo(caml.CamlXmlInfo);
    return newCaml;
};


/**
 * 创建纯表达式的caml，用于合并
 */
CamlXmlBuilder.Express = function () {
    return new CamlXmlBuilder();
}

/** 
 * 根据值的关系进行值标签生成的选择
 * @param {string} relation
 * @param {string} valueType
 * @param {string} value
 */
CamlXmlBuilder.Value = function (relation, valueType, value) {
    let values = "";
    switch (relation) {
        case CamlXmlBuilder.RelationType.In:
            {
                let valueLength = value.length;
                values = [];
                for (let i = 0; i < valueLength; i++) {
                    values.push(CamlXmlBuilder.CaseValueType(valueType, value[i]));
                }
                values = new XmlBuilder(CamlXmlBuilder.TagType.Values, {}, values);
                break;
            }
        case CamlXmlBuilder.RelationType.IsNotNull:
            {
                values = "";
                break;
            }

        case CamlXmlBuilder.RelationType.IsNull:
            {
                values = "";
                break;
            }

        default:
            values = CamlXmlBuilder.CaseValueType(valueType, value);
            break;
    }
    return values;
};

/** 
 * 根据值类型返回值标签的字符串
 * @param {string} valueType
 * @param {string} value
 */
CamlXmlBuilder.CaseValueType = function (valueType, value) {
    let property = {
        Type: valueType
    };
    switch (valueType) {
        case CamlXmlBuilder.ValueType.DateTime:
            {
                property.IncludeTimeValue = "TRUE";
                break;
            }
        case CamlXmlBuilder.ValueType.Date:
            {
                property.Type = CamlXmlBuilder.ValueType.DateTime;
                if (typeof value === "object" && value.toISOString) {
                    value = value.toISOString();
                }
                break;
            }
        case CamlXmlBuilder.ValueType.Boolean:
            {
                value = (Number(value) ? 1 : 0);
                break;
            }
        case CamlXmlBuilder.ValueType.LookupId:
            {
                property.Type = CamlXmlBuilder.ValueType.Integer;
                if (typeof value === "object") {
                    if (value.id) {
                        value = value.id;
                    } else if (value.get_lookupId) {
                        value = value.get_lookupId();
                    }
                }
                break;
            }
        case CamlXmlBuilder.ValueType.LookupValue:
            {
                property.Type = CamlXmlBuilder.ValueType.Text;
                if (typeof value === "object") {
                    if (value.value) {
                        value = value.value;
                    } else if (value.get_lookupId) {
                        value = value.get_lookupValue();
                    }
                }
                break;
            }
        default:
            {
                break;
            }
    }

    let valueStr = new XmlBuilder(CamlXmlBuilder.TagType.Value, property, value);
    return valueStr;
};

/**
 * 将全部的camlList用logic合并起来,两两进行递归合并
 * @param {string} logic
 * @param {CamlXmlBuilder[]} camlList
 */
CamlXmlBuilder.MergeList = function (logic, camlList) {
    let result;
    let newCamlList = [];
    for (let i = 0; i < camlList.length - 1; i += 2) {
        newCamlList.push(CamlXmlBuilder.Merge(logic, camlList[i], camlList[i + 1]));
    }
    if (camlList.length % 2 !== 0) {
        newCamlList.push(camlList[camlList.length - 1]);
    }

    if (newCamlList.length > 1) {
        result = CamlXmlBuilder.MergeList(logic, newCamlList);
    } else {
        result = newCamlList.length > 0 ? newCamlList[0] : new CamlXmlBuilder();
    }
    return result;
}

/**
 * 将两个caml合并
 * <logic> c1 + c2 </logic>
 * @param {string} logic 
 * @param {CamlXmlBuilder} camlFirst
 * @param {CamlXmlBuilder} camlSecond
 */
CamlXmlBuilder.Merge = function (logic, camlFirst, camlSecond) {
    let caml = new CamlXmlBuilder();
    let camlXmlInfo = caml.CamlXmlInfo;
    let firstCamlXmlInfo = camlFirst.CamlXmlInfo;
    let secondCamlXmlInfo = camlSecond.CamlXmlInfo;

    if (firstCamlXmlInfo.Condition && secondCamlXmlInfo.Condition) {
        camlXmlInfo.Condition = new XmlBuilder(logic, {}, [firstCamlXmlInfo.Condition, secondCamlXmlInfo.Condition]);
        camlXmlInfo.AddCount((firstCamlXmlInfo.Count > secondCamlXmlInfo.Count ? firstCamlXmlInfo.Count : secondCamlXmlInfo.Count) + 1);
    } else if (firstCamlXmlInfo.Condition || secondCamlXmlInfo.Condition) {
        camlXmlInfo.Condition = new XmlBuilder("", {}, [firstCamlXmlInfo.Condition, secondCamlXmlInfo.Condition]);
        camlXmlInfo.AddCount(firstCamlXmlInfo.Count + secondCamlXmlInfo.Count + 1);
    }
    return caml;
}

/**
 * 最外层增加一个And条件
 * <And><relation><FieldRef Name='fieldName'><Value Type='valueType'></Value></relation> ... </And>
 * 传入数组会使用<In></In>处理 
 * @param {string} relation   Eq,Neq,Leq,Geq,Contains,In....
 * @param {string} fieldName 字段内部名称
 * @param {string} valueType Text,LookupId,LookupValue,DateTime,Date
 * @param {string | number | string[] | number[]} value 可以是数组或字符串
 */
CamlXmlBuilder.prototype.And = function (relation, fieldName, valueType, value) {
    let camlList = [];
    let property = {
        Name: fieldName
    };

    if (valueType === CamlXmlBuilder.ValueType.LookupId) {
        property.LookupId = "True"
    }

    let fieldRef = new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, property, "");

    if (relation === CamlXmlBuilder.RelationType.In) {
        for (let i = 0; i < value.length; i += CamlXmlInfo.Options.MaxIn) {
            let temCaml = new CamlXmlBuilder();
            let valueList = value.slice(i, i + CamlXmlInfo.Options.MaxIn);
            temCaml.Merge(CamlXmlBuilder.LogicType.Or, new XmlBuilder(relation, {}, [fieldRef, CamlXmlBuilder.Value(relation, valueType, valueList)]));
            camlList.push(temCaml);
        }
        this.Merge(CamlXmlBuilder.LogicType.And, CamlXmlBuilder.MergeList(CamlXmlBuilder.LogicType.Or, camlList));
    } else {
        this.CamlXmlInfo.Condition = new XmlBuilder("", {}, [this.CamlXmlInfo.Condition, new XmlBuilder(relation, {}, [fieldRef, CamlXmlBuilder.Value(relation, valueType, value)])]);
        if (this.CamlXmlInfo.Count >= 1) {
            this.CamlXmlInfo.Condition = new XmlBuilder(CamlXmlBuilder.TagType.And, {}, this.CamlXmlInfo.Condition);
        }
    }
    this.CamlXmlInfo.AddCount();
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
CamlXmlBuilder.prototype.Or = function (relation, fieldName, valueType, value) {
    let camlList = [];
    let property = {
        Name: fieldName
    };

    if (valueType === CamlXmlBuilder.ValueType.LookupId) {
        property.LookupId = "True"
    }
    let fieldRef = new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, property, "");
    if (relation === CamlXmlBuilder.RelationType.In) {
        for (let i = 0; i < value.length; i += CamlXmlInfo.Options.MaxIn) {
            let temCaml = new CamlXmlBuilder();
            let valueList = value.slice(i, i + CamlXmlInfo.Options.MaxIn);
            temCaml.Merge(CamlXmlBuilder.LogicType.Or, new XmlBuilder(relation, {}, [fieldRef, CamlXmlBuilder.Value(relation, valueType, valueList)]));
            camlList.push(temCaml);
        }
        this.Merge(CamlXmlBuilder.LogicType.Or, CamlXmlBuilder.MergeList(CamlXmlBuilder.LogicType.Or, camlList));
    } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            let temCaml = new CamlXmlBuilder();
            camlList.push(temCaml.Or(relation, fieldName, valueType, value[i]));
        }
        this.Merge(CamlXmlBuilder.LogicType.Or, CamlXmlBuilder.MergeList(CamlXmlBuilder.LogicType.Or, camlList));
    } else {
        this.CamlXmlInfo.Condition = new XmlBuilder("", {}, [this.CamlXmlInfo.Condition, new XmlBuilder(relation, {}, [fieldRef, CamlXmlBuilder.Value(relation, valueType, value)])]);
        if (this.CamlXmlInfo.Count >= 1) {
            this.CamlXmlInfo.Condition = new XmlBuilder(CamlXmlBuilder.TagType.Or, {}, this.CamlXmlInfo.Condition);
        }
    }
    this.CamlXmlInfo.AddCount();
    return this;
};

/**
 * 设置排序,不设置按默认排序,
 * @param { [{field: string, ascend: boolean}] } orderByList
 */
CamlXmlBuilder.prototype.OrderBy = function (orderByList) {
    // false 从小到大倒序
    let ascend;
    let orderByArray = [];
    this.CamlXmlInfo.Orderby = "";
    orderByList.forEach((item) => {
        if (item.ascend) {
            ascend = "True";
        } else {
            ascend = "False";
        }
        orderByArray.push(new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, {
            Name: item.field,
            Ascending: ascend
        }, ""));
    });
    this.CamlXmlInfo.Orderby = new XmlBuilder(CamlXmlBuilder.TagType.OrderBy, {}, orderByArray);
    return this;
};

/**
 * 设置搜索范围,默认值设置为RecursiveAll，不调用此函数为默认搜索最顶层
 * @param {string} scope 
 */
CamlXmlBuilder.prototype.Scope = function (scope = CamlXmlBuilder.ScopeType.RecursiveAll) {
    this.CamlXmlInfo.View.property = {
        Scope: scope
    };
    return this;
};

/**
 * 设置搜索条数,不调用此函数默认搜索100条,搜索全部设置为0，参数默认为0
 * @param {number | string} rowLimit 
 */
CamlXmlBuilder.prototype.RowLimit = function (rowLimit = 0) {
    this.CamlXmlInfo.RowLimit = new XmlBuilder(CamlXmlBuilder.TagType.RowLimit, {}, rowLimit);
    return this;
};

/**
 * 结束caml拼接，追加Query、Where、View...
 */
CamlXmlBuilder.prototype.End = function () {
    if (this.CamlXmlInfo.Joins) {
        this.CamlXmlInfo.Joins = new XmlBuilder(CamlXmlBuilder.TagType.Joins, {}, this.CamlXmlInfo.Joins);
    }
    if (this.CamlXmlInfo.ProjectedFields) {
        this.CamlXmlInfo.ProjectedFields = new XmlBuilder(CamlXmlBuilder.TagType.ProjectedFields, {}, this.CamlXmlInfo.ProjectedFields);
    }
    let where = new XmlBuilder(CamlXmlBuilder.TagType.Where, {}, this.CamlXmlInfo.Condition);
    let queryChildren = [where, this.CamlXmlInfo.GroupBy, this.CamlXmlInfo.Orderby];
    let query = new XmlBuilder(CamlXmlBuilder.TagType.Query, {}, queryChildren);

    this.CamlXmlInfo.View.children = [this.CamlXmlInfo.ViewFields,
        this.CamlXmlInfo.Aggregations,
        query,
        this.CamlXmlInfo.Joins,
        this.CamlXmlInfo.ProjectedFields,
        this.CamlXmlInfo.RowLimit,
    ];

    this.CamlXmlInfo.Condition = this.CamlXmlInfo.View;
    return this;
};


/**
 * 输出caml字符串
 * @return {string} caml字符串
 */
CamlXmlBuilder.prototype.ToString = function () {
    if (this.CamlXmlInfo.Condition.CreateElement) {
        return this.CamlXmlInfo.Condition.CreateElement();
    } else {
        return XmlBuilder.renderChildren(this.CamlXmlInfo.Condition);
    }
};

/**
 * 清空条件设置
 */
CamlXmlBuilder.prototype.Clear = function () {
    this.CamlXmlInfo = new CamlXmlInfo();
    return this;
};

/**
 * 合并两个caml对象 "<logic> Condition + camlStr</logic>"
 * @param {string} logic And/Or 
 * @param {string | CamlXmlBuilder | XmlBuilder} caml caml对象或string没有end的
 */
CamlXmlBuilder.prototype.Merge = function (logic, caml) {
    let camlStr = "";
    let count = 0;
    if (typeof (caml) === "string") {
        camlStr = caml;
    } else if (caml.CamlXmlInfo) {
        camlStr = caml.CamlXmlInfo.Condition;
        count = caml.CamlXmlInfo.Count;
    } else {
        camlStr = caml;
    }
    if (camlStr) {
        this.CamlXmlInfo.AddCount(count);
        if (this.CamlXmlInfo.Condition) {
            this.CamlXmlInfo.Condition = new XmlBuilder(logic, {}, [this.CamlXmlInfo.Condition, camlStr]);
        } else {
            this.CamlXmlInfo.Condition = new XmlBuilder("", {}, [camlStr]);
        }
    }

    return this;
};

/**
 * 需要使用 RenderListData api
 * 合并两个caml对象 "<logic> Condition + camlStr</logic>"
 * @param {boolean} collapse   是否聚合,聚合时按分组返回部分相关数据，不聚合时按item项返回全部字段数据，配合ViewFields可以限制返回的字段,
 * @param {number} groupLimit 返回的视图Row数量
 * @param {string} fieldName     分组字段
 */
CamlXmlBuilder.prototype.GroupBy = function (collapse, groupLimit, fieldName) {
    let fieldRef = new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, {
        Name: fieldName
    });

    this.CamlXmlInfo.GroupBy = new XmlBuilder(CamlXmlBuilder.TagType.GroupBy, {
        Collapse: collapse.toString(),
        GroupLimit: groupLimit
    }, fieldRef);
    return this;
}


/**
 * 设置返回的字段
 * @param {string | string[]} fieldNames 
 */
CamlXmlBuilder.prototype.ViewFields = function (fieldNames) {
    let viewFields;
    if (Array.isArray(fieldNames)) {
        viewFields = fieldNames.map(
            (item) => (
                new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, {
                    Name: item
                }, "")
            )
        );
    } else {
        viewFields = new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, {
            Name: fieldNames
        }, "");
    }

    this.CamlXmlInfo.ViewFields = new XmlBuilder(CamlXmlBuilder.TagType.ViewFields, {}, viewFields);
    return this;
}

/**
 * 待完善
 * @param {string} type 
 * @param {string} listAlias 
 * @param {string} field 
 * @param {string} showField 
 * @param {string} fieldName 
 */
CamlXmlBuilder.prototype.Joins = function (type, listAlias, field, showField, fieldName) {
    let fieldList = [new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, {
            Name: field,
            RefType: "ID"
        }, ""),
        new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, {
            Name: "ID",
            List: listAlias
        }, "")
    ];

    let eq = new XmlBuilder(CamlXmlBuilder.TagType.Eq, {}, fieldList);

    if (!this.CamlXmlInfo.Joins) {
        this.CamlXmlInfo.Joins = [];
    }
    this.CamlXmlInfo.Joins.push(new XmlBuilder(CamlXmlBuilder.TagType.Join, {
        Type: type,
        ListAlias: listAlias
    }, eq));

    if (this.CamlXmlInfo.ProjectedFields) {
        this.CamlXmlInfo.ProjectedFields = [];
    }
    this.CamlXmlInfo.ProjectedFields.push(ProjectedFields(showField, fieldName, listAlias));

    /**
     * 待完善
     * @param {string} fieldName  
     * @param {string} name 
     * @param {string} listName 
     */
    function ProjectedFields(fieldName, name, listName) {
        // <Field ShowField="titel111" Type="Lookup" Name="test1" List="test1" />
        let projectedFields = new XmlBuilder(CamlXmlBuilder.TagType.Field, {
            Name: name,
            ShowField: fieldName,
            Type: "Lookup",
            List: listName
        });

        return projectedFields;
    }
    return this;
}

/**
 * 需要使用 RenderListData api
 * 对字段进行函数计算，返回 field.[type.agg] => 当前分组的函数计算值   field.[type] => 总的值
 * @param {[ { field: string, type: string } ] } aggregationList  field应用的列, type引用的函数
 */
CamlXmlBuilder.prototype.Aggregations = function (aggregationList) {
    let childrenList = aggregationList.map((item) => (
        new XmlBuilder(CamlXmlBuilder.TagType.FieldRef, {
                Name: item.field,
                Type: item.type
            },
            "")
    ));

    this.CamlXmlInfo.Aggregations = new XmlBuilder(CamlXmlBuilder.TagType.Aggregations, {
        Value: "On"
    }, childrenList);

    return this;
}

/** 
 * 设置路径
 * @param {string} folderPath  文件夹相对路径，
 * 顶层站点 /list/folder
 * 子站点/site/list/folder
 */
CamlXmlBuilder.prototype.SetFolder = function (folderPath) {
    this.CamlXmlInfo.FolderStr = folderPath;
    return this;
}

/** 
 * 读取文件夹路径
 */
CamlXmlBuilder.prototype.GetFolder = function () {
    return this.CamlXmlInfo.FolderStr;
}

export default CamlXmlBuilder;