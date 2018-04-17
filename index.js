class Injector {
  constructor() {
    this.container = Object.create(null);
  }
  
  constant(name, value) {
    constant(name, value)(this.container);
    return this;
  }
  
  service(Service, dependencies) {
    service(Service, dependencies)(this.container);
    return this;
  }
}

module.exports = {
  Injector,
  constant,
  service
};

function constant(name, value) {
  return container => {
    Object.defineProperty(container, name, { value });
    return container;
  };
}

function resolve(name, container) {
  const instance = container[name];
  if (instance === undefined) {
    throw new Error(`Could not resolve '${name}'.`);
  }
  return instance;
}

function service(Class, dependencies) {
  return container => {
    let instance;
    
    Object.defineProperty(container, Class.name, {
      get() {
        if (!instance) {
          const resolvedDeps = dependencies.map(dep => resolve(dep, container));
          instance = new (Class.bind(Class, ...resolvedDeps));
        }
        return instance;
      }
    });
    
    return container;
  };
}