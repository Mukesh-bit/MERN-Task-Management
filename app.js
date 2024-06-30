const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())

const user = require('./routes/user')
const task = require('./routes/task')

require('./conn/conn')


app.get('/', (req,res) => {
  res.send("server is connected")
})

app.use('/api/v1',user)
app.use('/api/v1',task)

app.listen(1000, () => console.log("Server started"))