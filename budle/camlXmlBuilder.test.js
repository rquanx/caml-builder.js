import CamlXmlBuilder from "./camlXmlBuilder";
var c1 = new CamlXmlBuilder();
c1.Clear().And("In", "t", "Text", [1, 2, 3])
    .And("Eq", "t1", "LookupId", {
        id: "1"
    })
    .And("Eq", "t1", "LookupId", 1)
    .And("Eq", "t2", "LookupValue", {
        value: "2"
    })
    .And("Eq", "t2", "LookupValue", "1")
    .End();

c1.Clear().Merge("And", CamlXmlBuilder.Express().And("Eq", "t", "Text", "123"));

var c2 = new CamlXmlBuilder().Merge("And", c1);
var c3 = new CamlXmlBuilder().And("Eq","Date","Date",new Date());
var c4 = new CamlXmlBuilder();
var c5 = new CamlXmlBuilder().Or("Eq","t","Text","1");
var c6 = new CamlXmlBuilder().Merge("Or",c2).Merge("Or",c3).Merge("Or",c4).End().ToString();
var c7 = CamlXmlBuilder.MergeList("Or",[c1,c2,c3,c4,c5]);
