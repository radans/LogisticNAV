const randid = require('./randid');
const keys = require('./keys');

exports.create = function() {

    var model = {
        id: randid(),
        left: ko.observable(0),
        top: ko.observable(0),        
        package: ko.observable(),
        action: {},
        dragOffset: { x: 0, y: 0 },
        main: ko.observable(true),
        peer: ko.observable()
    };

    // Converts to data object.
    
    model.toJS = function() {
        var peer = model.peer();
        return {
            id: model.id,
            left: model.left(),
            top: model.top(),
            package: model.package().id,
            main: model.main(),
            peer: peer ? peer.id : null
        };
    };

    // Updates the model using the given data.
    // Assumes that items are already loaded
    // and the current sheet is selected.

    model.update = function(data) {
        model.left(data.left);
        model.top(data.top);
        var item = window.model.lookupItem(data.package);        
        model.package(item);
        if (typeof data.main === 'boolean') {
            model.main(data.main);
            if (data.main) {
                item.placedCount(item.placedCount() + 1);
            }
        }
        if (typeof data.id === 'string') {
            model.id = data.id;
        }
        // Transient. Peer resolved in next step.
        model.peerId = data.peer;
        window.model.updatePlacedLookup(model);
    };

    // Updates peers after deserialization.

    model.updatePeer = function() {
        if (model.peerId) {
            model.peer(window.model.lookupPlaced(model.peerId));
        }
    };

    model.action.click = function(target, event) {
        if (keys.isDown(88)) {
            // Removes item.
            window.model.sheet.removePlaced(model);
        } else {
            // Starts drag process.
            var movable = window.model.movable;
            if (!movable.visible()) {
                var target = event.target;
                var rect = target.getBoundingClientRect();
                model.dragOffset.x = event.clientX - rect.left,
                model.dragOffset.y = event.clientY - rect.top;            
                movable.offsetX = model.dragOffset.x;
                movable.offsetY = model.dragOffset.y;
                movable.top(event.clientY - movable.offsetY);
                movable.left(event.clientX - movable.offsetX);
                movable.height(rect.height);
                movable.width(rect.width);
                movable.visible(true);
                movable.item = model.package();
                movable.placed = model;
                movable.type = 'placed';
            }
        }
    };

    model.orderString = ko.pureComputed(function() {
        var package = model.package();
        if (package) {
            return package.orderString();
        }
        return '';
    });

    // Helper to bind the item to DOM.

    model.binding = {
        style: {
            left: ko.pureComputed(function() {
                return model.left() + 'px';
            }),
            top: ko.pureComputed(function() {
                return model.top() + 'px';
            }),
            height: ko.pureComputed(function() {
                return model.package().dimensions.height() + 'px';
            }),
            width: ko.pureComputed(function() {
                return model.package().dimensions.width() + 'px';
            }),
            'background-color': ko.pureComputed(function() {
                return model.package().background();
            })
        },
        click: model.click
    };

    return model;
};
