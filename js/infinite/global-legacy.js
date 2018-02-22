// TODO refactor modules to use ES6 modules
// Needed by external modules: infinite_custom, odoscope-manager, infinite_wishlist

import AppConfig from './consts/app-config'
window.AppConfig = window.AppConfig || AppConfig;

import TrackingManager from './managers/tracking-manager'
window.TrackingManager = window.TrackingManager || TrackingManager;

import AjaxModel from './models/ajax-model'
window.AjaxModel = window.AjaxModel || AjaxModel;
