var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    id: { type: String, lowercase: true, unique: true },
    creationDate: { type: Date },
    deletedDate: { type: Date },

    todo: {
        name: { type: String, default: '' },
        title: { type: String, default: '' },
        categorie: { type: String, default: '' },
        description: { type: String, default: '' },
        progresss: { type: String, default: '' },
        files: { type: String, default: '' },
        assignated: { type: String, default: '' },
        startDate: { type: Date, default: '' },
        dueDate: { type: Date, default: '' }
    }
}, { timestamps: true });

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
