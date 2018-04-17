const assert = require('assert');
const _ = require('underscore');
const fp = require('lodash/fp');
const R = require('ramda');

const { Injector, constant, service } = require('../');

describe('Container Composition', () => {
  const A = 'A';
  
  class B {
    constructor(a, c) {
      this.a = a;
      this.c = c;
    }
  }
  
  class C {}

  describe('Functional', function () {
    const composers = [
      {
        name: 'reduce',
        compose(...pipes) {
          return container => {
            return pipes.reduce((obj, pipe) => pipe(obj), container);
          };
        }
      },
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
  
    composers.forEach(function ({ name, compose }) {
      describe(name, function () {
        it('should resolve a constant', function () {
          const container = compose(
            constant('A', A)
          )(Object.create(null));
          
          assert(container.A !== undefined, '\'A\' was undefined.');
          assert.deepEqual(container.A, A, '\'A\' instances are not the same.');
        });
        
        it('should resolve a service', function () {
          const container = compose(
            service(C, [])
          )(Object.create(null));
          
          assert(container.C !== undefined, '\C\' was undefined.');
        });
        
        it('should resolve a service with dependencies', function () {
          const container = compose(
            constant('A', A),
            service(B, ['A', C.name]),
            service(C, [])
          )(Object.create(null));
          
          assert(container.B !== undefined, '\B\' was undefined.');
          
          assert(container.B.a !== undefined, '\B.a\' was undefined.');
          assert.deepEqual(container.B.a, container.A, '\'A\' instances are not the same.');
          
          assert(container.B.c !== undefined, '\B.c\' was undefined.');
          assert.deepEqual(container.B.c, container.C, '\'C\' instances are not the same.');
        });
        
        it('should fail to resolve a service when dependencies can\'t be resolved', function () {
          const container = compose(
            service(B, ['A', C.name])
          )(Object.create(null));
          
          assert.throws(function () {
            container.B;
          }, Error);
        });
      });
    });
  });
  
  describe('Injector', function () {
    it('should resolve a constant', function () {
      const { container } = new Injector()
        .constant('A', A);
      
      assert(container.A !== undefined, '\'A\' was undefined.');
      assert.deepEqual(container.A, A, '\'A\' instances are not the same.');
    });
    
    it('should resolve a service', function () {
      const { container } = new Injector()
        .service(C, []);
      
      assert(container.C !== undefined, '\C\' was undefined.');
    });
    
    it('should resolve a service with dependencies', function () {
      const { container } = new Injector()
        .constant('A', A)
        .service(B, ['A', C.name])
        .service(C, []);
      
      assert(container.B !== undefined, '\B\' was undefined.');
      
      assert(container.B.a !== undefined, '\B.a\' was undefined.');
      assert.deepEqual(container.B.a, container.A, '\'A\' instances are not the same.');
      
      assert(container.B.c !== undefined, '\B.c\' was undefined.');
      assert.deepEqual(container.B.c, container.C, '\'C\' instances are not the same.');
    });
    
    it('should fail to resolve a service when dependencies can\'t be resolved', function () {
      const { container } = new Injector()
        .service(B, ['A', C.name]);
      
      assert.throws(function () {
        container.B;
      }, Error);
    });
  });
});