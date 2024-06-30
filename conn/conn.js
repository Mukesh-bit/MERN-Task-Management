var mongoose = require('mongoose')

const conn = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI).then(() => console.log("Mongodb connected"))
  } catch (error) {
    console.log(error)
  }
}

conn()