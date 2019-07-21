import CamlBuilder, { CamlEnum } from "../dist/camlBuilder";

CamlBuilder.Express();

test("none condiction to be empty", () => {
  expect(CamlBuilder.Express().ToString()).toBe("");
});

test("none condiction whith End to be empty Query", () => {
  expect(
    CamlBuilder.Express()
      .End()
      .ToString()
  ).toBe(`<View><Query><Where/></Query></View>`);
});

test("single And condiction Query", () => {
  expect(
    CamlBuilder.Express()
      .And(
        CamlEnum.RelationType.Eq,
        "TestField",
        CamlEnum.ValueType.Text,
        "test"
      )
      .End()
      .ToString()
  ).toBe(
    `<View><Query><Where><Eq><FieldRef Name='TestField' /><Value Type='Text' >test</Value></Eq></Where></Query></View>`
  );
});

test("single Or condiction Query", () => {
  expect(
    CamlBuilder.Express()
      .Or(
        CamlEnum.RelationType.Eq,
        "TestField",
        CamlEnum.ValueType.Text,
        "test"
      )
      .End()
      .ToString()
  ).toBe(
    `<View><Query><Where><Eq><FieldRef Name='TestField' /><Value Type='Text' >test</Value></Eq></Where></Query></View>`
  );
});

test("Two Or condiction Query", () => {
  expect(
    CamlBuilder.Express()
      .Or(
        CamlEnum.RelationType.Eq,
        "TestField",
        CamlEnum.ValueType.Text,
        "test"
      )
      .Or(
        CamlEnum.RelationType.Eq,
        "TestField2",
        CamlEnum.ValueType.Text,
        "test2"
      )
      .End()
      .ToString()
  ).toBe(
    `<View><Query><Where><Or><Eq><FieldRef Name='TestField' /><Value Type='Text' >test</Value></Eq><Eq><FieldRef Name='TestField2' /><Value Type='Text' >test2</Value></Eq></Or></Where></Query></View>`
  );
});

test("Two And condiction Query", () => {
  expect(
    CamlBuilder.Express()
      .And(
        CamlEnum.RelationType.Eq,
        "TestField",
        CamlEnum.ValueType.Text,
        "test"
      )
      .And(
        CamlEnum.RelationType.Eq,
        "TestField2",
        CamlEnum.ValueType.Text,
        "test2"
      )
      .End()
      .ToString()
  ).toBe(
    `<View><Query><Where><And><Eq><FieldRef Name='TestField' /><Value Type='Text' >test</Value></Eq><Eq><FieldRef Name='TestField2' /><Value Type='Text' >test2</Value></Eq></And></Where></Query></View>`
  );
});
