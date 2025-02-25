import User from '../models/user';
import { hashPassword,comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';
export const register = async (req,res)=>{
try{
// console.log(req.body);
const {name,email,password}=req.body;
// validation
if(!name) return res.status(400).send("Name is required")
if(!password||password.length<6){
    return res
    .status(400)
    .send("Password is required and should be min 6 characters long");
}
let userExist = await User.findOne({email}).exec();
if(userExist) return res.status(400).send("Email is taken");

// hash password
const hashedPassword = await hashPassword(password);

// register
const user = new User({
    name,
    email,
    password: hashPassword,

});
await user.save();
console.log("Saved user ", user);
return res.json({ok: true});
}catch(err){
    console.log(err);
    return res.status(400).send("Error. Try again");
}
}

export const login = async (req,res)=>{
    // 
    try{
        // console.log(req.body);
        const {email,password} =req.body;
        // check if our db has user with that email
        const user = await User.findOne({email}).exec();
        if(!user) return  res.status(400).send("NO User Found");
        // check password
        const match = await comparePassword(password,user.password);
        // create signed jwt

        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET, 
             {expiresIn:'7d', //logined for 7 days
            });
            // retrun user and token to client , exclude hased Password
    user.password = undefined;  
    // send token in cookie
    res.cookie("token",token,{
        httpOnly:true,
        // secure:true, //only works on https
    });
    // send user a json response;
    res.json(user);
    }catch(err){
        console.log(err);
        return res.status(400).send("Error.Try again.")
    }
};