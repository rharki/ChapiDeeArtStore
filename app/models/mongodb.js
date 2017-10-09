var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt-nodejs');
// var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var CategorySchema = new Schema ({
    categoryname: { type: String, unique: true },
    createdby: {type : mongoose.Schema.Types.ObjectId, ref: 'user'},
    addedon: {type : Date, default: Date.now},
});
var CategoryModel = mongoose.model("category", CategorySchema);

var TagSchema = new Schema ({
    tagname: { type: String, unique: true },
    createdby: {type : mongoose.Schema.Types.ObjectId, ref: 'user'},
    addedon: {type : Date, default: Date.now},
});
var TagModel = mongoose.model("tag", TagSchema);

var KeyItemSchema = new Schema ({
    keyitemname: { type: String},
    keyitemdesc: { type: String },
    keyitemimagename: { type: String, unique: true },
    itemmedium: { type: String },
    itemsize: [{ type: Number },{ type: Number }],
    itemprice: [{ type: String },{ type: Number }],
    createdby: {type : mongoose.Schema.Types.ObjectId, ref: 'user'},
    addedon: {type : Date, default: Date.now},
    primarycategory: {type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    secondarycategory: [{type: mongoose.Schema.Types.ObjectId, ref: 'category'}],
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'tag'}]
});
var KeyItemModel = mongoose.model("keyitem", KeyItemSchema);

var CollectionSchema = new Schema ({
    collectionname: { type: String, unique: true },
    collectiondesc: { type: String, unique: true },
    createdby: {type : mongoose.Schema.Types.ObjectId, ref: 'user'},
    addedon: {type : Date, default: Date.now},
    coverimage: {type: mongoose.Schema.Types.ObjectId, ref: 'keyitem'},
    displaysequence: {type: Number},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'tag'}],
    categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'category'}]
});
var CollectionModel = mongoose.model("collection", CollectionSchema);

var UserSchema = new Schema ({
    email: { type: String, lowercase: true, unique: true},
    userid: { type: String, lowercase: true, unique: true},
    mobileno: { type: Number, unique: true},
    password: { type: String, required: true, select: false},
    name: { type: String, required: true},
});
var UserModel = mongoose.model("user", UserSchema);


module.exports.CategoryModel = CategoryModel;
module.exports.TagModel = TagModel;
module.exports.KeyItemModel = KeyItemModel;
module.exports.CollectionModel = CollectionModel;
module.exports.UserModel = UserModel;
