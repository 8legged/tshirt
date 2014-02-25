var application_root = __dirname, // Load modules for API
    express = require('express'),
    path = require('path'),
    mongoose = require('mongoose');

// Create the Web server
var app = express();

// Hook up the db named 'ecomm_database'
mongoose.connect('mongodb://localhost/ecomm_database');

// Config
app.configure(function () {
    'use strict';
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
// set up the public dir to serve static files
    app.use(express.static(path.join(application_root, 'public')));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function (req, res) {
    'use strict';
    res.send('Ecomm API is running');
});

// Schema.ObjectId
var Schema = mongoose.Schema;

// Product Model
var Product = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    style: { type: String, unique: true },
    modified: { type: Date, default: Date.now }
});

var ProductModel = mongoose.model('Product', Product);

// READ a list of products
app.get('/api/products', function(req, res) {
    'use strict';
    return ProductModel.find(function (err, products) {
        if (!err) {
            return res.send(products);
        } else {
            return console.log(err);
        }
    });
});

// CREATE a single product
app.post('/api/products', function (req, res) {
    'use strict';
    var product;
    console.log('POST: ');
    console.log(req.body);
    product = new ProductModel({
        title: req.body.title,
        description: req.body.description,
        style: req.body.style,
    });
    product.save(function(err) {
        if (!err) {
            return console.log('created');
        } else {
            return console.log(err);
        }
    });
    return res.send(product);
});

// READ a single product ID
app.get('/api/products/:id', function(req, res) {
    'use strict';
    return ProductModel.findById(req.params.id, function (err, product) {
        if (!err) {
            return res.send(product);
        }   else {
            return console.log(err);
        }
    });
});

// UPDATE a single product by ID
app.put('/api/products/:id', function (req, res) {
    'use strict';
    return ProductModel.findById(req.params.id, function (err, product) {
        product.title = req.body.title;
        product.description = req.body.description;
        product.style = req.body.style;
        return product.save(function (err) {
            if (!err) {
                console.log('updated');
            } else {
                console.log(err);
            }
            return res.send(product);
        });
    });
});

// DELETE a single product by ID
app.delete('/api/products/:id', function (req, res) {
    'use strict';
    return ProductModel.findById(req.params.id, function (err, product) {
        return product.remove(function(err) {
            if (!err) {
                console.log('removed');
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
});












// Launch server
app.listen(4242);
