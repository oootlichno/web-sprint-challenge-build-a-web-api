const express = require("express");

const {
  validateProject,
  validateProjectId,
} = require("./projects-middleware");

const Project = require('./projects-model');

const router = express.Router();


router.get('/', async (req, res, next) => {
    console.log('Received GET request for /api/projects');
    try {
        const projects = await Project.get();
        console.log('Projects retrieved:', projects);
        res.json(projects);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', validateProjectId, async (req, res) => {
    res.json(req.project);
});

router.post('/', validateProject, async (req, res, next) => {
    try {
        const newProject = await Project.insert({
            name: req.body.name,
            description: req.body.description
        });
        res.status(201).json(newProject);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', validateProject, validateProjectId, async (req, res, next) => {
    try {
        const rowsChanged = await Project.update(req.params.id, {
            name: req.body.name,
            description: req.body.description
        });
        if (rowsChanged === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        const updatedProject = await Project.getById(req.params.id);
        res.json(updatedProject);
    } catch (err) {
        next(err);
    }
});
 
router.delete('/:id', validateProjectId, async (req, res, next) => {
    try {
        const rowsDeleted = await Project.remove(req.params.id);
        if (rowsDeleted === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router; 

