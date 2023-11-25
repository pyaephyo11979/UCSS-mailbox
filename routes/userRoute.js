const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileupload = require('express-fileupload');
const { SESSION_SECRET } = process.env ;
const user_route = express();
user_route.use(session({ secret: SESSION_SECRET }));
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.set('view engine', 'ejs');
user_route.set('views', './views');
user_route.use(express.static('public'));
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        console.log(Object, file);
        const name = Date.now() + '-' + file.originalname;
        console.log(name)
        cb(null, name);
    },
});
const upload = multer({ storage: storage });
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
user_route.get('/register', userController.registerLoad);
user_route.post('/register', userController.register);
user_route.get('/login', auth.isLogout, userController.loginLoad);
user_route.post('/login',auth.isLogout, userController.login);
user_route.get('/logout', userController.logout);
user_route.get('/article', auth.isLogin, userController.articleLoad);
user_route.post('/article',upload.single('image'), userController.article);
user_route.get('/home', auth.isLogin, userController.loadHome);
user_route.post('/like',auth.isLogout, userController.like);
user_route.post('/comment',auth.isLogout, userController.comment);
user_route.get('/profileManage',auth.isLogin, userController.manageProfileLoad);
user_route.post('/delete',auth.isLogin, userController.deleteArticle);
user_route.get('*',(req,res)=>{
    res.redirect('/login')
})
module.exports = user_route;