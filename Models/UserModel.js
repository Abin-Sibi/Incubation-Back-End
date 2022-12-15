const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
    },
    isBlocked:{
      type:Boolean,
    }
},
{
  timestamps: true,
});

userSchema.pre("save",async function(next){
 const salt = await bcrypt.genSalt();
 this.password =await bcrypt.hash(this.password,salt)
 next();
})

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        if(user.isBlocked===false){
            const auth = await bcrypt.compare(password,user.password);
            if(auth){
                return user;
            }
            throw Error("Incorrect password")
        }
        throw Error("You are blocked by admin")
    }
    throw Error("Incorrect Email");
}
module.exports = mongoose.model("Users",userSchema)