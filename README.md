# fast-inject

[![Build Status](https://travis-ci.org/benthepoet/fast-inject.svg?branch=master)](https://travis-ci.org/benthepoet/fast-inject)
[![Coverage Status](https://coveralls.io/repos/github/benthepoet/fast-inject/badge.svg?branch=master)](https://coveralls.io/github/benthepoet/fast-inject?branch=master)

A lightweight dependency injection container for Node.js.

## Node.js Support
This library currently supports Node.js >= 8.0.0.

## Why dependency injection in Node.js?
To be honest dependency injection isn't really necessary in Node.js most of the time due to 
its module-based design but I created this library because I wanted the following. 

* A lightweight container that I can instantiate on every HTTP request
* Lazy-loaded services that only get instantiated if they're used
* The ability to decouple modules for testing without needing `proxyquire`
* Eliminate relative paths to other modules

## Installation
This library is intended for use in Node.js projects and can be installed with `npm`. 

```bash
npm install fast-inject --save
```

## Creating a basic container
Containers are merely just an object with properties for constants or services. These constants or services 
are provided as singletons. Services are also lazy-loaded and thus only get instantiated if they are accessed.  

To setup a container you just create an `Injector` instance and register your constants and/or services.

```javascript
const { Injector } = require('fast-inject');

// Service class
class B {
  // Expects an instance of `A` to be injected.
  constructor(a) {
    this.a = a;
  }
}

// Service class
class C {
  // Expects an instance of `B` to be injected.
  constructor(b) {
    this.b = b;
  }
}

const { container } = new Injector()
  // Constants can provide any static value (string, number, Object, Function). 
  .constant('A', 1234)
  // Services must be defined as ES6 classes and can have dependencies.
  // Any dependencies are injected into the constructor when the service is instantiated.
  .service(B, ['A'])
  // Use the `name` property of the class when one service is dependent on another.
  .service(C, [B.name]);
  
// Access a constant
console.log(container.A);
// 1234

// Access a service
console.log(container.B.a);
// 1234

// Access a nested service
console.log(container.C.b.a);
// 1234
```


## Creating a container pipeline
In addition to using the approach above, `fast-inject` also allows you to build a container 
pipeline by means of functional composition. `Ramda` is used in the example below but you can 
use any library that supports function composition like `Lodash` or `Underscore.js`.

```javascript
const R = require('ramda');
const { constant, service } = require('fast-inject');

// Service class
class B {
  // Expects an instance of `A` to be injected.
  constructor(a) {
    this.a = a;
  }
}

// Service class
class C {
  // Expects an instance of `B` to be injected.
  constructor(b) {
    this.b = b;
  }
}

// Compose the pipeline
const pipeline = R.pipe(
  constant('A', 1234),
  service(B, ['A']),
  service(C, [B.name])
);

// Create a container
const container = pipeline(Object.create(null));
```

The functional approach also gives you the advantage of being able to compose multiple pipelines together.

# API

## Classes

<dl>
<dt><a href="#Injector">Injector</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#constant">constant(name, value, container)</a> ⇒ <code>Object</code></dt>
<dd><p>Define a constant on a container.</p>
</dd>
<dt><a href="#service">service(Class, dependencies, container)</a> ⇒ <code>Object</code></dt>
<dd><p>Define a service on a container.</p>
</dd>
</dl>

<a name="Injector"></a>

## Injector
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| container | <code>Object</code> | The container instance. |


* [Injector](#Injector)
    * [new Injector()](#new_Injector_new)
    * [.constant(name, value)](#Injector+constant) ⇒ [<code>Injector</code>](#Injector)
    * [.service(Class, dependencies)](#Injector+service) ⇒ [<code>Injector</code>](#Injector)

<a name="new_Injector_new"></a>

### new Injector()
The class for constructing a dependency container.

<a name="Injector+constant"></a>

### injector.constant(name, value) ⇒ [<code>Injector</code>](#Injector)
Define a constant on the injector's container.

**Kind**: instance method of [<code>Injector</code>](#Injector)  
**Returns**: [<code>Injector</code>](#Injector) - The Injector instance.  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| value | <code>\*</code> | 

<a name="Injector+service"></a>

### injector.service(Class, dependencies) ⇒ [<code>Injector</code>](#Injector)
Define a service on the injector's container.

**Kind**: instance method of [<code>Injector</code>](#Injector)  
**Returns**: [<code>Injector</code>](#Injector) - The Injector instance.  

| Param | Type |
| --- | --- |
| Class | <code>function</code> | 
| dependencies | <code>Array.&lt;string&gt;</code> | 

<a name="constant"></a>

## constant(name, value, container) ⇒ <code>Object</code>
Define a constant on a container.

**Kind**: global function  
**Returns**: <code>Object</code> - The container instance.  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| value | <code>\*</code> | 
| container | <code>Object</code> | 

<a name="service"></a>

## service(Class, dependencies, container) ⇒ <code>Object</code>
Define a service on a container.

**Kind**: global function  
**Returns**: <code>Object</code> - The container instance.  

| Param | Type |
| --- | --- |
| Class | <code>function</code> | 
| dependencies | <code>Array.&lt;string&gt;</code> | 
| container | <code>Object</code> | 

