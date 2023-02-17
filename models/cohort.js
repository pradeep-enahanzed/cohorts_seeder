const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

//Schema: Member
var MemberSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User" },
  added_by: { type: ObjectId, ref: "User" },
  added_at: Date,
  email: { type: String, index: true },
  permit_val: {
    type: String,
    enum: [
      "moderator",
      "teacher",
      "active",
      "inactive",
      "invited",
      "courseFacilator",
    ],
  },
});
var CohortSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  learnerLimit: { type: Number, required: true },
  slug: { type: String, index: true, unique: true },
  is_active: { type: Boolean, default: true },
  autoAccessApproval: { type: Boolean, default: false },
  joinCode: { type: String, index: true },
  creator: { type: ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
  members: [MemberSchema],
  courseId: { type: ObjectId, ref: "Course" },
  count: {
    skills: { type: Number, default: 0 },
    badges: { type: Number, default: 0 },
    members: { type: Number, default: 0 },
    learners: { type: Number, default: 0 },
  },
  joiningLink: { type: String, unique: true },
  certification: { type: Boolean, default: false },
  type: { type: String, required: true, default: "default" },
});
module.exports.Cohort = mongoose.model("cohorts", CohortSchema);
module.exports.Members = mongoose.model("Members", MemberSchema);
