
/** 范围选项 */
export enum Scope {
  FilesOnly = "FilesOnly",
  Recursive = "Recursive",
  RecursiveAll = "RecursiveAll"
};

export type ScopeKey = keyof typeof Scope;