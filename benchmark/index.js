const Benchmark = require('benchmark');
const R = require('ramda');
const fp = require('lodash/fp');
const _ = require('underscore');
const Bottle = require('bottlejs');
const { Injector, service } = require('../');

const suite = new Benchmark.Suite();

class A {
  constructor(b) {
    this.b = b;
  }
}

class B {
  constructor(c) {
    this.c = c;
  }
}

class C {}

function reducer(...pipes) {
  let p = pipes.length;
  return function (container) {
    while (p--) {
      pipes[p](container);
    }
    return container;
  }
}

suite
  .add('reducer', function () {
    const container = reducer(
      service(A, [B.name]),
      service(B, [C.name]),
      service(C, [])
    )(Object.create(null));
      
    container.A;
  })
  .add('ramda', function () {
    const container = R.pipe(
      service(A, [B.name]),
      service(B, [C.name]),
      service(C, [])
    )(Object.create(null));

    container.A;
  })
  .add('lodash', function () {
    const container = fp.flow(
      service(A, [B.name]),
      service(B, [C.name]),
      service(C, [])
    )(Object.create(null));

    container.A;
  })
  .add('underscore', function () {
    const container = _.compose(
      service(A, [B.name]),
      service(B, [C.name]),
      service(C, [])
    )(Object.create(null));

    container.A;
  })
  .add('Injector', function () {
    const { container } = new Injector()
      .service(A, [B.name])
      .service(B, [C.name])
      .service(C, []);
      
    container.A;
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });