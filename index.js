class Injector {
  constructor() {
    this.container = Object.create(null);
  }
  
  /**
   * Define a constant on the injector's container.
   * @param {string} name
   * @param {*} value
   * @returns {Injector} The Injector instance.
   */
  constant(name, value) {
    constant(name, value)(this.container);
    return this;
  }
  
  /**
   * Define a service on the injector's container.
   * @param {Function} Class
   * @param {string[]} dependencies
   * @returns {Injector} The Injector instance.
   */
  service(Class, dependencies) {
    service(Class, dependencies)(this.container);
    return this;
  }
}

module.exports = {
  Injector,
  constant,
  service
};

/**
 * Define a constant on a container.
 * @param {string} name
 * @param {*} value
 */
function constant(name, value) {
  return container => {
    Object.defineProperty(container, name, { value });
    return container;
  };
}

/**
 * Resolve an instance on a container.
 * @param {string} name
 * @param {Object} container
 */
function resolve(name, container) {
  const instance = container[name];
  if (instance === undefined) {
    throw new Error(`Could not resolve '${name}'.`);
  }
  return instance;
}

/**
 * Define a service on a container.
 * @param {Function} Class
 * @param {string[]} dependencies
 */
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