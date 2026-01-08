const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Post = require('./postModel')
var crypto = require('crypto')
var nodemailer = require('nodemailer')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        default:"",
        maxlength: 50
    },
    profilePicture: {
        type: String,
        default:"default.png"
    },
    bio: {
        type: String,
        maxlength: 150,
        default:""
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref:'Post'
    }],
    followers:[{
        type: String,
        ref:'User'
    }],
    following:[{
        type: String,
        ref:'User'
    }],
    role: {
        type: String,
        enum: ['user', 'designer'], 
        default: 'user',
    },
    contact: {
        type: String
    },
    portfolio: {
        type: String
    },
    products:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
})


userSchema.statics.signup = async function(email, password, username){

    if (!email || !password || !username){
        throw Error('All fields must be filled.')
    }
    if (!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(password.length<8){
        throw Error("Password should contain minimum 8 characters.")
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password must meet the following criteria: At least 1 lowercase letter, 1 uppercase letter and 1 special character.')
    }

    const emailExists = await this.findOne({ email })

    if (emailExists) {
        throw Error('Email already used.')
    }

    const usernameExists = await this.findOne({ username })

    if (usernameExists) {
        throw Error('Username already used.')
    }

    if(username.includes(' ')){
        throw Error('Username must not contain white spaces.')
    }

    const salt = await bcrypt.genSalt(10)   
    const hash = await bcrypt.hash(password, salt) 
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
 
    
    const user = await this.create({ email, password: hash, username, verificationToken, verificationTokenExpires })

    //sendVerificationEmail(user.email, user.verificationToken)

    return {
        message: 'Signup successful. Please check your email for verification.',
        user}
}

userSchema.statics.login = async function(email, password){
    
    if (!email || !password){
        throw Error('All fields must be filled.')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Incorrect Email.')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error("Incorrect Password.")
    }

    return user

}

userSchema.statics.update = async function(username, updateFields){
    try{
        const user = await this.findOne({username: username})
        if(!user){
            throw new Error('User not found')
        }

        for(let field in updateFields){
            if(updateFields[field] !== undefined){
                user[field] = updateFields[field]
            }
        }

        await user.save();
        return user
    }catch(error){
        throw new Error('Error updating profile', error)
    }
}

userSchema.statics.createPost = async function(username, image, caption, tags){
    try{
        const user = await this.findOne({ username });
        

        const post = await Post.create({ image, caption, author: username})

        user.posts.push(post._id)
        
        await user.save()

        if(tags){
            await Post.findByIdAndUpdate(post._id, { tags });
        }

        return post
    }catch(error){
        console.log(error)
        throw new Error('Error creating post', error)
    }
}

function sendVerificationEmail(email, verificationToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'projecthiep@gmail.com',  // Your email address
            pass: 'Hiep@1234'    
        }
    });

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: 'your-email@example.com',
        to: email,
        subject: 'Verify Your Email',
        text: `Click the following link to verify your email: ${verificationLink}`,
        html: `<p>Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending verification email:', error);
        } else {
            console.log('Verification email sent:', info.response);
        }
    });
}

module.exports = mongoose.model('User', userSchema)