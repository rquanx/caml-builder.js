/** 逻辑选项 */
export enum Logic {
  And = "And",
  Or = "Or"
};

export type LogicKey = keyof typeof Logic;