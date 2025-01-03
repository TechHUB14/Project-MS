import express from "express";
const router = express.Router();
import "./ProjectModel.jsx"

// POST: Add a new project
router.post('/projects', async (req, res) => {
  const { location, projectId, title, govtBudget, comperiod } = req.body;
  try {
    const newProject = new Project({
      location,
      projectId,
      title,
      govtBudget,
      comperiod,
    });

    await newProject.save();
    res.status(201).json({ project: newProject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update project approval or status
router.put('/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { approvalStatus, projectStatus, approvalDate, expectedCompletion } = req.body;
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { projectId },
      { approvalStatus, projectStatus, approvalDate, expectedCompletion },
      { new: true }
    );
    res.status(200).json({ project: updatedProject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
