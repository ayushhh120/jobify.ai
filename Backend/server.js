const app = require('./app')
const http = require('http')
const port = process.env.PORT
const server = http.createServer(app);


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})