var mongoose = require('mongoose')

const conn = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Task-Management").then(() => console.log("Mongodb connected"))
  } catch (error) {
    console.log(error)
  }
}

conn()