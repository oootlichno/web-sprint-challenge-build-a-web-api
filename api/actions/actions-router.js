const express = require("express");

const {validateAction} = require("./actions-middlware");

const Action = require('./actions-model');
const Project = require('../projects/projects-model'); 

const router = express.Router();


router.get('/', async (req, res, next) => { 
    try {
        const actions = await Action.get();
        res.json(actions);
    } catch (err) {
        next(err);
    }
});


router.get('/:id', validateAction, async (req, res, next) => {
    try {
        const action = await Action.get(req.params.id); 
        if (action) {
            res.status(200).json(action);
        } else {
            res.status(404).json({ message: 'Action not found' }); 
        }
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { project_id, description, notes, completed } = req.body;

        if (!project_id || !description || !notes) {
            return res.status(400).json({
                message: "Missing required fields: project_id, description, and/or notes",
            });
        }

        const project = await Project.get(project_id);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const newAction = await Action.insert({ 
            project_id, 
            description, 
            notes, 
            completed: completed || false 
        });
        res.status(201).json(newAction);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', validateAction, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { project_id, description, notes, completed } = req.body;

        if (!project_id || !description || !description.trim() || !notes || !notes.trim()) {
            return res.status(400).json({
                message: "Missing required fields: project_id, description, and/or notes",
            });
        }

        const project = await Project.get(project_id);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const updatedAction = await Action.update(id, { 
            project_id, 
            description, 
            notes, 
            completed 
        });
        res.json(updatedAction);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', validateAction, async (req, res, next) => {
    try {
        const { id } = req.params;

        const rowsDeleted = await Action.remove(id);
        if (rowsDeleted === 0) {
            return res.status(404).json({
                message: "Action not found",
            });
        }

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
