/**
 * The class for constructing a dependency container.
 * @class Injector
 * @property {Object} container - The container instance.
 */
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
    constant(name, value, this.container);
    return this;
  }
  
  /**
   * Define a service on the injector's container.
   * @param {Function} Class
   * @param {string[]} dependencies
   * @returns {Injector} The Injector instance.
   */
  service(Class, dependencies) {
    service(Class, dependencies, this.container);
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
 * @param {Object} container
 * @returns {Object} The container instance.
 */
function constant(name, value, container) {
  if (arguments.length === 2) {
    return constant.bind(null, name, value);
  }
  
  Object.defineProperty(container, name, { value });
  return container;
}

/**
 * Resolve an instance on a container.
 * @private
 * @param {string} name
 * @param {Object} container
 * @returns {Object} The resolved instance.
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
 * @param {Object} container
 * @returns {Object} The container instance.
 */
function service(Class, dependencies, container) {
  if (arguments.length === 2) {
    return service.bind(null, Class, dependencies);
  }
  
  let instance;
    
  Object.defineProperty(container, Class.name, {
    get() {
      if (instance === undefined) {
        let resolving = dependencies.length;
        const resolvedDeps = new Array(resolving);
        while (resolving--) {
          resolvedDeps[resolving] = resolve(dependencies[resolving], container);
        }
        instance = new Class(...resolvedDeps);
      }
      return instance;
    }
  });
  
  return container;
}