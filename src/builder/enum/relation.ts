/** 关系选项 */
export enum Relation {
  In = "In",
  Eq = "Eq",
  Gt = "Gt",
  Lt = "Lt",
  Geq = "Geq",
  Leq = "Leq",
  Neq = "Neq",
  Contains = "Contains",
  BeginsWith = "BeginsWith",
  IsNull = "IsNull",
  IsNotNull = "IsNotNull",
  DateRangesOverlap = "DateRangesOverlap",

  Includes = "Includes",
  NotIncludes = "NotIncludes",
  /**
     * 查阅项数组使用？ 
     *  <Includes>
            <FieldRef    Name = "Field_Name"/>
            <Value    Type = "Field_Type"/>
            <XML />
        </Includes> 
    */

  Membership = "Membership"
};

export type RelationKey = keyof typeof Relation;