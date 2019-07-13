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
    let propertyStr = XmlBuilder.RenderProps(property);
    if (children || children === 0) {
        let childrenStr = XmlBuilder.RenderChildren(children);
        result = XmlBuilder.Tag(tagName, propertyStr, childrenStr);
    } else {
        result = XmlBuilder.AutoCloseTag(tagName, propertyStr);
    }
    return result;
}

/**
 * 拼接属性字符串
 * @param {string | Object} property
 */
XmlBuilder.RenderProps = function (property) {
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
XmlBuilder.RenderChildren = function (children) {
    let childrenStr = "";
    if (Array.isArray(children)) {
        children.forEach((item) => {
            if (Array.isArray(item)) {
                childrenStr += XmlBuilder.RenderChildren(item);
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


export default XmlBuilder;