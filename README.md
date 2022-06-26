caml builder is a tool for building caml query.

- typescript
- customization
- chain call
- max nest check
- Automatic nesting for maximum number of conditions

### use

see test

**none condiction to be empty**

```js
CamlBuilder.express().toString()
```

output: empty


**none condiction with End to be empty Query**

```js
CamlBuilder.express()
  .end()
  .toString()
```

output

```xml
<View><Query><Where/></Query></View>
```



**single And condiction Query**

```js
CamlBuilder.express()
  .and(
    'Eq',
    "TestField",
    'Text',
    "test"
  )
  .end()
  .toString()
```

output

```xml
<View>
  <Query>
    <Where>
      <Eq>
        <FieldRef Name='TestField' />
        <Value Type='Text'>test</Value>
      </Eq>
    </Where>
  </Query>
</View>
```

**single Or condiction Query**

```js
CamlBuilder.express()
  .or(
    'Eq',
    "TestField",
    'Text',
    "test"
  )
  .end()
  .toString()
```

output
```xml
<View>
  <Query>
    <Where>
      <Eq>
        <FieldRef Name='TestField' />
        <Value Type='Text'>test</Value>
      </Eq>
    </Where>
  </Query>
</View>
```

**Two Or condiction Query**

```js
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
```

output
```xml
<View>
  <Query>
    <Where>
      <Or>
        <Eq>
          <FieldRef Name='TestField' />
          <Value Type='Text'>test</Value>
        </Eq>
        <Eq>
          <FieldRef Name='TestField2' />
          <Value Type='Text'>test2</Value>
        </Eq>
      </Or>
    </Where>
  </Query>
</View>
```



**Two And condiction Query**

```js
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
```

output
```xml
<View>
  <Query>
    <Where>
      <And>
        <Eq>
          <FieldRef Name='TestField' />
          <Value Type='Text'>test</Value>
        </Eq>
        <Eq>
          <FieldRef Name='TestField2' />
          <Value Type='Text'>test2</Value>
        </Eq>
      </And>
    </Where>
  </Query>
</View>
```