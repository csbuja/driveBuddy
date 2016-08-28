# itypeof
general data types for values

#### How to use

```js
var itypeof = require('itypeof');

console.log( itypeof('i am a string') ) // -> string
console.log( itypeof(true) ) // -> boolean
console.log( itypeof({'iobj':true}) ) // -> object
console.log( itypeof(/i am a regexp/) ) // -> regexp
console.log( itypeof(['i am in an array']) ) // -> array
console.log( itypeof(function(){}) ) // -> function
console.log( itypeof(3) ) // -> number
console.log( itypeof(null) ) // -> null
console.log( itypeof(undefined) ) // -> undefined

function Foo() {
  this.foo = "foo"  
}
console.log( itypeof(new Foo) ); // -> object
```

Please Note:

The regular typeof function will give you `object` if it tests a regexp.

eg.

```js
// regular typeof
console.log( typeof /i am a regexp/ ) // -> object
console.log( typeof(/i am a regexp/) ) // -> object
```

This is the main difference.

enjoy!
