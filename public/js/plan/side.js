const placedItem = require('./placed_item');
const keys = require('./keys');

exports.create = function(index, sheet) {
    if (!sheet) {
        throw new Error('Sheet is not set.');
    }
    var model = {
        index: index,
        items: ko.observableArray([]),
        intersect: ko.observable(false),
        target: ko.observable(false),
        inside: ko.observable(false),
        action: {},
        inner: null, // inner element for coordinates, cached
        movable: { x1: 0, y1: 0 } // translated during state update
    };

    // Converts the side to a data object.

    model.toJS = function() {
        return {
            items: model.items().map(function(item) {
                return item.toJS();
            })
        };
    };

    // Updates from the given data object.
    
    model.update = function(data) {
        model.items(data.items.map(function(itemData) {
            var item = placedItem.create();
            item.update(itemData);
            return item;
        }));
    };

    // Removes all placed items.

    model.action.removeAllPlaced = function() {
        if (confirm('Eemalda paigutatud pakid?')) {
            model.removeAllPlaced();
        }
    };

    model.removeAllPlaced = function() {
        model.items().forEach(function(placed) {
            var item = placed.package();
            item.placedCount(item.placedCount() - 1);
        });
        model.items([]);
    };

    // Item from packages list is dropped.
    // Assumes that state update has been ran.
    // Returns true if successfully placed.

    model.dropItem = function(item, adjust) {
        var placed = placedItem.create();
        placed.package(item);
        var location = model.adjusted(placed, adjust);
        placed.top(location.top);
        placed.left(location.left);
        if (item.double()) {
            var coords = {
                x1: location.left,
                y1: location.top,
                x2: location.left + item.dimensions.width(),
                y2: location.top + item.dimensions.height()
            };
            var other = model.opposite();
            if (other.hasIntersect(coords, null)) {
                // Cannot place. Blocked by something.
                return false;
            } else {
                // Peer placed item for the other side.
                var peer = placedItem.create();
                peer.package(item);
                peer.top(location.top);
                peer.left(location.left);
                // Sets up peer relationship.
                peer.main(false);
                peer.peer(placed);
                placed.peer(peer);
                item.placedCount(item.placedCount() + 1);
                model.items.push(placed);
                other.items.push(peer);
                return true;
            }
        } else {
            item.placedCount(item.placedCount() + 1);
            model.items.push(placed);
            return true;
        }
    };

    // Already placed item is dropped (moved).
    // Assumes that state update has been ran.

    model.dropPlaced = function(placed, adjust) {
        var item = placed.package();
        var location = model.adjusted(placed, adjust);
        if (item.double()) {
            if (model.items().indexOf(placed) < 0) {
                // Side switch not allowed.
                return false;
            }
            var coords = {
                x1: location.left,
                y1: location.top,
                x2: location.left + item.dimensions.width(),
                y2: location.top + item.dimensions.height()
            };
            var other = model.opposite();
            var peer = placed.peer();
            if (other.hasIntersect(coords, peer)) {
                // Cannot be placed. Blocked.
                return false;
            } else {
                // Updates both.
                placed.top(location.top);
                placed.left(location.left);
                peer.top(location.top);
                peer.left(location.left);
                return true;
            }
        } else {
            // Swap side when needed.
            if (model.items().indexOf(placed) < 0) {
                var other = model.opposite();
                other.items.remove(placed);
                model.items.push(placed);
            }
            placed.top(location.top);
            placed.left(location.left);
            return true;
        }
    };

    // Finds the opposite side of the truck.

    model.opposite = function() {
        var side1 = window.model.sheet.side1();
        var side2 = window.model.sheet.side2();
        return model === side1 ? side2 : side1;
    };

    // Finds adjusted coordinaates.

    model.adjusted = function(placed, adjust) {
        // Uses values from state calculation.
        var top = Math.round(model.movable.y1);
        var left = Math.round(model.movable.x1);
        if (adjust) {
            return adjustIteration(placed, top, left, 1);
        } else {
            return { top: top, left: left };
        }
    };

    // Checks whether the given coords have
    // intersection with the placed item.

    function hasIntersection(coords, placed) {
        var item = placed.package();
        var x1 = placed.left();
        var y1 = placed.top();
        var x2 = x1 + item.dimensions.width();
        var y2 = y1 + item.dimensions.height();
        return coords.x1 < x2 && coords.x2 > x1 && coords.y1 < y2 && coords.y2 > y1;
    }

    // Helper to iteratively adjust the position until intersection
    // or until min bottom/left is found.

    function adjustIteration(placed, top, left, iterCount) {
        // Try to adjust.
        var item = placed.package();
        var width = item.dimensions.width();
        var height = item.dimensions.height();
        // In viewport coordinates.
        var placedRect = {
            x1: left,
            y1: top,
            x2: left + width,
            y2: top + height
        };
        if (keys.isDown(68)) { // D
            // Allows to place where the pack intersects
            // with another pack.
            return { top: top, left: left };
        }
        // Placement helper, adjusts coordinates.
        var supportY = findSupportY(placed, placedRect);
        var adjustedTop = supportY - height;
        var adjustedCoords = {
            x1: placedRect.x1,
            y1: adjustedTop,
            x2: placedRect.x2,
            y2: adjustedTop + height
        };
        if (model.hasIntersect(adjustedCoords, placed)) {
            // Adjustment failed.
            // Finish here.
            return { top: top, left: left };
        }
        var adjustedLeft = left;
        if (!keys.isDown(65)) {
            // Try adjust x too.
            var supportX = keys.isDown(83) ? // S
                findSupportXRight(placed, adjustedCoords) :
                findSupportXLeft(placed, adjustedCoords);
            adjustedLeft = supportX;
            adjustedCoords = {
                x1: adjustedLeft,
                y1: adjustedTop,
                x2: adjustedLeft + width,
                y2: adjustedTop + height
            };
            if (model.hasIntersect(adjustedCoords, placed)) {
                // Finish here.
                return { top: adjustedTop, left: left };
            }
        }
        if ((top === adjustedTop && left === adjustedLeft) || iterCount > 10) {
            // Use fully adjusted coordinates.
            return { top: adjustedTop, left: adjustedLeft };
        } else {
            // Try another iteration.
            return adjustIteration(placed, adjustedTop, adjustedLeft, iterCount + 1);
        }
    }

    // Helper to find y coordinaate support.

    function findSupportY(placed, placedRect) {
        var sideHeight = window.model.sheet.sideHeight();
        // Extends the rectangle to bottom of the side.
        var extendedRect = {
            x1: placedRect.x1,
            y1: placedRect.y1,
            x2: placedRect.x2,
            y2: sideHeight
        };

        // Finds intersecting items. Ignores itself.
        var intersecting = [];
        model.items().forEach(function(placedItem) {
            if (placedItem === placed) {
                return;
            }
            if (hasIntersection(extendedRect, placedItem)) {
                intersecting.push(placedItem);
            }
        });
        var intersectingYs = intersecting.map(function(placed) {
            return placed.top();
        });
        intersectingYs.sort(numberComparator);
        if (intersectingYs.length > 0) {
            // Element below.
            return intersectingYs[0];
        } else {
            // Bottom side.
            return sideHeight;
        }
    }

    // Helper to find x coordinate support.
    
    function findSupportXLeft(placed, placedRect) {
        // Extends the rectangle to left of the side.
        var extendedRect = {
            x1: 0,
            y1: placedRect.y1,
            x2: placedRect.x2,
            y2: placedRect.y2
        };
        // Finds intersecting items. Ignores itself.
        var intersecting = [];
        model.items().forEach(function(placedItem) {
            if (placedItem === placed) {
                return;
            }
            if (hasIntersection(extendedRect, placedItem)) {
                intersecting.push(placedItem);
            }
        });
        var intersectingXs = intersecting.map(function(placed) {
            return placed.left() + placed.package().dimensions.width();
        });
        intersectingXs.sort(numberComparator);
        intersectingXs.reverse();
        if (intersectingXs.length > 0) {
            // Element left.
            return intersectingXs[0];
        } else {
            // Left side.
            return 0;
        }
    }

    // Helper to find x coordinate support by right side.
    
    function findSupportXRight(placed, placedRect) {
        var sideWidth = window.model.sheet.sideWidth();
        // Extends the rectangle to right of the side.
        var extendedRect = {
            x1: placedRect.x1,
            y1: placedRect.y1,
            x2: sideWidth,
            y2: placedRect.y2
        };
        // Finds intersecting items. Ignores itself.
        var intersecting = [];
        model.items().forEach(function(placedItem) {
            if (placedItem === placed) {
                return;
            }
            if (hasIntersection(extendedRect, placedItem)) {
                intersecting.push(placedItem);
            }
        });
        var width = placed.package().dimensions.width();
        var intersectingXs = intersecting.map(function(placed) {
            return placed.left() - width;
        });
        intersectingXs.sort(numberComparator);
        if (intersectingXs.length > 0) {
            // Element left.
            return intersectingXs[0];
        } else {
            // Right side.
            return sideWidth - width;
        }
    }

    // Compares numerical values.

    function numberComparator(n1, n2) {
        return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1);
    }

    // Removes all placed items associated with the
    // given item.

    model.removeItem = function(item) {
        var list = model.items();
        var filtered = list.filter(function(placed) {
            return placed.package() !== item;
        });
        model.items(filtered);
    };

    // Checks if part intersects with items in this
    // side. placed - placed item of part itself.

    model.hasIntersect = function(movable, placed) {
        var items = model.items();
        for (var i = 0; i < items.length; i++) {
            if (placed === items[i]) {
                // Can intersect itself.
                continue;
            }
            if (hasIntersection(movable, items[i])) {
                return true;
            }
        }
        return false;
    };

    // Adjusts side state then a part is moved.

    var translated = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    };

    model.adjustState = function(movable, eventX, eventY, placed) {
        var rect = model.rect();
        // Check if inside.
        var inside = eventX >= rect.x1 &&
            eventX <= rect.x2 &&
            eventY >= rect.y1 &&
            eventY <= rect.y2;
        if (inside) {
            // Adjust movable itself.
            var roundX = Math.floor(movable.left());
            var roundY = Math.floor(movable.top());
            movable.left(roundX + rect.x1 % 1);
            movable.top(roundY + rect.y1 % 1);
            var movableRect = movable.rect();
            var width = movableRect.x2 - movableRect.x1;
            var height = movableRect.y2 - movableRect.y1;
            // Translates movableRect into side coords.
            translated.x1 = movableRect.x1 - rect.x1;
            translated.y1 = movableRect.y1 - rect.y1;
            translated.x2 = translated.x1 + width;
            translated.y2 = translated.y1 + height;
            model.movable.x1 = translated.x1;
            model.movable.y1 = translated.y1;
            // Side overlap.
            var noOverlap = movableRect.x1 >= rect.x1 &&
                movableRect.y1 >= rect.y1 - 10 &&
                movableRect.x2 <= rect.x2 &&
                movableRect.y2 <= rect.y2;
            if (model.hasIntersect(translated, placed)) {
                if (keys.isDown(68)) { // D
                    model.intersect(false);
                } else {
                    model.intersect(true);
                }                
            } else if (!noOverlap) {
                model.intersect(true);
            } else {
                model.intersect(false);
                model.target(true);                
            }
            model.inside(true);          
        } else {
            model.target(false);
            model.intersect(false);
            model.inside(false);
        }
    };

    // Returns inner rectangle by top
    // left and bottom right coordinaates.

    var rect = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    };

    model.rect = function() {
        if (!model.inner) {
            model.inner = document.querySelector('#side-' + model.index + ' > div');
        }
        var domRect = model.inner.getBoundingClientRect();        

        rect.x1 = domRect.left;
        rect.y1 = domRect.top;
        rect.x2 = domRect.left + domRect.width;
        rect.y2 = domRect.top + domRect.height;

        return rect;
    };

    // Finds total height of the set of packages
    // in this side.

    model.totalHeight = ko.pureComputed(function() {
        var sheet = window.model.sheet;
        var min = 100000;
        model.items().forEach(function(item) {
            if (item.top() < min) {
                min = item.top();
            }
        });
        if (min === 100000) {
            return 0;
        }
        return 1.01 * (sheet.sideHeight() - min) / sheet.heightScale();
    });

    // Finds total width of the set of packages
    // in this side.

    model.totalWidth = ko.pureComputed(function() {
        var sheet = window.model.sheet;
        var max = 0;
        model.items().forEach(function(item) {
            var right = item.left() + item.package().dimensions.width();
            if (right > max) {
                max = right;
            }
        });
        return 1.005 * max / sheet.widthScale();
    });

    return model;
};
