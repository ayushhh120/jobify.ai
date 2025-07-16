const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      require: true,
      minlength: [3, "Firstname must be atleast three characters long"],
    },

    lastname: {
      type: String,
      require: true,
    },
  },

  email: {
    type: String,
    require: true,
    matches: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address'],
    minlength: [, "Email must be atleast five characters long"],
  },

  password: {
    type: String,
    require: true,
    select: false
  },
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{expiresIn: '24h'})
    return token;
}

userSchema.methods.comparePassword =  async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashThePassword = async function(password){
  return await bcrypt.hash(password, 10) 
}

const userModel = mongoose.model('user', userSchema)


module.exports = userModel;