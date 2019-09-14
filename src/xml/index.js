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
XmlBuilder.CreateElement = function(tagName, property, children) {
  return XmlBuilder.Tag(tagName, property, children);
};

/**
 * 拼接属性字符串
 * @param {string | Object} property
 */
XmlBuilder.RenderProps = function(property) {
  if (!property) return "";
  return typeof property === "string"
    ? property
    : Object.keys(property)
        .map(key => XmlBuilder.Value(key, property[key]))
        .join("");
};

/**
 * 递归拼接子元素
 * @param {any} children
 */
XmlBuilder.RenderChildren = function(children) {
  let childrenStr = "";
  if (Array.isArray(children)) {
    children.forEach(item => {
      if (Array.isArray(item)) {
        childrenStr += XmlBuilder.RenderChildren(item);
      } else if (typeof item === "object") {
        childrenStr += XmlBuilder.CreateElement(
          item.tagName,
          item.property,
          item.children
        );
      } else if (typeof item === "string") {
        childrenStr += item;
      }
    });
  } else if (typeof children === "object") {
    childrenStr = children.CreateElement();
  } else {
    childrenStr = children;
  }
  return childrenStr;
};

/**
 * 普通标签
 * @param {string} tagName
 * @param {any} property
 * @param {any} children
 */
XmlBuilder.Tag = (tagName, property, children) => {
  if (children || children === 0) {
    return tagName
      ? `<${tagName}${XmlBuilder.RenderProps(
          property
        )}>${XmlBuilder.RenderChildren(children)}</${tagName}>`
      : XmlBuilder.RenderChildren(children);
  } else {
    return tagName ? `<${tagName}${XmlBuilder.RenderProps(property)}/>` : "";
  }
};

/**
 * 标签属性
 * @param {string} key
 * @param {string} value
 */
XmlBuilder.Value = (key, value) => ` ${key}='${value}' `;

XmlBuilder.Create = (tagName, property, children) =>
  new XmlBuilder(tagName, property, children);

export default XmlBuilder;
