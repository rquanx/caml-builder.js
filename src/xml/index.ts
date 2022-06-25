export type Value = string | number | boolean | Date;
export type Children = (XmlBuilder | string | undefined | XmlBuilder[])[] | XmlBuilder | string | number | boolean | Date;
export type Property = Record<string, Value> | string;
export class XmlBuilder {

  constructor(public tagName: string, public property: Property, public children?: Children) { }

  /**
   * 创建字符串
   */
  toString() {
    return createXMLString(this.tagName, this.property, this.children);
  }


  static create(tagName: string, property: Property, children?: Children) {
    return new XmlBuilder(tagName, property, children)
  }
}

const createXMLString = function (tagName: string, property: Property, children?: Children) {
  return tag(tagName, property, children);
};

const tag = (tagName: string, property: Property, children?: Children) => {
  if (children || children === 0) {
    return tagName
      ? `<${tagName}${renderProps(
        property
      )}>${renderChildren(children)}</${tagName}>`
      : renderChildren(children);
  } else {
    return tagName ? `<${tagName}${renderProps(property)}/>` : "";
  }
};

export const renderChildren = function (children: Children) {
  if(!children) return "";
  let childrenStr = "";
  if (Array.isArray(children)) {
    children.forEach(item => {
      if (Array.isArray(item)) {
        childrenStr += renderChildren(item);
      } else if (typeof item === "object") {
        childrenStr += createXMLString(
          item.tagName,
          item.property,
          item.children
        );
      } else if (typeof item === "string") {
        childrenStr += item;
      }
    });
  } else if (typeof children === "object") {
    childrenStr = children.toString();
  } else {
    childrenStr = `${children}`;
  }
  return childrenStr;
};
const renderProps = function (property?: Property) {
  if (!property) return "";
  return typeof property === "string"
    ? property
    : Object.keys(property)
      .map(key => value(key, property[key]))
      .join("");
};

const value = (key: string, value: Value) => ` ${key}='${value}' `;

export default XmlBuilder;
