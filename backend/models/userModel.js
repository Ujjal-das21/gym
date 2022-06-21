const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your Name"],
        maxlength:[30,"Name Cannot exceed 30 characters"],
        minlength:[4,"Name must be atleast 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your Email"],
       unique:true,
       validate:[validator.isEmail,"Please enter a valid email"]

    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:[8,"Password should be minimun 8 characters"],
        select:false,

    },
    avatar:{
        
            public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
        

    }
    this.password = await bcrypt.hash(this.password,10)
})
//jwt token
userSchema.methods.getJWTToken = function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE,

    });
   
};
//compare password

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}
//generating password rest token
userSchema.methods.getResetPasswordToken =function(){

    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");
    //hashing and adding to userschema
    this.resetPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
    this.resetPasswordExpire = Date.now()+15*60*1000;
    return resetToken;

   
}
module.exports = mongoose.model("User",userSchema);
//reset password
