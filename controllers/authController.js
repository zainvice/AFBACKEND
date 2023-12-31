const User = require('../models/user')
const Admin= require('../models/admin')
const userControllers = require('./userController')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @ route POST /auth
// @ access public
const login = asyncHandler( async(req, res) => {
    const{ username, password, email } = req.body
    console.log(email, password)
    if(!email||!password){
        return res.status(400).json({ message: 'All fields are required'})
    }
    
    const foundUser = undefined
    const foundAdmin = await Admin.findOne({email}).exec()
    
    if(!foundUser&&!foundAdmin){
        return res.status(401).json({ message: 'Unauthorized' })

    }
    if(foundUser){
        if(!foundUser.active)
            return res.status(401).json({ message: 'Unauthorized' })

        const match = await bcrypt.compare(password, foundUser.password)

        if(!match) 
            return res.status(402).json({message: 'Incorrect Password'})
        
        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "email": foundUser.email,
                    "fullName": foundUser.fullName,
                    "role": foundUser.role,
                    "proposals_found": foundUser.proposals
                }
            
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m'}
        )
    
        const refershToken = jwt.sign(
            {"email": foundUser.email},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2hr'}
        )
    
        res.cookie('jwt', refershToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None', //cross-site cookie
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        })
        
        res.json({ accessToken, Name: foundUser.email, Role: foundUser.role })
    }
    if(foundAdmin){
        if(!foundAdmin.active)
            return res.status(401).json({ message: 'Unauthorized' })
        
        const match = await bcrypt.compare(password, foundAdmin.password)

        if(!match) 
            return res.status(402).json({message: 'Incorrect Password'})

        const accessToken = jwt.sign(
            {
                "UserInfo":{
                    "email": foundAdmin.email,
                    "fullName": foundAdmin.fullName,
                    "role": foundAdmin.role
                }
            
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m'}
        )
    
        const refershToken = jwt.sign(
            {"email": foundAdmin.email},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '2hr'}
        )
    
        res.cookie('jwt', refershToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None', //cross-site cookie
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        })
        
        res.json({ accessToken, Name: foundAdmin.email, Role: foundAdmin.role })
    }

})

// @ route POST /auth/sigup
// @ access public
const signup =(req, res) =>{
   userControllers.createNewUser(req, res)
}


// @ route Get /auth/refersh
// @ access public
const refresh =(req, res) =>{
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized'})

    const refershToken= cookies.jwt

    jwt.verify(
        refershToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) =>{
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ email: decoded.email})
            const foundAdmin = await Admin.findOne({ email: decoded.email})

            if (!foundUser&&!foundAdmin) return res.status(401).json({ message: 'Unauthorized'})

            if(foundUser){
                const accessToken = jwt.sign(
                    {
                        "UserInfo":{
                            "email": foundUser.email,
                            "role": foundUser.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '60m'}
                )
    
                res.json({ accessToken })
            }
            if(foundAdmin){
                const accessToken = jwt.sign(
                    {
                        "UserInfo":{
                            "email": foundAdmin.email,
                            "role": foundAdmin.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '60m'}
                )
    
                res.json({ accessToken })
            }
        })
    )
}


//@ route /auth/logout
//@ access Public
const logout = (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', { httpOnly: true, sameSite:'None', secure: true })
    res.json({ message: 'Cookie cleared' })

}

module.exports ={
    login,
    signup,
    refresh,
    logout,
}