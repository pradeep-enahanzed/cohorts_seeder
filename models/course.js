const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    tagline: String,
    slug: { type: String, index: true, unique: true },
    image: {
        m: String,
        l: String
    },
    certificate_logo: {
        m: String,
        l: String
    },
    certificate_signature: {
        m: String,
        l: String
    },
    signatory: Boolean,
    signatory_name: String,
    signatory_designation: String,
    bound: Number,
    org: {
        name: String,
        logo: String,
        url: String
    },
    is_active: { type: Boolean, default: true },
    privacy: { type: String, enum: ['public', 'private', 'unlisted'], index: true, default: 'private' },
    join_code: { type: String, index: true },
    certification: { type: Boolean, default: false },
    tag: {
        core: String,
        sel: String,
        sdg: String
    },
    creator: { type: ObjectId, ref: 'users' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date,

    /* Theme */
    color: {
        a: String,
        b: String
    },

    /* Count */
    count: {
        skills: { type: Number, default: 0 },
        badges: { type: Number, default: 0 },
        members: { type: Number, default: 0 },
        learners: { type: Number, default: 0 },
        time: { type: Number, default: 0 }
    }
});
module.exports = mongoose.model('courses', CourseSchema);