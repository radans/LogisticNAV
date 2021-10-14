const randid = require('./randid');
const itemModel = require('./item');

exports.create = function() {

    var model = {
        name: ko.observable(''),
        order: ko.observable(''),
        items: ko.observableArray([]),
        focus: ko.observable(false),
        zipcode: ko.observable(''),
        action: {}
    };

    model.toJS = function() {
        return {
            name: model.name(),
            order: model.order(),
            zipcode: model.zipcode(),
            items: model.items().map(function(item) {
                return item.toJS();
            })
        };
    };

    model.update = function(data) {
        model.name(data.name);
        model.order(data.order);
        if (data.zipcode) {
            model.zipcode(data.zipcode);
        }
        model.items(data.items.map(function(itemData) {
            var item = itemModel.create();
            item.client(model);
            item.update(itemData);
            return item;
        }));
    };

    model.removeItem = function(item) {
        model.items.remove(item);
    };

    // Handler to add a new item.

    model.action.addItem = function() {
        model.addItem();
    };

    model.addItem = function() {
        var item = itemModel.create();
        item.client(model);
        model.items.push(item);
        item.focus(true);
    };

    // Handler to remove the client.
    
    model.action.remove = function() {
        if (confirm('Kustuta klient?')) {
            window.model.sheet.removeClient(model);
        }
    };

    model.nameWithOrder = ko.pureComputed(() => {
        const name = model.zipcode() ? `${model.name()} - ${model.zipcode()}` : model.name();
        if (window.model.sheet.useOrder()) {
            if (model.order()) {
                return `${model.order()}. ${name}`;
            }
        }
        return name;
    });

    return model;
};
