const Benchmark = require('benchmark');
const { Injector, service } = require('./');

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

const reducer = (...pipes) => {
  return container => pipes.reduce((obj, pipe) => pipe(obj), container);
};

suite
  .add('reduce', function () {
    const container = reducer(
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