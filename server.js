var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(id) {
    var item = { id: parseInt(id) };

    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
            item.name = this.items[i].name;
            this.items.splice(i, 1);
        }
    }

    if (!item.name) {
        item.status = "Error";
        item.message = "The provided item ID does not exist.";
    }
    
    return item;
};

Storage.prototype.update = function(updatedItem) {
    var thisItem = {};

    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == updatedItem.id) {
            this.items[i].name = updatedItem.name;
            thisItem = this.items[i];
        }
    }

    if (!thisItem.name) {
        thisItem.status = "Error";
        thisItem.message = "The provided item ID does not exist.";
    }

    return thisItem;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res) {
    if (!req.params.id) {
        return res.sendStatus(400);
    }

    var item = storage.remove(req.params.id);
    res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.update(req.body);
    res.status(201).json(item);
});

app.listen(process.env.PORT || 8080);

console.log('starting server on port 8080...');

exports.app = app;
exports.storage = storage;