const isLogin= async (req,res,next)=>{
    if(req.session.user){
    }else{
      return  res.redirect('/login');
    }
    next();
}
const isLogout= async (req,res,next)=>{
    if(req.session.user){
       return res.redirect('/home');
    }else{
    }
    next();
}
module.exports={
    isLogin,
    isLogout,
}