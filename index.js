require('dotenv').config(); 
const server = require('./api/server')

const Port = process.env.PORT || 5002
server.listen(Port, () => {
    console.log(`listening on port ${Port}`)
})
