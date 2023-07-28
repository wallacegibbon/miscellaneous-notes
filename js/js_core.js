//////////////////////////////////////////////////////////////////////////////
/// ArrayBuffer is just like the result of malloc in C. It can be manipulated
/// by "views" (like pointer type converting in C).
/// e.g.
/// TypedArray(Uint8Array, Float64Array...) are like (uint8_t *) and (double *)
///
new Uint32Array([ 2 ** 16 ]);
//> Uint32Array [ 65536 ]

/// use 'buffer' attribute to get the raw buffer from a view
new Uint32Array([ 2 ** 16 ]).buffer;
//> ArrayBuffer { byteLength: 4 }

/// you can do
new Uint8Array(new Uint32Array([ 2 ** 16 ]).buffer);
//> Uint8Array(4) [ 0, 0, 1, 0 ]

new Uint8Array(new Uint32Array([ 2 ** 16 - 1]).buffer);
//> Uint8Array(4) [ 255, 255, 0, 0 ]

new Uint8Array(new Float64Array([ Math.PI ]).buffer);
//> Uint8Array(8) [ 24, 45, 68, 84, 251, 33, 9, 64 ]


//////////////////////////////////////////////////////////////////////////////
/// You can NOT access `arguments` with the ES6 `=>`
(function() { return arguments; })(1, 2, 3);
//> { "0": 1, "1": 2, "2": 3 }

(() => arguments)(1, 2, 3);
//> ReferenceError: arguments is not defined


//////////////////////////////////////////////////////////////////////////////
/// To access the prototype chain of an object, just use `__proto__`, all
/// objects have this attribute
var x = {};
for (var i in x) console.log(i, ":", x[i]);
//> undefined

x.__proto__ = { ah: true, blah: true };
for (var i in x) console.log(i, ":", x[i]);
//  ah : true
//  blah : true
//> undefined

/// `__proto__` and `prototype`
[].__proto__ === [ 1, 2, 3 ].__proto__ && [].__proto__ === Array.prototype;
//> true

/// For any function F
F.prototype.constructor === F;
//> true

/// e.g.
Number.prototype.constructor === Number;
//> true
String.prototype.constructor === String;
//> true


//////////////////////////////////////////////////////////////////////////////
/// Javascript support `in` operator, which works DIFFERENT from the
/// `in` of Python.

/// For Objects, it works just like python
"a" in { "a": 1, "b": 2 };
//> true

1 in { "a": 1, "b": 2 };
//> false

/// But for Arrays, it's different, because js treats Array like Objects who's
/// keys are numbers.
/// [ "a", "b" ] is treated as { 0: "a", 1: "b" } in this case.

/// So
1 in [ "a", "b" ];
//> true
2 in [ "a", "b" ];
//> false
"a" in [ "a", "b" ];
//> false


//////////////////////////////////////////////////////////////////////////////
/// In modern JS, the "in" and "delete" operator is not necessary,
/// use "Reflect.has" instead of "in",
/// "Reflect.deleteProperty" instead of "delete"
a = { a: 1, b: 2, c: 3 };
Reflect.has(a, "a");
//> true
Reflect.deleteProperty(a, "a");
//> true
a;
//> {b: 2, c: 3}
Reflect.has(a, "a");
//> false

/// Reflect.has is really same as in, it checks the key.
Reflect.has([ "a", "b", "c" ], "a");
//> false
Reflect.has([ "a", "b", "c" ], 1);
//> true


/// To check whether a Array contains a certain element, use `indexOf`
[ "a", "b" ].indexOf("a");
//> 0
[ "a", "b" ].indexOf("b");
//> 1
[ "a", "b" ].indexOf("c");
//> -1

/// Or you can use "includes" methods in modern JS
[ "a", "b" ].includes("a");
//> true


//////////////////////////////////////////////////////////////////////////////
/// a good way to check array (outdated, you can use `Array.isArray` now
function isArray(obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
}

/// The reason why you need compare array in such a wierd way:
///  "array created by different "iframe" don't share the same prototype !"
/// So you can NOT just simply:
///  arr instanceof Array
///  arr.constructor == Array


//////////////////////////////////////////////////////////////////////////////
/// `this` in different *invocation patterns*
/// `this` is a **super late** binding, it is bound to a value only when the
/// function is called(the invocation).

/// `this` have no relationship with the *definition*, but with the
/// *invocation* (i.e. the function calling).

/// When you **call** a function in *function invocation pattern* instead of
/// *method invocation pattern*,
/// `this` will be bind to the global object(the `window` object for browser).

/// There are 4 patterns of invoking functions
///  * FUNCTION    invocation pattern
///  * METHOD      invocation pattern
///  * CONSTRUCTOR invocation pattern
///  * APPLY       invocation pattern

/// In the following example, the inner function is called in
/// *function invocation pattern*,
/// in this case, `this` is bound to global object.
var o = { i: 3 };

o.f1 = function() {
	return (function() { return this.i })();
};

o.i;
//> 3
o.f1();
//> undefined

i = 9;
o.f1();
//> 9


/// `new`: the *constructor invocation pattern*
function Person() {};
var p = new Person();

/// This is what `new` does in the background:
var p = {};
p.__proto__ = Person.prototype;
Person.call(p);


//////////////////////////////////////////////////////////////////////////////
/// `apply` and `call`
/// They are just like the same name function in lisp
func.apply(obj, [ var1, var2, var3 ]);
func.call(obj, var1, var2, var3);

/// An example to show how it works:
function add() { return this.a + this.b }
add();
//> NaN

var a = 1, b = 2;
add();
//> 3

add.apply({ a: 5, b: 3 });
//> 8

/// this function have no argument, so "call" works the same as "apply":
add.call({ a: 5, b: 3 });
//> 8

/// An even simpler example:
"what".toUpperCase();
//> 'WHAT'
"what".toUpperCase.call("blah");
//> 'BLAH'


//////////////////////////////////////////////////////////////////////////////
/// `bind` can do what `call` or `apply` can do
/// you can bind a function multiple times
/// e.g.
function a() { return this.m }
//> [Function: a]
a.bind({ m: 2 })();
//> 2
a.bind({ m: 4 })();
//> 4


//////////////////////////////////////////////////////////////////////////////
/// ! when using ES6's `=>`, `call`, `apply`, `bind` will not work
var a = () => this.x;
a();
//> undefined
a.call({ x: 8 });
//> undefined
a.bind({ x: 5 })();
//> undefined


//////////////////////////////////////////////////////////////////////////////
/// Object.create

/// Some implementations of Object.create

Object.create = function (obj) {
	function F() {};
	F.prototype = obj;
	return new F();
}

Object.create = function (obj) {
	var B = {};
	Object.setPrototypeOf(B, obj);
	return B;
}

Object.create = function (obj) {
	var B = {};
	B.__proto__ = obj;
	return B;
}

/// One usage of Object.create

function A() {
	this.a = 1;
	this.b = 2;
}

A.prototype.aa = function() { console.log(this.a); }

var a = new A();
a
//> { a: 1, b: 2 }
a.aa();
//  1
//> undefined

/// We can create a object whose __proto__ is A,
/// but doesn't have attribute `a` and `b`.
var b = Object.create(A.prototype);

/// this is useful when emulating inheritance in Old-styled Javascript.
/// e.g.

function Parent(name) {
	this.name = name;
}

Parent.prototype.get_name = function() {
	console.log(this.name);
}

function Child(name, age) {
	Parent.call(this, name);
	this.age = age;
}

Child.prototype = Object.create(Parent.prototype);
/// The following way also works:
/// Child.prototype = new Parent();
/// But it will create a useless `name` attribue.
/// What we want is only the `__proto__` that points to `Parent.prototype`.

Child.prototype.constructor = Child;

var c = new Child("wallace", 30);

c.get_name();
//  wallace
//> undefined

JSON.stringify(c);
//> '{"name":"wallace","age":30}'


//////////////////////////////////////////////////////////////////////////////
/// Something about multiple `.`
var a = { name: "a", b: { name: "b" } };
a.b.f = function() { return this.name };

a.b.f();
//> 'b'
// So the `this` in this case is `a.b`, not `a` !


//////////////////////////////////////////////////////////////////////////////
/// `Array.sort` (the comparing function should return -1, 0, 1, not a boolean)
var test = [ { a: [4, 2, 3], b: 3 }, { a: [2, 1, 3] }, { a: [8, 0] } ];
test.sort((e1, e2) =>  e1["a"][1] - e2["a"][1]);
//> [ { a: [ 8, 0 ] }, { a: [ 2, 1, 3 ] }, { a: [ 4, 2, 3 ], b: 3 } ]


//////////////////////////////////////////////////////////////////////////////
/// `Array.map` can take two arguments
[ "Judy", "Nick", "Flash" ].map((n) => n);
//> [ 'Judy', 'Nick', 'Flash' ]
[ "Judy", "Nick", "Flash" ].map((n, i) => i + ":" + n);
//> [ '0:Judy', '1:Nick', '2:Flash' ]


//////////////////////////////////////////////////////////////////////////////
/// Animation in web browser
/// setInterval            call a function again and again, in certain period
/// setTimeout             call a function in a certain timeout
/// requestAnimationFrame  this is the most efficient way for animation

/// setInterval will not stop once it started,
/// setTimeout and requestAnimationFrame will only call the function once.

/// Usage:
setInterval(() => console.log("hi"), 2000);
setTimeout(() => console.log("hi"), 2000);
requestAnimationFrame(() => console.log("hi"));

/// setTimeout can take arguments (so does setInterval)
setTimeout((x, y) => console.log("args:", x, y), 1000, "a", "b");
//> args: a b

/// setTimeout can make you function asynchronous.
///  (if you don't give time argument to setTimeout, it will default to be 4ms)

/// content in "a.js"
function myfunc(n) { console.log("myfunction:", n) }
setTimeout(myfunc, void 0, 1);
myfunc(2);
console.log(3);

/// Then you run: `node a.js`:
/// myfunction: 2
/// 3
/// myfunction: 1


//////////////////////////////////////////////////////////////////////////////
// Convert between *char* and *integer*
String.fromCharCode(75);
//> "K"
"K".charCodeAt(0);
//> 75

// String.fromCharCode can take multiple arguments
String.fromCharCode(97, 98, 99, 100, 101);
//> 'abcde'

// `somestring[0]` is same as `somestring.charAt(0)`
"K".charAt(0);
//> 'K'


//////////////////////////////////////////////////////////////////////////////
/// `escape`             will not encode: @*/+
/// `encodeURI`          will not encode: ~!@#$&*()=:/,;?+'
/// `encodeURIComponent` will not encode: ~!*()'

/// For ascii characters, `escape` works just like `encodeURI`.
///  (not same, but similar).
escape("hello world!");
//> 'hello%20world%21'
encodeURI("hello world!");
//> 'hello%20world!'

/// But for non-ascii, they are different:
///  `escape` use UTF-16 while `encodeURI` use UTF-8.
escape("中文");
//> "%u4E2D%u6587"
unescape("%u4E2D%u6587");
//> "中文"

encodeURI("中文");
//> "%E4%B8%AD%E6%96%87"
decodeURI("%E4%B8%AD%E6%96%87");
//> "中文"

/// `encodeURIComponent` is almost like `encodeURI`.
encodeURI("中文/what?");
//> "%E4%B8%AD%E6%96%87/what?"
encodeURIComponent("中文/what?");
//> "%E4%B8%AD%E6%96%87%2Fwhat%3F"


//////////////////////////////////////////////////////////////////////////////
/// ES2015 === ES6, ES2016 === ES7


//////////////////////////////////////////////////////////////////////////////
/// Time related operation (same on nodejs and browser)
new Date().toString();
//> "Wed Sep 14 2016 00:14:20 GMT+0800 (CST)"

new Date().toISOString();
//> "2016-09-13T16:14:16.415Z"

/// To get current time micro-seconds
new Date().getTime();
//> 1475479101650

/// or
Date.now();
//> 1475479102462

//////////////////////////////////////////////////////////////////////////////
/// In JS, `void <expression>` evaluates the given <expression> and then
/// returns `undefined`. So when you want to get `undefined`, you can use
/// `void 0`, it will always return `undefined`.
///
/// Why don't you just write `undefined` ?
/// Because in some situation, what you write will be treated as String,
/// So `void 0` can make sure you get `undefined`, not `"undefined"`.

/// e.g.
var counter = 1;
void (counter += 1);
//> undefined
counter;
//> 2

/// `function() {...}` is a declaration, not an expression. But with a `void`,
/// it will be treated as an expression.
void function() { console.log("hi") }();

/// But I prefer this way:
(function() { console.log("hi") })();
/// or
(function() { console.log("hi") }());


//////////////////////////////////////////////////////////////////////////////
/// In javascript, these are treated as false:
///     0, NaN, "", undefined, null, false
/// But [] and {} are true, which is different from python


//////////////////////////////////////////////////////////////////////////////
/// You can see people use `~` with `indexOf`
/// Because `Array.indexOf` will return `-1` when the nothing find.
/// and `~ -1 === 0`
/// e.g.
~blah.indexOf("blah") ? "yes" : "no";
/// but in modern JS, using Array.includes is a better choice


//////////////////////////////////////////////////////////////////////////////
/// `?:` is right-associativity
true ? false : 1 ? 2 : 3;
//> false

(true ? false : 1) ? 2 : 3;
//> 3

true ? false : (1 ? 2 : 3);
//> false


//////////////////////////////////////////////////////////////////////////////
/// javascript list operations:
///  push    & pop   : add & remove on last  element
///  unshift & shift : add & remove on first element


//////////////////////////////////////////////////////////////////////////////
/// The key for object have to be String, or it will be converted to String
a = { 0: 1, "0": 2 };
//> { '0': 2 }


//////////////////////////////////////////////////////////////////////////////
/// javascript function's arguments are stored in a local variable
/// called `arguments` (it's an object, not Array)

/// e.g.
function a() {
	console.log(
		"arguments:", arguments, "\nisArray:",
		Array.isArray(arguments)
	);
}
//> undefined

a(1, 2, 3, 4);
//  arguments: { '0': 1, '1': 2, '2': 3, '3': 4 }
//  isArray: false
//> undefined


//////////////////////////////////////////////////////////////////////////////
/// Convert non-Array object to Array object
///  * the object need to have a `length` attribute (for `slice` function)
function toArray(obj) {
	return Array.prototype.slice.call(obj);
}

/// another way to show this:
var a = { 0: "hello", 1: "world" };
a;
//> { '0': 'hello', '1': 'world' }

Array.prototype.slice.call(a);
//> []

a.length = 2;
//> 2
Array.prototype.slice.call(a);
//> [ 'hello', 'world' ]

a.length = 4;
//> 4
Array.prototype.slice.call(a);
//> [ 'hello', 'world', ,  ]


//////////////////////////////////////////////////////////////////////////////
/// Array and String have very similar attributes and methods.
/// Unlike Java, String have `.length`, NOT `.length()`.
a = ["a", "b", "c", "d", "e"];
//> [ 'a', 'b', 'c', 'd', 'e' ]
b = "abcde";
//> 'abcde'
a.length;
//> 5
b.length;
//> 5

/// The `slice` method works in similar way for String and unnested Array.
a.slice();
//> [ 'a', 'b', 'c', 'd', 'e' ]
b.slice();
//> 'abcde'
a.slice(3);
//> [ 'd', 'e' ]
b.slice(3);
//> 'de'
a.slice(1,4);
//> [ 'b', 'c', 'd' ]
b.slice(1,4);
//> 'bcd'


//////////////////////////////////////////////////////////////////////////////
/// BASE64 encoding and decoding

/// in Web Browser
btoa("hello, world");
//> "aGVsbG8sIHdvcmxk"

atob("aGVsbG8sIHdvcmxk");
//> "hello, world"

/// in Node.js
Buffer.from("hello, world").toString("base64");
//> 'aGVsbG8sIHdvcmxk'

Buffer.from("aGVsbG8sIHdvcmxk", "base64").toString();
//> 'hello, world'


//////////////////////////////////////////////////////////////////////////////
/// Regular Expression parameters:
/// g: global match(find all matches rather than stopping after the first match)
/// i: ignore case
/// m: multiline
/// u: unicode(treat pattern as a sequence of unicode code points)

/// e.g. (3 ways to create RegExp with parameters)
new RegExp("\\w+", "i");
new RegExp(/\w+/, "i");
/\w+/i;

/// !!!
/// In javascript, the "m" flag does NOT change the behavior of ".".
/// So to match a pattern across multiple lines,
/// the character set [^] can be used.

/// A example for multiple lines matching
var a = "abc\ndef\nghi";

/([^\n]*)\n(.*)/m.exec(a);
//> [ 'abc\ndef', 'abc', 'def', ... ]

/([^\n]*)\n([^]*)/.exec(a);
//> [ 'abc\ndef\nghi', 'abc', 'def\nghi', ... ]

// Do multiple match, use `string.match` instead of `regexp.exec`
/^[^\s]+/mg.exec("\r\nwhat\ris\nthis?\n");
//> [ "what" ]

"\r\nwhat\ris\nthis?\n".match(/^[^\s]+/mg);
//> [ "what", "is", "this?" ]

// string.replace
"what123is".replace(/([0-9])/, "-" + "$1" + "-");
//> "what-1-23is"

"what123is".replace(/([0-9])/g, "-" + "$1" + "-");
//> "what-1--2--3-is"


//////////////////////////////////////////////////////////////////////////////
/// The `Spidermonkey` specific way to do deep copy. (`eval` & `uneval`)
var a = [1, 2, 3, 4, 5];
var b = eval(uneval(a));
a === b;
//> false

/// You can test it in "Firefox Web Browser" and "CouchDB".

/// Modern Javascript has `structuredClone` for deep clone.

