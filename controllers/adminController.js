const Admin= require('../models/admin')
const asyncHandler= require('express-async-handler')
const bcrypt = require('bcrypt')

// @des GET ALL ADMINS
// @route GET /admins
// @access Private

const getAllAdmins = asyncHandler(async (req, res) =>{
        const admins = await Admin.find().select('-password').lean()
        if(!admins?.length){
            return res.status(400).json({message: 'No admins found'})
        }
        res.json(admins)
})
// @des CREATE NEW ADMIN
// @route POST /admins
// @access Private

const createNewAdmin = asyncHandler(async (req, res) =>{
        const{email, fullName, phone, password}= req.body

        //Confirm data 
        if (!email|| !password || !phone){
                return res.status(400).json({message: 'All fields are required!'})

        }

        //Check for duplicates

        const duplicates = await Admin.findOne({email}).lean().exec()

        if(duplicates){
            return res.status(409).json({message: 'Already exits!'})
        }

        // Hash password 

        const hashedPwd = await bcrypt.hash(password, 10)

        const adminObject ={ email, fullName ,phone, "password": hashedPwd}

        // Create a store new admin

        const admin= await Admin.create(adminObject)
        if(admin){
            res.status(201).json({message: `New admin ${fullName} created!`})
        } else{
            res.status(400).json({message: 'Invaild Data used'})
        }
})

// @des Update ADMIN
// @route Patch /admins
// @access Private

const updateAdmin = asyncHandler(async (req, res) =>{
    const {email, phone, role, password, active}= req.body
    //Confirm Data
    if(!email&&!phone){
        return res.status(400).json({message: 'Email required!'})
    }
    let admin
    if(phone){
        admin = await Admin.findOne({phone}).exec()
    }

    if(email){
        admin = await Admin.findOne({email}).exec()
    }
   
    if(!admin){
        return res.status(400).json({message: 'Admin not found!'})
    }

    //Check for duplicates

    /*const duplicates= await Admin.findOne({email}).lean().exec()

    //Allow updates to the original admin
    if (duplicates){
            return res.status(409).json({message: 'Duplicate email'})
    }*/
    if(email){
        admin.email = email
    }
    if(role){
        admin.role= role
    }
    if(phone){
        admin.phone=phone
    }

    if(active||active!=undefined){
        admin.active=active
    }
    if(password){
        //Hash Password
        admin.password = await bcrypt.hash(password, 10)
    }
    const updatedAdmin= await admin.save()
    
    console.log(updatedAdmin)

    res.json({message: `${updatedAdmin.email} updated!`})
    console.log('I\'m 1 here')
})

// @des delete ADMIN
// @route delete /admins
// @access Private

const deleteAdmin = asyncHandler(async (req, res) =>{
    const {phone, active}= req.body
    console.log(phone, active)
    if(!phone){
        return res.status(400).json({message: 'Phone Required'})

    }

    /*const note= await Note.findOne({phone}).lean().exec()

    if(note){
        return res.status(400).json({message: 'Admin has assigned tasks'})
    }*/
    const admin = await Admin.findOne({phone}).exec()

    if(!admin){
        return res.status(404).json({message: 'Admin not found'})

    }
    let result
    if(active){
        result = await admin.deleteOne()
    }
    if(!active){
        admin.active=active
        result = await Admin.findByIdAndUpdate(admin._id, admin)
    }
    

    const reply = `Phone ${result.phone} with ID ${result._id} deleted!`

    res.json(reply)
})


module.exports={
    getAllAdmins,
    createNewAdmin,
    updateAdmin,
    deleteAdmin
}