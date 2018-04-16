module.exports = {
  constant,
  service
};

function constant(name, value) {
  return container => {
    const options = { value };
    Object.defineProperty(this.container, name, options);
    return container;
  };
}

function resolve(name, container) {
  const instance = container[name];
  if (!instance) {
    throw new Error(`Could not resolve '${name}'.`);
  }
  return instance;
}

function service(Service, dependencies) {
  return container => {
    let instance;
    
    Object.defineProperty(container, Service.name, {
      get: () => {
        if (!instance) {
          const resolvedDeps = dependencies.map(dep => resolve(dep));
          instance = new (Service.bind.apply(Service, [null].concat(resolvedDeps)));
        }
        return instance;
      }
    });
    
    return container;
  };
}