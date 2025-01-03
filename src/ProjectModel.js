import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  location: String,
  projectId: String,
  title: String,
  govtBudget: Number,
  comperiod: String,
  approvalStatus: { type: String, default: 'Approval Pending' },
  projectStatus: { type: String, default: 'On Work Process' },
  approvalDate: Date,
  expectedCompletion: Date,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
