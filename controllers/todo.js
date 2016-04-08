var async = require('async');
var passport = require('passport');
var Todo = require('../models/Todo');
var mongoose = require('mongoose');

/**
* POST /todo
* Add new todo
*/
exports.postTodo = function(req, res, next) {
    var today = new Date();
    var todo = new Todo({
        id: mongoose.Types.ObjectId(),
        creationDate: today.toString(),
        deletedDate: null,
        todo: {
            name: "Coucou",
            title: null,
            categorie: "externalKey",
            description: "externalKey",
            progresss: null,
            files: "externalKey",
            assignated: "externalKey",
            startDate: today.toString(),
            dueDate: today.toString()
            /*
             title: req.body.title,
             categorie: req.body.categorie,
             description: req.body.description,
             progresss: req.body.progresss,
             files: req.body.files,
             assignated: req.body.assignated,
             startDate: req.body.startDate,
             dueDate: req.body.dueDate
             */
        }
    });
    todo.save(function(err) {
        if (err) {
            if (err) {
                console.log('Error Inserting New Data');
                if (err.name == 'ValidationError') {
                    for (field in err.errors) {
                        console.log(err.errors[field].message);
                    }
                }
            }
        }
        req.flash('success', { msg: 'Todo added.' });
        res.sendStatus(200);
    });
};