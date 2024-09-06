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
        const { name, description, completed = false } = req.body; 
        const newProject = await Project.insert({
            name,
            description,
            completed  
        });
        res.status(201).json(newProject);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', validateProject, validateProjectId, async (req, res, next) => {
    try {
        const { name, description, completed } = req.body;

        if (name === undefined || description === undefined || completed === undefined) {
            return res.status(400).json({ message: "Missing required fields: name, description, or completed" });
        }

        const updatedProject = await Project.update(req.params.id, { name, description, completed });
        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

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

router.get('/:id/actions', validateProjectId, async (req, res, next) => {
    const projectId = req.params.id; 
    try {
        const actions = await Project.getProjectActions(projectId); 
        if (actions.length > 0) {
            res.status(200).json(actions);
        } else {
            res.status(404).json([]); 
        }
    } catch (err) {
        next(err); 
    }
});


module.exports = router; 

