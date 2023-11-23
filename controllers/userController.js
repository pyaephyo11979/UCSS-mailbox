const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Article = require('../models/articleModel');
const registerLoad= async (req,res)=>{
  try{
    res.render('signup');
  }catch(err){
    console.log(err);
  }
}
const register = async (req,res)=>{
    try{
        const paswordHesh=bcrypt.hashSync(req.body.password,10);
        const user= new User({
             name:req.body.name,
             StudentID:req.body.StudentID,
             email:req.body.email,
             password:paswordHesh,
         })
         await user.save();
         res.render('signup',{message:'Register successfully'});
    }catch(err){
        console.log(err);
    }
}
const loginLoad = async (req,res)=>{
   try{
    res.render('login');
   }catch(err){
    console.log(err);
   }
}
const login = async (req,res)=>{
try{
    const {email,password}= req.body;
    const userData=await User.findOne({ email: email });
    if(userData){
        const passMatch= bcrypt.compareSync(password,userData.password);
        if(passMatch){
            req.session.user=userData;
            const articles=await Article.find();
            req.session.articles=articles;
            res.redirect('/dashboard');
        }else{
            res.render('login',{message:'Password does not match!'});
        }
    }else{
        res.render('login',{message:'Email or Password Incorrect!'});
    }
}catch(err){
    console.log(err);
}
}
const logout = async (req,res)=>{
try{
    req.session.destroy();
    res.redirect('/login');
}catch(err){
    console.log(err);
}
}
const loadHome= async (req,res)=>{
try{
    const articles=await Article.find();
    res.render('home',{articles:articles,user:req.session.user});
}catch(err){
    console.log(err);
}
}
const articleLoad= async (req,res)=>{
    try{
        const articles=await Article.find();
        res.render('home',{user:req.session.user,articles:req.session.articles});
    }catch(err){
        console.log(err);
    }
}
const article= async (req,res)=>{
    try{
        if(req.body.category==='' || req.body.tags==='' || req.file.filename==undefined){
            const article=new Article({
                content:req.body.content,
                userID:req.body.userID,
                category:'General',
                tag:'General',
                likes:0,
            })
            await article.save();
            res.redirect('/home');
        }else{
        const article=new Article({
            content:req.body.content,
            userID:req.body.userID,
            image:'images/'+req.file.filename,
            category:req.body.category,
            tag:req.body.tags,
            likes:0,
        })
        await article.save();
        res.redirect('/home');
    }
    }catch(err){
        console.log(err);
    }
}
const like = async (req, res) => {
    try {
        const { articleID, userID } = req.body;
        const article = await Article.findOne({ _id: articleID });
        const likes = article.likes;
        const hasLiked = likes.includes(userID);

        // If the user has already liked the article, remove their like
        if (hasLiked) {
            const updatedLikes = likes.filter((like) => like !== userID);
            article.likes = updatedLikes;
        } else {
            // If the user has not liked the article, add their like
            article.likes.push(userID);
        }

        // Save the updated article
        const updatedArticle = await article.save();

        res.render('home', { user: req.session.user, articles: req.session.articles });
            } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
            }
        }
const comment = async (req,res)=>{
    try{
        const {articleID,userID,comment}=req.body;
        const article=await Article.findOne({_id:articleID});
        const comments=article.comments;
        comments.push({userID:userID,comment:comment});
        await Article.findOneAndUpdate({_id:articleID},{comments:comments});
        res.render('home',{user:req.session.user,articles:req.session.articles});
    }catch(err){
        console.log(err);
    }
}
const deleteArticle= async (req,res)=>{
    try{
        const articleID=req.body.articleID;
        const userID=req.session.user.StudentID;
        await Article.findOneAndDelete({_id:articleID,userID:userID});
        res.render('manageProfile',{user:req.session.user,articles:req.session.articles});
    }catch(err){
        console.log(err);
    }
}
const manageProfileLoad= async (req,res)=>{
    try{
        const articles=await Article.find({userID:req.session.user.StudentID});
        res.render('manageProfile',{user:req.session.user,articles:articles});
    }catch(err){
        console.log(err);
    }
}
const manageProfile= async (req,res)=>{
    try{

    }catch(err){
        console.log(err);
    }
}
module.exports={
    registerLoad,
    register,
    loginLoad,
    login,
    logout,
    loadHome,
    articleLoad,
    article,
    like,
    comment,
    deleteArticle,
    manageProfileLoad,
    manageProfile
}