const express = require('express');
const server = express();

const actionsRouter = require('../api/actions/actions-router');
const projectRouter = require('../api/projects/projects-router');

const cors = require('cors');
server.use(cors()); 

const { logger } = require('./projects/projects-middleware');
const { validateProject, validateProjectId } = require('./projects/projects-middleware');
const { validateAction } = require('./actions/actions-middlware');

server.use(express.json()); 
server.use(logger); 
server.use('/api/projects', projectRouter);
server.use('/api/actions', actionsRouter);

module.exports = server;
