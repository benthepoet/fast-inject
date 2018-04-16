const assert = require('assert');
const _ = require('underscore');
const fp = require('lodash/fp');
const R = require('ramda');

const { constant, service } = require('../');

describe('container', () => {
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
    constructor(c, f) {
      this.c = c;
      this.f = f;
    }
  }
  
  class F {
    constructor() {}
  }

  const libraries = [
    {
      name: 'ramda', 
      compose: R.pipe
    },
    {
      name: 'lodash',
      compose: fp.flow
    },
    {
      name: 'underscore',
      compose: _.compose
    }
  ];

  libraries.forEach(function (library) {
    it(`${library.name}: should resolve A and inject dependencies`, function () {
      const container = library.compose(
        constant('D', D),
        service(A, [B.name]),
        service(B, [C.name]),
        service(C, ['D'])
      )({});
      
      assert(container.A !== undefined, '\'A\' was undefined.');
      assert(container.A.b !== undefined, '\A.b\' was undefined.');
      assert.deepEqual(container.A.b, container.B, '\'B\' instances are not the same.');
    });
    
    it(`${library.name}: should resolve E and inject dependencies`, function () {
      const container = library.compose(
        constant('D', D),
        service(C, ['D'])
      )({});
      
      assert(container.C !== undefined, '\'C\' was undefined.');
      assert(container.C.d !== undefined, '\C.d\' was undefined.');
      assert.deepEqual(container.C.d, container.D, '\'D\' instances are not the same.');
    });
    
    it(`${library.name}: should resolve E and inject dependencies`, function () {
      const container = library.compose(
        constant('D', D),
        service(A, [B.name]),
        service(B, [C.name]),
        service(C, ['D']),
        service(E, [C.name, F.name]),
        service(F, [])
      )({});
      
      assert(container.E !== undefined, '\'E\' was undefined.');
      assert(container.E.c !== undefined, '\E.c\' was undefined.');
      assert.deepEqual(container.E.c, container.C, '\'C\' instances are not the same.');
      assert(container.E.f !== undefined, '\E.f\' was undefined.');
      assert.deepEqual(container.E.f, container.F, '\'F\' instances are not the same.');
    });
  });
});