const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

//Schema: Member
var MemberSchema = new mongoose.Schema({
    user: { type: ObjectId, ref: 'users' },
    added_by: { type: ObjectId, ref: 'users' },
    added_at: Date,
    email: { type: String, index: true },
    permit_val: { type: String, enum: ['moderator', 'teacher', 'active', 'inactive', 'invited', 'courseFacilator'] }
});
var CohortSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    customText: { type: String },
    startDate: { type: Date, required: true, default: () => Date.now() },
    endDate: { type: Date, required: true, default: () => Date.now() + 364 * 10 },
    learnerLimit: { type: Number, required: true, default: 50 },
    slug: { type: String, index: true, unique: true },
    is_active: { type: Boolean, default: true },
    autoAccessApproval: { type: Boolean, default: false },
    joinCode: { type: String, index: true },
    creator: { type: ObjectId, ref: 'users' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date,
    members: [MemberSchema],
    courseId: { type: ObjectId, ref: 'courses' },
    joiningLink: { type: String, unique: true },
    certification: { type: Boolean, default: false },
    type: { type: String, required: true, default: 'default', enum: ['default', 'facilitated'] }
});
module.exports.Cohort = mongoose.model('cohorts', CohortSchema);
module.exports.Members = mongoose.model('Members', MemberSchema);