var Masterdb = require('../models/mongodb');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
// var imagessavingpath = path.join(__dirname, '...', 'public/uploads/images');
// var imagessavingpath = '/Users/apple/Documents/CODING/MyProjects/WorkoutGuide/public/uploads/images';
var multer = require('multer');
var Thumbnail = require('thumbnail');
var Jimp = require("jimp");
var gmailsend = require('gmail-send');

var router = function (router) {

    router.get('/getbannerimages', function(req, res) {
        //reading directory in synchronous way
        // console.log("reached getBannerImages");
        console.log(__dirname);
        var bannerimagespath = path.join(__dirname, '../../public/assets/img/homepageimages/bannerimages/');
        console.log(bannerimagespath);
        var mypath = '/Users/apple/Documents/CODING/MyProjects/Art Website/public/assets/img/homepageimages/bannerimages/';
        try {
            // var randomfiles = fs.readdirSync(mypath);
            var randomfiles = fs.readdirSync(bannerimagespath);
            return res.json({ success: true, message: 'Returning all banner images!', bannerimages: randomfiles });
        } catch (err ){
            return res.status(400).json({ success: false, message: err });
        }
    });

    router.get('/getcollection/:collectionid', function(req, res) {
        //reading directory in synchronous way
        var collectionid = req.params.collectionid;
        Masterdb.CollectionModel.findOne({_id:collectionid}).populate('tags categories').exec(function(err, collection) {
            if (err) {
                console.log(err);
            } else if (!collection) {
                return res.json({ success: false, message: 'This particular collection is not found!' });
            } else {
                // console.log(exercises);
                // console.log("hello");
                return res.json({ success: true, message: 'Returning the particular collection details!', collection: collection });
            }
        });
    });

    router.get('/getimagebyimageid/:imageid', function(req, res) {
        var imageid = req.params.imageid;
        console.log(imageid);
        Masterdb.KeyItemModel.find({ '_id':imageid }).populate('primarycategory secondarycategory tags')
        .exec(function(err, image) {
            if (err) {
                console.log(err);
            } else if (!image) {
                return res.json({ success: false, message: 'This particular image is not found!' });
            } else {
                return res.json({ success: true, message: 'Returning the particular images details!', image: image });
            }
        });
    });

    router.post('/getimagesbytagandcategory', function(req, res) {
        var tagid = req.body.tagids;
        var categoryid = req.body.categoryids;
        console.log(tagid);
        console.log(categoryid);
        Masterdb.KeyItemModel.find({ 'tags':{$in:tagid}, 'primarycategory':{$in:categoryid} })
        .exec(function(err, images) {
            if (err) {
                console.log(err);
            } else if (!images) {
                return res.json({ success: false, message: 'This particular image is not found!' });
            } else {
                return res.json({ success: true, message: 'Returning the particular images details!', images: images });
            }
        });
    });

    //http://localhost:8080/api/getallcollections/
    router.get('/getallcollections', function(req, res) {
        Masterdb.CollectionModel.find({}).populate('coverimage').exec(function(err, collections) {
            if (!collections) {
                return res.json({ success: false, message: 'collections list is null!' });
            }
            if (err) console.log(err);
            return res.json({ success: true, message: 'Returning all collections details!', collections: collections });
        });
    });

    //http://localhost:8080/api/category/getcategories
    router.get('/category/getcategories', function(req, res) {
        Masterdb.CategoryModel.find({}, function(err, categories) {
            if (!categories) {
                return res.json({ success: false, message: 'categories list is null!' });
            }
            if (err) console.log(err);
            return res.json({ success: true, message: 'Returning all category names!', categories: categories });
        });
    });

    //http://localhost:8080/api/tag/gettags
    router.get('/tag/gettags', function(req, res) {
        Masterdb.TagModel.find({}, function(err, tags) {
            if (!tags) {
                return res.json({ success: false, message: 'tag list is null!' });
            }
            if (err) console.log(err);
            return res.json({ success: true, message: 'Returning all tag names!', tags: tags });
        });
    });

    //http://localhost:8080/api/getphotosbycategory
    router.get('/getphotosbycategory/:categoryid', function(req, res) {
        var categoryid = req.params.categoryid;
        Masterdb.KeyItemModel.find({ 'primarycategory': categoryid}, function(err, images) {
            if (!images) {
                return res.json({ success: false, message: 'images list is null!' });
            }
            if (err) console.log(err);
            return res.json({ success: true, message: 'Returning all images of this category!', images: images });
        });
    });


    // place functions that require the use of this function below this!!!
    // middleware that is specific to this router - logging the time for all requets to this middleware!
    router.use(function timeLog (req, res, next) {
        console.log('Time: ', Date.now());
        req.decoded = {};
        req.decoded.email = 'chapidee@gmail.com';
        req.decoded.name = 'Sai Priya';
        // Masterdb.User.findOne({ email: req.decoded.email }, function(err, user) {
        //     if (err) throw err;
        //     req.decoded._id = user._id;
        // });
        req.decoded._id = '599bf799e15c690e0f1e9481';
        // console.log(req.decoded.email);
        // console.log(req.decoded.name);
        next();
    });

    //http://localhost:8080/api/createtag/:tag
    router.post('/createtag/:tag', function(req, res) {
        var tag = new Masterdb.TagModel();
        tag.createdby = req.decoded._id;
        tag.tagname = req.params.tag;
        // bodypart.musclegroups = ["Front Delts", "Lateral Delts", "Rear Delts"];
        console.log(tag.tagname);
        tag.save(function(err, user) {
            if (err) {
                return res.status(400).json({success: false, message: err});
            } else {
                console.log("New Tag has been created!");
                return res.status(200).json({success: true, message: 'New Tag created successfully! '});
            }
        });
    });

    //http://localhost:8080/api/createcategory/:category
    router.post('/createcategory/:category', function(req, res) {
        var category = new Masterdb.CategoryModel();
        category.createdby = req.decoded._id;
        category.categoryname = req.params.category;
        // bodypart.musclegroups = ["Front Delts", "Lateral Delts", "Rear Delts"];
        console.log(category.categoryname);
        category.save(function(err, user) {
            if (err) {
                return res.status(400).json({success: false, message: err});
            } else {
                console.log("New Category has been created!");
                return res.status(200).json({success: true, message: 'New Category created successfully! '});
            }
        });
    });


    //http://localhost:8080/api/createcollection
    router.post('/createcollection', function(req, res) {
        var collection = new Masterdb.CollectionModel();
        collection.createdby = req.decoded._id;
        collection.collectionname = req.body.collectionname;
        collection.collectiondesc = req.body.collectiondesc;
        collection.displaysequence = req.body.displaysequence;
        collection.coverimage = req.body.coverimage;
        // collection.coverimage = req.body.coverimage;
        collection.tags = req.body.tags;
        collection.categories = req.body.categories;

        console.log(collection.collectionname);
        collection.save(function(err, collection) {
            if (err) {
                return res.status(400).json({success: false, message: err});
            } else {
                console.log("New Collection has been created!");
                return res.status(200).json({success: true, message: 'New Collection created successfully! '});
            }
        });
    });

    //http://localhost:8080/api/editimage
    router.post('/editimage', function(req, res) {
        var imageid = req.body.imageid;
        Masterdb.KeyItemModel.findOneAndUpdate(
            {'_id': imageid },
            { '$set': {
                'keyitemname': req.body.keyitemname,
                'keyitemdesc': req.body.keyitemdesc,
                'primarycategory': req.body.primarycategory,
                'tags': req.body.tags
            }
        }).exec(function(err, data) {
            if(err) {
                return res.status(400).json({success: false, message: err});
            } else {
                return res.status(200).json({success: true, message: 'Edited Image Saved successfully! '});
            }
        });
    });

    //http://localhost:8080/api/editcollection
    router.post('/editcollection', function(req, res) {
        var collectionid = req.body.collectionid;
        Masterdb.CollectionModel.findOneAndUpdate(
            {'_id': collectionid },
            { '$set': {
                'collectionname': req.body.collectionname,
                'collectiondesc': req.body.collectiondesc,
                'coverimage': req.body.coverimage,
                'displaysequence' : req.body.displaysequence,
                'categories' : req.body.categories,
                'tags': req.body.tags
            }
        }).exec(function(err, data) {
            if(err) {
                return res.status(400).json({success: false, message: err});
            } else {
                return res.status(200).json({success: true, message: 'Edited Collection Saved successfully! '});
            }
        });
    });

    //http://localhost:8080/api/sendemailquery
    router.post('/sendemailquery', function(req, res) {
        console.log("received mail send request");
        var emailsubject = "Message from Chapi Dee website contact us form";
        var emailmessage = req.body.emailmessage;
        var emailname = req.body.emailname;
        var emailemail = req.body.emailemail;
        // console.log(emailemail);
        // console.log(emailname);
        // console.log(emailmessage);

        var send = gmailsend({
            //var send = require('../index.js')({
            user: 'artbyspm@gmail.com',
            // user: credentials.user,                  // Your GMail account used to send emails
            pass: 'edcrfvtgb',
            // pass: credentials.pass,                  // Application-specific password
            to:   'rharki@gmail.com',
            // to:   credentials.user,                  // Send to yourself
                                                   // you also may set array of recipients:
                                                   // [ 'user1@gmail.com', 'user2@gmail.com' ]
            // from:    credentials.user             // from: by default equals to user
            // replyTo: credentials.user             // replyTo: by default undefined
            subject: 'Dummy subject here' + Date.now(),
            text:    'Dummy message here, will be changed to actuals in next snippet',         // Plain text
            //html:    '<b>html text</b>'            // HTML
        });

        send ({ // Overriding default parameters
            subject: emailsubject,
            text: "Visitor email id is " + emailemail + ". Visitor name is " + emailname + ". message written is " + emailmessage + ". Message sent at time " + Date.now(),
        }, function (err, res) {
            // console.log('* [example 1.1] send() callback returned: err:', err, '; res:', res);
            if (err) {
                return res.status(400).json({success: false, message: err});
            } else {
                return res.status(200).json({success: true, message: 'Your message has been sent! '});
            }
        });
    });

    router.post('/fileupload/:categoryid', function (req, res) {
        // console.log(req.body.exercisename);
        var userId = req.decoded._id;
        var categoryid = req.params.categoryid;
        var tagids = req.query.tag;
        var imagename = req.query.name;
        var imagedesc = req.query.desc;
        var tagarr = tagids.split(",");
        var mypath = "";
        var uploadfilename = "";
        var src = "";
        var dest = "";

        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                console.log(__dirname);
                // mypath = '/Users/apple/Documents/CODING/MyProjects/Art Website/public/uploads/images/fulls/' + categoryid;
                mypath = path.join(__dirname, '../../public/uploads/images/fulls/' + categoryid);
                console.log(mypath);
                // dest = '/Users/apple/Documents/CODING/MyProjects/Art Website/public/uploads/images/thumbnails/' + categoryid;
                dest = path.join(__dirname, '../../public/uploads/images/thumbnails/' + categoryid);
                console.log(dest);
                mkdirp.sync(mypath);
                mkdirp.sync(dest);
                callback(null, mypath);
            },
            filename: function (req, file, callback) {
                if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
                    var err = new Error();
                    err.code = 'filetype';
                    return cb(err);
                } else {
                    uploadfilename = Date.now() + '_' + file.originalname;
                    // src = mypath + '/' + uploadfilename;
                    // dest += '/' + uploadfilename;
                    // console.log("upload file name is" + uploadfilename);
                    callback(null, uploadfilename);
                }
            }
        });

        var upload = multer({
            storage: storage,
            limits: {fileSize: 10000000 }
        }).single('myFile');

        upload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.json({ success: false, message: 'File size is more than 10MB!' });
                } else if (err.code === "filetype") {
                    return res.json({ success: false, message: 'Only jpeg, jpg and png files are allowed for now!' });
                } else {
                    console.log(err);
                    return res.json({ success: false, message: 'Unknown error occured in uploading file, please try again!' });
                }
            } else {
                if (!req.file) {
                    return res.json({ success: false, message: 'Please upload atleast one file to upload' });
                } else {
                    // res.json({ success: true, message: 'File successfully uploaded' });
                    var message = "File successfully uploaded";
                    // Jimp.read(mypath + "/" + uploadfilename, function(err, image) {
                    //     if (err) throw err;
                    //     image.resize(Jimp.AUTO, 256)            // resize
                    //          .quality(80)                 // set JPEG quality
                    //          .greyscale(0)                 // set greyscale
                    //          .write(dest + "/" + uploadfilename); // save
                    //      });

                    var keyitem = new Masterdb.KeyItemModel();
                    // console.log('hello');
                    // console.log("from keyitem db saving: uploadfilename is " + uploadfilename);
                    keyitem.createdby = userId;
                    keyitem.keyitemname = imagename || "test name for any photo";
                    keyitem.keyitemdesc = imagedesc || "test description for any photo ....";
                    keyitem.keyitemimagename = uploadfilename;
                    keyitem.primarycategory = categoryid;
                    keyitem.tags = tagarr;

                    keyitem.save(function(err, user) {
                        if (err) {
                            console.log({success: false, message: err});
                            message += " but issue in saving to key item DB" + err;
                            return res.json({success: false, message: message});
                        } else {
                            console.log("New Key Item has been created!");
                            message += " and New Key Item has been created!";
                            return res.json({success: true, message: message});
                        }
                    });
                }
            }
        });
    });


    return router;
};

module.exports = router;
