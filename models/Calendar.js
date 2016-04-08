var mongoose = require('mongoose');

var calendarSchema = new mongoose.Schema({
    id: { type: String, lowercase: true, unique: true },
    creationDate: Date,
    deletedDate: Date,

    calendar: {
        startDate: { type: Date, default: '' },
        dueDate: { type: Date, default: '' },
        type: { type: String, default: 'meeting' }
    }
}, { timestamps: true });

var Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = Calendar;
