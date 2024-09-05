const Project = require('../projects/projects-model')

function logger(req, res, next) {
const timestamp = new Date().toLocaleString()
const method = req.method
const url = req. originalURL
 console.log(`[${timestamp}] ${method} to ${url}`)
 next()
}

async function validateProject(req, res, next) {
    try {
        const { name, description } = req.body;

        if (!name || !description ) {
            return res.status(400).json({
                message: "Missing required fields: name and/or description",
            });
        }

        req.body.name = name;
        req.body.description = description;

        next(); 
    } catch (error) {
        next(error); 
    }
}

async function validateProjectId(req, res, next) {
  try{
    const project = await Project.get(req.params.id)
if(!project){
  next ({
  status: 404,
      message: "project not found" })
  
}
else{
  req.project = project
  next()
}
  }
catch(err){
res.status(500).json({
  message: 'problem finding project',
})
}
}


module.exports = {
  logger,
  validateProject,
  validateProjectId,
  
};
 
