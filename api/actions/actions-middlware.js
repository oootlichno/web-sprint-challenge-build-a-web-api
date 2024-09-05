const Action = require('../actions/actions-model')

async function validateAction(req, res, next) {
    try {
        const action = await Action.get(req.params.id); 
        if (!action) {
            next({
                status: 404,
                message: "Action with this ID not found",
            });
        } else {
            req.action = action;
            next();
        }
    } catch (err) {
        res.status(500).json({
            message: "Problem finding action",
        });
    }
}
  
  module.exports = {
    validateAction
  };