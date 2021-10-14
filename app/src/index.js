// These are actually async.

app.EnableBackKey(false);
app.LoadScript('Misc/es6-promise.auto.js');

// Constants.

var TEXT_COLOR = '#fdc029';
var BACK_COLOR = '#000000';
var SNAP_FOLDER = '/sdcard/veopildid';
var API_ORDERS = '/api/order/camera-app';
var PHOTO_WIDTH = 2240;
var PHOTO_HEIGHT = 1488;

// Data validation.

var Valid = {};

Valid.number = function(number) {
    if (typeof number !== 'number') {
        throw new Error('It is not a number.');
    }
};

Valid.string = function(string) {
    if (typeof string !== 'string') {
        throw new Error('It is not a string.');
    }
};

Valid.array = function(array) {
    if (typeof array === null) {
        throw new Error('Array is null.');
    }
    if (typeof array.length !== 'number') {
        throw new Error('It is not an array.');
    }
};

Valid.fun = function(fn) {
    if (typeof fn !== 'function') {
        throw new Error('It is not a function.');
    }
};

Valid.object = function(object) {
    if (typeof object !== 'object') {
        throw new Error('It is not an object.');
    }
    if (object === null) {
        throw new Error('It is null.');
    }
};

Valid.instance = function(constructor, object) {
    if (!(object instanceof constructor)) {
        throw new Error('It is not an instance of ' + constructor.name);
    }
};

// Internal data model.

function Image(generated_id) {
    Valid.string(generated_id);
    var self = this;    
    self.generated_id = generated_id;
    self.order = null;
}

Image.prototype.imageFile = function() {
    var self = this;
    return self.order.imageFile(self.generated_id);
};

Image.prototype.relativeImageFile = function() {
    var self = this;
    return self.order.relativeImageFile(self.generated_id);
};

Image.prototype.exists = function() {
    var self = this;
    return self.order.database.directory.indexOf(self.relativeImageFile()) >= 0;
};

Image.prototype.removeFile = function() {
    var self = this;
    return app.DeleteFile(self.imageFile());
};

Image.prototype.toJSON = function() {
    var self = this;
    return { generated_id: self.generated_id };
};

function Order(id, name, images, vehicle, times, company_name, loading_date) {
    Valid.number(id);
    Valid.string(name);
    Valid.array(images);
    var self = this;
    self.id = id;
    self.name = name.trim();
    self.images = images;
    self.images.forEach(function(image) {
        image.order = self;
    });
    self.database = null;
    self.vehicle = vehicle ? vehicle.trim() : null;
    self.times = times ? times.trim() : null;
    self.company_name = company_name ? company_name.trim() : null;
    self.loading_date = loading_date;
}

// Adds new image to the database. Should be
// called after taking a photo.

Order.prototype.addImage = function(generated_id) {
    Valid.string(generated_id);
    var self = this;
    var image = new Image(generated_id);
    self.images.push(image);
    image.order = self;
};

Order.prototype.imageFile = function(generated_id) {
    Valid.string(generated_id);
    var self = this;
    return SNAP_FOLDER + '/' + self.relativeImageFile(generated_id);
};

Order.prototype.relativeImageFile = function(generated_id) {
    var self = this;
    return 'snap-' + self.id +
        '-' + generated_id + '.jpg';
};

Order.prototype.displayString = function() {
    var self = this;
    var localCount = self.localImages().length;
    var string = '#' + self.id + ' ' + self.name + ' (' + self.images.length + '/' + localCount + ')';
    if (self.times) {
        string = self.times + ' ' + string;
    }
    if (self.vehicle) {
        string += ' ' + self.vehicle;
    }
    if (self.company_name) {
        string += ' ' + self.shortenCompanyName();
    }
    return string;
};

Order.prototype.hasImage = function(generated_id) {
    Valid.string(generated_id);
    var self = this;
    for (var i = 0; i < self.images.length; i++) {
        var image = self.images[i];
        if (image.generated_id === generated_id) {
            return true;
        }
    }
    return false;
};

Order.prototype.localImages = function() {
    var self = this;
    var local = [];
    self.images.forEach(function(image) {
        if (image.exists()) {
            local.push(image);
        }
    });
    return local;
};

Order.prototype.toJSON = function() {
    var self = this;
    return {
        id: self.id,
        name: self.name,
        images: self.images,
        vehicle: self.vehicle,
        times: self.times,
        company_name: self.company_name,
        loading_date: self.loading_date
    };
};

Order.prototype.shortenCompanyName = function() {
    var self = this;
    var name = self.company_name;
    if (name.length < 8) {
        return name;
    }
    const words = name.split(/\s/);
    if (words.length <= 1) {
        return name;
    }
    const first = words[0];
    if (first.length <= 3) {
        return words[0] + ' ' + words[1];
    } else {
        return words[0];
    }
};

function Settings(host, password, orientation, rotation) {
    Valid.string(host);
    Valid.string(password);
    Valid.string(orientation);
    Valid.number(rotation);
    var self = this;
    self.host = host;
    self.password = password;
    self.orientation = orientation;
    self.rotation = rotation;
}

Settings.initial = function() {
    return new Settings(
        'http://10.0.1.47',
        'parool2',
        'Landscape',
        0);
};

// Database keeps 50 last orders.
function Database() {
    var self = this;
    self.orders = [];
    self.settings = [];
    self.filename = SNAP_FOLDER + '/data.json';
    self.tempfile = SNAP_FOLDER + '/data.tmp.json';
    self.read();
}

Database.prototype.read = function() {
    var self = this;
    if (app.FileExists(self.filename)) {
        var data = JSON.parse(app.ReadFile(self.filename));
        self.settings = new Settings(
            data.settings.host,
            data.settings.password,
            data.settings.orientation || 'Landscape',
            data.settings.rotation || 0);
        data.orders.forEach((function(order) {
            var images = order.images.map(function(image) {
                return new Image(image.generated_id);
            });
            var created = new Order(
                order.id,
                order.name,
                images,
                order.vehicle,
                order.times,
                order.company_name,
                order.loading_date);
            created.database = self;
            self.orders.push(created);
        }));
    } else {
        self.settings = Settings.initial();
    }
    self.readDirectory();
};

Database.prototype.readDirectory = function() {
    var self = this;
    var start = Date.now();
    self.directory = app.ListFolder(SNAP_FOLDER);
    log('Directory read took ' + (Date.now() - start) + 'ms');
};

// Removes remaining images.

Database.prototype.removeImages = function() {
    var array = app.ListFolder(SNAP_FOLDER);
    var images = array.filter(function(entry) {
        return entry.match(/\.jpg$/);
    });
    images.forEach(function(image) {
        log('Removing leftover image ' + image);
        app.DeleteFile(SNAP_FOLDER + '/' + image);
    });
};

Database.prototype.write = function() {
    var self = this;
    log('Writing database to disk');
    app.DeleteFile(self.filename);
    app.WriteFile(self.filename, JSON.stringify({
        orders: self.orders,
        settings: self.settings
    }));
    log('Database is saved');
};

// orders: [{id, name, images: [{generated_id}}]
Database.prototype.merge = function(orders) {
    Valid.array(orders);
    var self = this;
    log('Adding remote orders');
    self.readDirectory();
    var oldMap = keyBy(self.orders, function(order) {
        return order.id;
    });
    orders.forEach(function(order) {
        var old = oldMap[order.id];
        if (old) {
            log('Merging order ' + order.id);
            old.images = old.images.filter(function(image) {
                return image.exists();
            });
            order.images.forEach(function(generated_id) {
                old.addImage(generated_id);
            });
            old.vehicle = order.vehicle;
            old.times = order.times;
            old.company_name = order.company_name;
            old.loading_date = order.loading_date;
        } else {
            log('New order ' + order.id);
            // add new
            var images = order.images.map(function(generated_id) {
                return new Image(generated_id);
            });
            var created = new Order(
                order.id,
                order.name,
                images,
                order.vehicle,
                order.times,
                order.company_name,
                order.loading_date);
            created.database = self;
            self.orders.push(created);
        }
    });
    self.orders.sort(function(o1, o2) {
        return o1.id === o2.id ? 0 : (o1.id > o2.id ? -1 : 1);
    });
    // Keep last 200 and those that have non-uploaded
    // photos.
    var retainList = [];
    self.orders.forEach(function(order, i) {
        if (i < 200) {
            retainList.push(order);
        } else if (order.localImages().length > 0) {
            retainList.push(order);
        }
    });
    self.orders = retainList;
    self.write();
};

Database.prototype.orderChoices = function() {
    var self = this;
    self.readDirectory();
    var today = new Date();
    var year = today.getFullYear().toString();
    var month = (today.getMonth() + 1).toString();
    var day = today.getDate().toString();
    month = month.length < 2 ? '0' + month : month;
    day = day.length < 2 ? '0' + day : day;
    var dateString = year + '-' + month + '-' + day;
    return self.orders.filter(function(order) {
        return dateString === order.loading_date;
    }).sort(function(o1, o2) {
        return o1.times === o2.times ? 0 : (o1.times < o2.times ? -1 : 1);
    }).map(function(order) {
        return order.displayString();
    });
};

Database.prototype.orderById = function(id) {
    var self = this;
    for (var i = 0; i < self.orders.length; i++) {
        var order = self.orders[i];
        if (id === order.id) {
            return order;
        }
    }
    return null;
};

Database.prototype.imagesToUpload = function() {
    var self = this;
    self.readDirectory();
    var images = [];
    self.orders.forEach(function(order) {
        order.localImages().forEach(function(image) {
            images.push(image);
        });
    });
    return images;
};

Database.prototype.setOrientation = function(orientation) {
    var self = this;
    Valid.string(orientation);
    self.settings.orientation = orientation;
};

Database.prototype.setRotation = function(rotation) {
    var self = this;
    Valid.number(rotation);
    self.settings.rotation = rotation;
};

Database.prototype.setHost = function(host) {
    var self = this;
    Valid.string(host);
    self.settings.host = host;
};

Database.RANDID_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789';

Database.randid = function() {
    var id = '';
    var length = Database.RANDID_CHARACTERS.length;
    for (var i = 0; i < 32; i++) {
        id += Database.RANDID_CHARACTERS.charAt(Math.floor(Math.random() * length));
    }
    return id;
};

// API interface.

var Api = {};

Api.get = function(url) {
    Valid.string(url);
    log('HTTP GET ' + url);
    return new ES6Promise(function(resolve, reject) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) { 
                if (httpRequest.status !== 200) {
                    reject(new Error('Viga API päringus.'));
                } else {
                    resolve(JSON.parse(httpRequest.responseText).data);
                }
            }
        };
        httpRequest.open('GET', url, true);
        httpRequest.send();
    });
};

Api.postBlob = function(url, string) {
    Valid.string(url);
    Valid.string(string);
    log('HTTP POST blob ' + url);
    return new ES6Promise(function(resolve, reject) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) { 
                if (httpRequest.status !== 200) {
                    reject(new Error('Viga API päringus.' +
                        ' Status kood ' + httpRequest.status));                    
                } else {
                    var response = JSON.parse(httpRequest.responseText);
                    if (response.status === 'error') {
                        reject(new Error('Serveri error: ' + response.message));
                    } else {
                        resolve();
                    }       
                }
            }
        };
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader('Content-Type', 'application/octet-stream');
        httpRequest.send(string);
    });
};

Api.orders = function() {
    return Api.get(State.database.settings.host + API_ORDERS);
};

Api.uploadImage = function(image, base64) {
    Valid.instance(Image, image);
    Valid.string(base64);
    //var blob = createBlob(base64, 'application/octet-stream');
    var url = State.database.settings.host + API_ORDERS +
        '/' + image.order.id + '/' + image.generated_id;
    return Api.postBlob(url, base64);
};

// Application state, including visual state.

var State = {
    database: null,
    order: null,
    cam: null,
    img: null,
    ui: {
        selectButton: null,
        shutterButton: null,
        uploadButton: null,
        refreshButton: null,
        finishButton: null,
        orderText: null,
        mainButtonsLayout: null
    }
};

function MainScreen() {
    var self = this;        
    var choices = State.database.orderChoices(); 
    self.layout = app.CreateLayout('linear', 'Horizontal,FillXY');
    self.layout.SetBackColor(BACK_COLOR);
    self.layout.SetVisibility('Gone');
    self.list = app.CreateList(choices);
    self.list.SetBackColor(BACK_COLOR);
    self.list.SetTextColor(TEXT_COLOR);
    self.list.SetOnTouch(self.select);    
    self.layout.AddChild(self.createButtons());
    self.layout.AddChild(self.list);
}

MainScreen.prototype.createButtons = function() {
    var self = this;
    var upload = app.CreateButton('Lae üles', 0.4, -1);
    upload.SetTextColor(TEXT_COLOR);
    upload.SetOnTouch(function() { self.upload(); });
    var refresh = app.CreateButton('Värskenda', 0.4, -1);
    refresh.SetTextColor(TEXT_COLOR);
    refresh.SetOnTouch(function() { self.refresh(); });
    var camera = app.CreateButton('Kaamera', 0.4, -1);
    camera.SetTextColor(TEXT_COLOR);
    camera.SetOnTouch(function() { self.camera(); });
    var settings = app.CreateButton('Seaded', 0.4, -1);
    settings.SetTextColor(TEXT_COLOR);
    settings.SetOnTouch(function() { self.settings(); });
    var buttons = app.CreateLayout('linear', 'Vertical');
    buttons.AddChild(upload);
    buttons.AddChild(refresh);
    buttons.AddChild(camera);
    buttons.AddChild(settings);
    return buttons;
};

MainScreen.prototype.show = function() {
    log('Showing the main screen.');
    var self = this;
    self.update();
    self.layout.SetVisibility('Show');
};

MainScreen.prototype.hide = function() {
    var self = this;
    self.layout.SetVisibility('Gone');
};

MainScreen.prototype.upload = function() {
    var self = this;
    log('Uploading photos.');
    app.ShowProgress('Saadan pilte ...');
    var images = State.database.imagesToUpload();
    images.reduce(function(prev, image) {
        return prev.then(function() {
            return uploadImage(image);
        });
    }, ES6Promise.resolve()).then(function() {        
        log('All images uploaded.');
        State.database.removeImages();
    }).catch(function(err) {
        reportError(err);
        app.Alert(err);
    }).then(function() {
        State.database.readDirectory();
        app.HideProgress();
        self.update();
    });
};

MainScreen.prototype.refresh = function() {
    var self = this;
    log('Refreshing the internal database.');
    Api.orders().then(function(orders) {
        State.database.merge(orders);
        self.update();
    }).catch(function(err) {
        reportError(err);
        app.Alert(err);
    });
};

MainScreen.prototype.update = function() {
    var self = this;
    log('Updating the list of displayed orders.');
    self.list.RemoveAll();
    State.database.orderChoices().forEach(function(item) {
        self.list.AddItem(item);
    });
};

MainScreen.prototype.camera = function() {
    log('Showing camera settings');
    State.switcher.showCamera();
};

MainScreen.prototype.select = function(title, body, type, index) {
    var self = this;
    log('Selecting an order.');
    var match = title.match(/#(\d+)/);
    if (match) {
        var id = parseInt(match[1], 10);
        var order = State.database.orderById(id);
        if (order) {
            State.switcher.showOrder(order);
        }
    }
};

MainScreen.prototype.settings = function() {
    var self = this;
    log('Showing settings.');
    State.switcher.showSettings();
};

function OrderScreen() {
    var self = this;
    self.zooming = false;
    self.order = null;
    self.title = app.CreateText('Tellimus');
    self.title.SetTextColor(TEXT_COLOR);
    self.camera = null;
    self.left = app.CreateLayout('linear', 'Vertical,Left,FillY');
    self.left.SetBackColor(BACK_COLOR);
    self.left.AddChild(self.title);    
    self.img = app.CreateImage(null, 0.18, 0.22);
    self.img.SetBackColor('#FF000000');    
    var shutter = app.CreateButton('Pildista', -1, -1, 'FillX');
    shutter.SetTextColor(TEXT_COLOR);
    shutter.SetOnTouch(function() { self.shutter(); });
    var finish = app.CreateButton('Lõpeta', -1, -1, 'FillX');
    finish.SetTextColor(TEXT_COLOR);
    finish.SetOnTouch(function() { self.finish(); });
    self.zoombar = app.CreateSeekBar(-1, -1, 'FillX');
    self.zoombar.SetRange(1.0);
    self.zoombar.SetValue(0.0);
    self.zoombar.SetOnTouch(function(value) { self.zoom(value); });
    self.zoombar.SetBackColor(BACK_COLOR);
    self.zoombar.SetMaxRate(300);
    self.flash = app.CreateToggle('Välk', -1, -1, 'FillX');
    self.flash.SetTextColor(TEXT_COLOR);
    var right = app.CreateLayout('linear', 'Vertical,FillX');
    right.AddChild(self.img);
    right.AddChild(self.zoombar);
    right.AddChild(self.flash);
    right.AddChild(shutter);
    right.AddChild(finish);
    self.layout = app.CreateLayout('linear', 'Horizontal,FillXY');
    self.layout.SetBackColor(BACK_COLOR);
    self.layout.SetVisibility('Gone');
    self.layout.AddChild(self.left);
    self.layout.AddChild(right);
}

OrderScreen.prototype.show = function(order) {
    Valid.object(order);
    var self = this;
    var orientation = State.database.settings.orientation;
    var rotation = State.database.settings.rotation;
    self.order = order;
    self.updateTitle();
    self.zoombar.SetValue(0.0);
    self.camera = app.CreateCameraView(0.6, 0.8, 'NoRotate');
    self.camera.SetOnPicture(function() { self.onPicture(); });    
    self.left.AddChild(self.camera);
    self.layout.SetVisibility('Show');
    setTimeout(function() {
        log('Starting camera preview');
        self.camera.SetPreviewImage(self.img);
        self.camera.StartPreview();
        self.camera.SetOrientation(orientation);
        self.camera.SetPostRotation(rotation);
    }, 100);
};

OrderScreen.prototype.hide = function() {
    var self = this;
    if (self.camera) {
        self.left.RemoveChild(self.camera);
        self.camera.Release();
        log('Released the camera.');
        self.camera = null;
    }
    self.layout.SetVisibility('Gone');
};

OrderScreen.prototype.shutter = function() {
    var self = this;
    log('Taking a photo for order ' + self.order.id);
    self.camera.SetPictureSize(PHOTO_WIDTH, PHOTO_HEIGHT);
    var generated_id = Database.randid();
    log('New photo generated_id is ' + generated_id);
    var imageFile = self.order.imageFile(generated_id);
    if (self.flash.GetChecked()) {
        self.camera.SetFlash(true);
        setTimeout(function() {
            self.camera.TakePicture(imageFile);
            self.order.addImage(generated_id);
            State.database.write();    
        }, 1000);
    } else {
        self.camera.TakePicture(imageFile);
        self.order.addImage(generated_id);
        State.database.write();
    }
};

OrderScreen.prototype.onPicture = function() {
    var self = this;
    self.camera.SetFlash(false);
    State.database.readDirectory();
    self.updateTitle();
};

OrderScreen.prototype.zoom = function(value) {
    var self = this;
    var max = self.camera.GetMaxZoom();    
    self.camera.SetZoom(value * max);
};

OrderScreen.prototype.finish = function() {
    log('Finished taking photos.');
    State.switcher.showMain();
};

OrderScreen.prototype.updateTitle = function() {
    var self = this;
    self.title.SetText(self.order.displayString());
};

function CameraScreen() {
    var self = this;
    self.orientationValue = null;
    self.title = app.CreateText('Kaamera seaded');
    self.title.SetTextColor(TEXT_COLOR);
    self.camera = null;
    self.left = app.CreateLayout('linear', 'Vertical,Left,FillY');
    self.left.SetBackColor(BACK_COLOR);
    self.left.AddChild(self.title);
    self.img = app.CreateImage(null, 0.18, 0.22);
    self.img.SetBackColor('#FF000000');
    var save = app.CreateButton('Salvesta', -1, -1, 'FillX');
    save.SetTextColor(TEXT_COLOR);
    save.SetOnTouch(function() { self.save(); });
    var close = app.CreateButton('Sulge', -1, -1, 'FillX');
    close.SetTextColor(TEXT_COLOR);
    close.SetOnTouch(function() { self.close(); });
    var test = app.CreateButton('Test', -1, -1, 'FillX');
    test.SetTextColor(TEXT_COLOR);
    test.SetOnTouch(function() { self.test(); });
    self.orientation = app.CreateSpinner('Portrait,Landscape', -1, -1, 'FillX');
    self.orientation.SetOnChange(function(item) { self.setOrientation(item); });
    self.rotation = app.CreateSpinner('0,90,180,270', -1, -1, 'FillX');
    self.rotation.SetOnChange(function(item) { self.setRotation(item); });
    var right = app.CreateLayout('linear', 'Vertical,FillX');
    right.AddChild(self.img);
    right.AddChild(self.orientation);
    right.AddChild(self.rotation);
    right.AddChild(test);
    right.AddChild(save);
    right.AddChild(close);
    self.layout = app.CreateLayout('linear', 'Horizontal,FillXY');
    self.layout.SetBackColor(BACK_COLOR);
    self.layout.SetVisibility('Gone');
    self.layout.AddChild(self.left);
    self.layout.AddChild(right);
}

CameraScreen.prototype.show = function() {
    var self = this;
    var orientation = State.database.settings.orientation;
    var rotation = State.database.settings.rotation;
    self.camera = app.CreateCameraView(0.6, 0.8, 'NoRotate');
    self.left.AddChild(self.camera);
    self.layout.SetVisibility('Show');
    self.orientationValue = orientation;
    self.orientation.SelectItem(orientation);
    self.rotationValue = rotation;
    self.rotation.SelectItem(rotation.toString());
    setTimeout(function() {
        log('Starting camera preview');
        self.camera.SetPreviewImage(self.img);
        self.camera.StartPreview();
        self.camera.SetOrientation(orientation);
        self.camera.SetPostRotation(rotation);
    }, 100);
};

CameraScreen.prototype.hide = function() {
    var self = this;
    if (self.camera) {
        self.left.RemoveChild(self.camera);
        self.camera.Release();
        log('Released the camera.');
        self.camera = null;
    }
    self.layout.SetVisibility('Gone');
};

CameraScreen.prototype.test = function() {
    var self = this;
    log('Taking a test shot.');
    self.camera.SetPictureSize(PHOTO_WIDTH, PHOTO_HEIGHT);
    self.camera.TakePicture(SNAP_FOLDER + '/test.jpg');
};

CameraScreen.prototype.save = function() {
    var self = this;
    log('Saving camera settings.');
    State.database.setOrientation(self.orientationValue);
    State.database.setRotation(self.rotationValue);
    State.database.write();
    State.switcher.showMain();
};

CameraScreen.prototype.close = function() {
    var self = this;
    log('Discarding camera settings.');
    State.switcher.showMain();
};

CameraScreen.prototype.setOrientation = function(orientation) {
    var self = this;
    log('Setting camera orientation to ' + orientation);
    self.camera.SetOrientation(orientation);
    self.orientationValue = orientation;
};

CameraScreen.prototype.setRotation = function(rotation) {
    var self = this;
    log('Setting camera rotation to ' + rotation);
    self.rotationValue = parseInt(rotation, 10);
    self.camera.SetPostRotation(self.rotationValue);
};

function SettingsScreen() {
    var self = this;
    var host = State.database.settings.host;
    self.title = app.CreateText('Äpi seaded');
    self.title.SetTextColor(TEXT_COLOR);
    self.host = app.CreateTextEdit(host, -1, -1, 'FillX');
    var save = app.CreateButton('Salvesta', -1, -1, 'FillX');
    save.SetTextColor(TEXT_COLOR);
    save.SetOnTouch(function() { self.save(); });
    var close = app.CreateButton('Sulge', -1, -1, 'FillX');
    close.SetTextColor(TEXT_COLOR);
    close.SetOnTouch(function() { self.close(); });
    self.layout = app.CreateLayout('linear', 'Vertical,FillXY');
    self.layout.SetBackColor(BACK_COLOR);
    self.layout.SetVisibility('Gone');
    self.layout.AddChild(self.host);
    self.layout.AddChild(save);
    self.layout.AddChild(close);
}

SettingsScreen.prototype.show = function() {
    var self = this;
    self.host.SetText(State.database.settings.host);
    self.layout.SetVisibility('Show');
};

SettingsScreen.prototype.hide = function() {
    var self = this;
    self.layout.SetVisibility('Gone');
};

SettingsScreen.prototype.save = function() {
    var self = this;
    log('Saving main settings.');
    State.database.setHost(self.host.GetText());
    State.database.write();
    State.switcher.showMain();
};

SettingsScreen.prototype.close = function() {
    log('Discarding main settings.');
    State.switcher.showMain();
};

function ScreenSwitcher() {
    var self = this;
    self.layout = app.CreateLayout('linear', 'Horizontal,FillXY');
    self.layout.SetBackColor('#000000');
    self.main = new MainScreen();
    self.camera = new CameraScreen();
    self.order = new OrderScreen();
    self.settings = new SettingsScreen();
    self.layout.AddChild(self.main.layout);
    self.layout.AddChild(self.camera.layout);
    self.layout.AddChild(self.order.layout);
    self.layout.AddChild(self.settings.layout);
    self.screens = [
        self.main,
        self.camera,
        self.order,
        self.settings
    ];
}

ScreenSwitcher.prototype.hideAll = function() {
    var self = this;
    log('Hiding all screens.');
    self.screens.forEach(function(screen) {
        screen.hide();
    });
};

ScreenSwitcher.prototype.showMain = function() {
    var self = this;
    self.hideAll();
    self.main.show();
};

ScreenSwitcher.prototype.showCamera = function() {
    var self = this;
    self.hideAll();
    self.camera.show();
};

ScreenSwitcher.prototype.showOrder = function(order) {
    Valid.object(order);
    var self = this;
    log('Showing order ' + order.id);
    self.hideAll();
    self.order.show(order);
};

ScreenSwitcher.prototype.showSettings = function() {
    var self = this;
    self.hideAll();
    self.settings.show();
};

function OnStart() {
    State.database = new Database();
    app.SetOrientation('Landscape');
    app.MakeFolder(SNAP_FOLDER);
    State.switcher = new ScreenSwitcher();
    app.AddLayout(State.switcher.layout);    
    setTimeout(function() {
        State.switcher.showMain();
    }, 100);
};

// Uploads single image to the server.

function uploadImage(image) {    
    Valid.instance(Image, image);    
    var filename = image.imageFile();
    log('Uploading an image from file ' + filename);
    var base64 = app.ReadFile(filename, 'base64');
    return Api.uploadImage(image, base64).then(function() {
        image.removeFile();
    }).then(function() {
        log('Image ' + filename + ' has been uploaded and local file is removed.');
    });
}

function keyBy(array, fn) {
    Valid.array(array);
    Valid.fun(fn);
    var object = {};
    array.forEach(function(item) {
        object[fn(item)] = item;
    });
    return object;
}

function log(message) {
    console.log(message);
}

function reportError(err) {
    if (err) {
        var stack = err.stack;
        if (stack) {
            console.log(stack);
        } else {
            console.log(err);
        }
    }
}

