const sheetModel = require('./sheet');
const clientModel = require('./client');
const log = require('./log');

exports.create = function() {

    var model = {
        sheet: sheetModel.create(),
        itemMap: {}, // item lookup map
        movable: {
            visible: ko.observable(false),
            top: ko.observable(0),
            left: ko.observable(0),
            width: ko.observable(100),
            height: ko.observable(100),
            offsetX: 0,
            offsetY: 0,
            item: null
        },
        action: {},
        complete: ko.observable([]),
        placedMap: {} // placed item lookup map
    };

    // Converts to data object.
    
    model.toJS = function() {
        return model.sheet.toJS();
    };

    // Helper to lookup item by id.
    
    model.lookupItem = function(id) {
        var item = model.itemMap[id];
        if (!item) {
            throw new Error('No item ' + id);
        }
        return item;
    };

    // Helper to lookup placed item by id.
    
    model.lookupPlaced = function(id) {
        var item = model.placedMap[id];
        if (!item) {
            throw new Error('No placed item ' + id);
        }
        return item;
    };

    // Helper to update the lookup map.
    // Called during deserialization.
    
    model.updateItemLookup = function(item) {
        model.itemMap[item.id] = item;
    };

    model.updatePlacedLookup = function(placed) {
        model.placedMap[placed.id] = placed;
    };

    // Initialize by the data or create
    // a new plan.

    model.initialize = function(data, order) {
        if (data) {
            model.sheet.update(data);
        } else {
            model.sheet.action.addClient();
            if (order) {
                // Create for the given order.
                model.sheet.name(order.name);
                model.sheet.orderId = order.id;
            }            
        }
    };

    // Returns object with top left and bottom
    // right coordinates.

    model.movable.rect = function() {
        var movable = model.movable;
        return {
            x1: movable.left(),
            y1: movable.top(),
            x2: movable.left() + movable.width(),
            y2: movable.top() + movable.height()
        };
    };

    // Moves "draggable" element.

    model.action.mouseMove = function(event) {
        var movable = model.movable;
        if (movable.visible()) {
            movable.left(event.clientX - movable.offsetX);
            movable.top(event.clientY - movable.offsetY);
            var placed = movable.type === 'placed' ? movable.placed : null;
            adjustSideState(model.sheet.side1(), event, movable, placed);
            adjustSideState(model.sheet.side2(), event, movable, placed);
        }
    };

    // Adjusts side intersect/target state.

    function adjustSideState(side, event, movable, placed) {
        side.adjustState(movable, event.clientX, event.clientY, placed);
    }

    // Movable is clicked.

    model.action.clickMovable = function(root, event) {
        log.debug('Movable is clicked.');
        // Trigger side state adjustment.
        model.action.mouseMove(event);
        var movable = model.movable;
        if (movable.visible()) {
            log.debug('Movable is visible.');
            var side1 = model.sheet.side1();
            var side2 = model.sheet.side2();
            if (!side1.inside() &&
                !side2.inside()) {
                movable.visible(false);
                log.debug('Movable was not inside either side.');
                return;
            }
            var item = movable.item;
            var adjust = !event.ctrlKey;
            var dropped = false;
            log.debug('Automatic adjustment: ' + adjust);
            if (movable.type === 'item') {
                dropped = dropped || tryDropItemInto(side1, item, adjust);
                dropped = dropped || tryDropItemInto(side2, item, adjust);
            } else {
                dropped = dropped || tryDropPlacedInto(side1, movable.placed, adjust);
                dropped = dropped || tryDropPlacedInto(side2, movable.placed, adjust);
            }
            if (dropped) {
                log.debug('Item or package dropped into place.');
                movable.visible(false);
            }
        }
    };

    function tryDropItemInto(side, item, adjust) {
        if (side.inside() &&
            !side.intersect()) {
            if (side.dropItem(item, adjust)) {
                side.target(false);
                side.intersect(false);
                side.inside(false);
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    function tryDropPlacedInto(side, placed, adjust) {
        if (side.inside() &&
            !side.intersect()) {
            if (side.dropPlaced(placed, adjust)) {
                side.target(false);
                side.intersect(false);
                side.inside(false);
                return true;
            } else {
                return false;
            }            
        }
        return false;
    }

    return model;
};
