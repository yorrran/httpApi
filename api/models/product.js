const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    key: String,
    value: String,
    timestamp: Date
},{
    versionKey: false
});

module.exports = mongoose.model('Product', productSchema);