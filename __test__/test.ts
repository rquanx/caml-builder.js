import CamlBuilder from '../src/builder'

test("none condiction to be empty", () => {
  expect(CamlBuilder.express().toString()).toBe("");
});

test("none condiction whith End to be empty Query", () => {
  expect(
    CamlBuilder.express()
      .end()
      .toString()
  ).toBe(`<View><Query><Where/></Query></View>`);
});

test("single And condiction Query", () => {
  expect(
    CamlBuilder.express()
      .and(
        'Eq',
        "TestField",
        'Text',
        "test"
      )
      .end()
      .toString()
  ).toBe(
    `<View><Query><Where><Eq><FieldRef Name='TestField' /><Value Type='Text' >test</Value></Eq></Where></Query></View>`
  );
});

test("single Or condiction Query", () => {
  expect(
    CamlBuilder.express()
      .or(
        'Eq',
        "TestField",
        'Text',
        "test"
      )
      .end()
      .toString()
  ).toBe(
    `<View><Query><Where><Eq><FieldRef Name='TestField' /><Value Type='Text' >test</Value></Eq></Where></Query></View>`
  );
});

test("Two Or condiction Query", () => {
  expect(
    CamlBuilder.express()
      .or(
        'Eq',
        "TestField",
        'Text',
        "test"
      )
      .or(
        'Eq',
        "TestField2",
        'Text',
        "test2"
      )
      .end()
      .toString()
  ).toBe(
    `<View><Query><Where><Or><Eq><FieldRef Name='TestField' /><Value Type='Text' >test</Value></Eq><Eq><FieldRef Name='TestField2' /><Value Type='Text' >test2</Value></Eq></Or></Where></Query></View>`
  );
});

test("Two And condiction Query", () => {
  expect(
    CamlBuilder.express()
      .and(
        'Eq',
        "TestField",
        'Text',
        "test"
      )
      .and(
        'Eq',
        "TestField2",
        'Text',
        "test2"
      )
      .end()
      .toString()
  ).toBe(
    `<View><Query><Where><And><Eq><FieldRef Name='TestField' /><Value Type='Text' >test</Value></Eq><Eq><FieldRef Name='TestField2' /><Value Type='Text' >test2</Value></Eq></And></Where></Query></View>`
  );
});
