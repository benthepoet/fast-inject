# fast-inject

[![Build Status](https://travis-ci.org/benthepoet/fast-inject.svg?branch=master)](https://travis-ci.org/benthepoet/fast-inject)
[![Coverage Status](https://coveralls.io/repos/github/benthepoet/fast-inject/badge.svg?branch=master)](https://coveralls.io/github/benthepoet/fast-inject?branch=master)

A dependency injection container built around function composition.

## Node.js Support
This library currently supports Node.js >= 8.0.0.

## Installation
This library is intended for use in Node.js projects and can be installed with `npm`. 

```bash
npm install fast-inject --save
```

## Creating A Container
Containers are merely just an object with properties for constants or services. Services are only instantiated when called. 
Constants can provide any static value (string, number, Object, Function). Services must be defined as classes and can have dependencies 
on both constants and other services. Any dependencies are injected into a service constructor given that they've all been registered with 
the container.