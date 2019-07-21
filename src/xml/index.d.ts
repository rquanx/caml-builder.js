
declare class XmlBuilder {
    /**
     * 
     * @param tagName 标签名
     * @param property 标签属性
     * @param children 子元素内容
     */
    constructor(tagName: string, property: Object, children: any);

    /**
    * 创建xml标签
    */
    CreateElement(): string;

    /**
     * 创建xml标签
     * @param  tagName  标签名
     * @param  property  标签属性
     * @param  children     子内容
     */
    static CreateElement(tagName: string, property: string | Object, children: string): string;

    /**
     * 拼接属性字符串
     * @param  property
     */
    static RenderProps(property: string | Object): string;

    /**
    * 拼接子元素字符串
    * @param children
    */
    static RenderChildren(children: any): string;


    /**
     * 普通标签
     * @param tagName 
     * @param property
     * @param children
     */
    static Tag(tagName: string, property: string, children: string): string;

    /**
     * 标签属性
     * @param  key 
     * @param  value 
     */
    static Value(key: string, value: string);
}


export default XmlBuilder;