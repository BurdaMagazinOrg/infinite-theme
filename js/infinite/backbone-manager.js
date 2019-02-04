// Define View Manager to manage view states
window.BM = window.BM || {};

// BM.views hold all references to existing views
BM.views = BM.views || {};
BM.models = BM.models || {};

// Close existing view
BM.closeView = function(name) {
  if (typeof BM.views[name] !== 'undefined') {
    // Cleanup view
    // Remove all of the view's delegated events
    BM.views[name].undelegateEvents();
    // Remove view from the DOM
    BM.views[name].remove();
    // Removes all callbacks on view
    BM.views[name].off();

    if (typeof BM.views[name].close === 'function') {
      BM.views[name].close();
    }
  }
};

// BM.createView always cleans up existing view before
// creating a new one.
// callback function always return a new view instance
BM.createView = function(name, pComponent) {
  BM.closeView(name);
  BM.views[name] = pComponent;
  return BM.views[name];
};

// BM.reuseView always returns existing view. Otherwise it
// execute callback function to return new view
// callback function always return a new view instance
BM.reuseView = function(name, pComponent) {
  if (typeof BM.views[name] !== 'undefined') {
    return BM.views[name];
  }

  BM.views[name] = pComponent;
  return BM.views[name];
};

/**
 * MODELS
 */

BM.clearModel = function(name) {
  if (typeof BM.models[name] !== 'undefined') {
    // Cleanup model
    BM.models[name].clear();

    if (typeof BM.views[name].destroy === 'function') {
      BM.views[name].destroy();
    }
  }
};

/**
 * Create Model
 * @param name
 * @param pModel
 * @returns {BackboneModel}
 */

BM.createModel = function(name, pModel) {
  BM.clearModel(name);
  BM.models[name] = pModel;
  return BM.models[name];
};

/**
 * ReuseModel
 * @param name
 * @param pModel
 * @returns {BackboneModel}
 */

BM.reuseModel = function(name, pModel) {
  if (typeof BM.models[name] !== 'undefined') {
    return BM.models[name];
  }

  BM.models[name] = pModel;
  return BM.models[name];
};
