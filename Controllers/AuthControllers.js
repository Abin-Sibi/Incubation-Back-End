const UserModel = require("../Models/UserModel");
const jwt = require('jsonwebtoken')
const Application = require("../Models/application");
const asyncHandler = require("express-async-handler")
const { Types } = require("mongoose");
const multer = require('multer')

const maxAge = 3*24*60*60
const createToken = (id)=>{
    return jwt.sign({id},"abin super secret key",{
        expiresIn:maxAge,
    })
};

const handleErrors = (err)=>{
    let errors = {email:"",password:""};
    if(err.message ==="Incorrect Email")
    errors.email ="That email is not Registered"

    if(err.message ==="Incorrect password")
    errors.email ="That password is incorrect"

    if(err.code===11000){
        errors.email = "Email is already Exists"
        return errors;
    }

    if(err.message ==="You are blocked by admin")
    errors.email ="You are blocked by admin"

    if(err.message.includes("Users validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

module.exports.register = async (req,res,next)=>{
    try{
        const {email,password} = req.body;
        const user = await UserModel.create({email,password});
        const token = createToken(user._id);

        res.cookie("jwt",token,{
         withCredectials:true,
         httpOnly:false,
         maxAge:maxAge *1000,
        });
        res.status(201).json({user:user._id,created:true})
 }catch(err){
       console.log("this is the error in jwt",err)
       const errors = handleErrors(err);
       res.json({errors, created:false});
 }
}

module.exports.login = async (req,res,next)=>{
    try{
        const {email,password} = req.body;
        const user = await UserModel.login(email,password);
        const token = createToken(user._id);

        res.cookie("jwt",token,{
         withCredectials:true,
         httpOnly:false,
         maxAge:maxAge*1000,
        });
        res.status(200).json({user:user._id,created:true})
 }catch(err){
       console.log("this is the error in jwt",err)
       const errors = handleErrors(err);
       res.json({errors, created:false});
 }
}

module.exports.addApplication = asyncHandler(async (req, res) => {
    try {
      let info = await Application(req.body).save();
      // console.log(data);
      res.json({id:info.userId,status:true});
    } catch (error) {
      res.send(error.status).json(error.message);
    }
  });

  module.exports.didApply = asyncHandler(async (req, res) => {
    try {
      let id = req.params.id;
      console.log("abin")
      let info = await Application.findOne({ userId: Types.ObjectId(id) });
      console.log("abin123",info)
      if (info) res.json(info);
      else {
        console.log("i have application");
        res.json({ status: false });
      }
    } catch (error) {
        console.log("abin")
      res.status(error.status).json(error.message);
    }
  });

  module.exports.uploadLogo = asyncHandler(async (req, res) => {
    try {
      // multer configaration
      console.log("Image route top");
      const upload = multer({
        storage: multer.diskStorage({
          destination: "./public/uploads/",
          filename: function (req, file, cb) {
            cb(null, req.imageName);
          },
        }),
      }).single("image");
  
      req.imageName = `${req.params.id}.jpg`;
      upload(req, res, (err) => {
        console.log(err +"++++++++++++++++");
      });
      //
      res.json("done");
      console.log("Image route end");
    } catch (error) {
        console.log("Image end catcherr");
      res.status(error.status).json(error.message);
    }
  });


module.exports.fetchUser = asyncHandler(async (req, res) => {
    try {
      const userData = await UserModel.find();
      res.json(userData);
    } catch (error) {
      res.send(error.status).json(error.message);
    }
  });
  