const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    title: {
        type: String,
        required: 'Kindly enter the title of the document'
    },
    content: {
        type: String,
        required: 'Kindly enter the content of the document'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    access: {
        type: String,
        required: 'Kindly enter the access level for the document'
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    modifiedOn: {
        type: Date,
        default: Date.now
    }
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;