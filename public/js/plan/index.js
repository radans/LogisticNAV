// The generic binding handler to clear up HTML.
// From: http://www.achadwick.com/DeveloperBlog/Result/Knockout-Generic-Binding

ko.bindingHandlers.generic = {
   init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
       ko.applyBindingsToNode(element, valueAccessor(), viewModel);
   }
};

ko.extenders.numeric = function(target) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target();
            if (typeof newValue === 'string' && newValue.match(/^\d*$/)) {
                if (newValue === '') {
                    target(newValue);
                } else {
                    var num = parseInt(newValue, 10);
                    if (num > 0 && num <= 15000) {
                        target(newValue);
                    } else {
                        target.notifySubscribers(current);
                    }
                }
            } else {
                target.notifySubscribers(current);
            }
        }
    }).extend({ notify: 'always' });
    //initialize with current value to make sure it is rounded appropriately
    result(target());
    //return the new computed observable
    return result;
};

// Loads KO components.
require('./components');
ko.applyBindings();
