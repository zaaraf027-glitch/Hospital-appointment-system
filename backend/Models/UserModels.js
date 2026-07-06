import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password:{
    type:String,
    required:true,
    minlength:6,
  },
  role:{
    type:String,
    enum:["patient","admin"],
    default:"patient",
  },
  phone:{
    type:String,
    default:"",

  },
  gender:{
    type:String,
    enum :["Male","Female","Other"],
    default:"Male",
  },
  address:{
    type:String,
    default:"",

  },
  
},{
    timestamps:true,
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
      return ;
    }
      this.password = await bcrypt.hash(this.password,10);
      
    
});

const User = mongoose.model("User",userSchema);
export default User;