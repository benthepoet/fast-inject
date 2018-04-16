const _ = require('underscore');

const { constant, service } = require('../index');

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

class C {
  constructor(d) {
    this.d = d;
  }
}

const D = 'D';

class E {
  constructor(a, c) {
    this.a = a;
    this.c = c;
  }
}

const buildContainer = 
  _.compose(
    constant('D', D),
    service(A, [B.name]),
    service(B, [C.name]),
    service(C, ['D']),
    service(E, [A.name, C.name])
  );
  
const container = buildContainer({});

console.log(container.A);
console.log(container.E);