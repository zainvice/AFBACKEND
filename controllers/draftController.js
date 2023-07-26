const Draft= require('../models/draft')
const User = require('../models/user')
const asycHandler= require('express-async-handler')
const Admin= require('../models/admin')
// @des GET ALL USERS
// @route GET /users
// @access Private

const getAlldrafts = asycHandler(async (req, res) =>{
        const drafts = await Draft.find().select().lean()
        if(!drafts?.length){
            return res.status(400).json({message: 'No drafts found!'})
        }
        res.json(drafts)
})
// @des CREATE NEW USER
// @route POST /users
// @access Private

const createNewdraft = asycHandler(async (req, res) =>{
        let{topic, summary, clients_name, clients_email, clients_phone, clients_GST, sender_email}= req.body
        
        if(!topic){
            topic= ""
        }
        if(!summary){
            summary= ""
        }
        if(!clients_email){
            clients_email= ""
        }
        if(!clients_name){
            clients_name= ""
        }
        if(!clients_phone){
            clients_phone= ""
        }
        if(!clients_GST){
            clients_GST= ""
        }
        //Confirm data 
        if (!sender_email){
                return res.status(400).json({message: 'Email required fields!'})

        }

        //Check for duplicates
        
        /*const duplicates = await Draft.findOne({summary}).lean().exec()

        if(duplicates){
            return res.status(409).json({message: 'Draft already exits!'})
            //console.log('DUP')
        }*/
        let foundAdmin
        let foundUser
        if(sender_email){
            const email = sender_email
            foundAdmin= await Admin.findOne({email}).lean().exec()
        }
        
       

        const draftObject ={ topic, summary, clients_name, clients_email, clients_phone, clients_GST}

        // Create a store newdraft

        const newDraft = await Draft.create({ topic, summary, clients_name, clients_email, clients_phone, clients_GST});

        
        if(newDraft){
            if(foundAdmin){
                foundAdmin.drafts.push(newDraft)
                const savedAdmin = await Admin.findByIdAndUpdate(foundAdmin._id, foundAdmin)
                if(savedAdmin){
                    console.log('Draft added to Admins Dash')
                }
            }
            
            res.status(201).json({message: `Draft is now sent!`})
            console.log("Successful")
        } else{
            res.status(400).json({message: 'Invaild Data used'})
            
        }
       
})

// @des Update USER
// @route Patch /users
// @access Private

const updatedraft = asycHandler(async (req, res) =>{
    const{topic, summary, clients_name, clients_email, clients_phone, clients_GST}= req.body

    //Confirm Data
    if(!clients_name){
        return res.status(400).json({meesage: 'Price is required!'})
    }
    const draft = await Draft.findOne({clients_email, clients_name}).lean().exec()
    if(!draft){
        return res.status(400).json({message: 'draft not found!'})
    }
    //Check for duplicates

    const duplicates= await Draft.findOne({topic, clients_name}).lean().exec()

    //Allow updates to the original user
    //if (duplicates && duplicates._id.toString() !== draft._id){
    //        return res.status(409).json({message: 'Duplicate Draft'})
    //}

    draft.topic = topic
    draft.summary = summary
    draft.clients_name = clients_name
    draft.clients_email = clients_email
    draft.clients_phone= clients_phone, 
    draft.clients_GST= clients_GST
    
    
    const updateddraft= await Draft.findByIdAndUpdate(draft._id, draft)

    res.json({message: `${updateddraft.summary} updated!`})
})

// @des delete USER
// @route delete /users
// @access Private

const deletedraft = asycHandler(async (req, res) =>{
    const {_id}= req.body
    console.log(_id)
    if(!_id){
        return res.status(400).json({message: 'DraftID required'})

    }

    

    //if(notes?.length){
    //    return res.status(400).json({message: 'DRAFT HAS USERS'})
    //}
    const draft = await Draft.findById(_id).exec()

    console.log(draft)

    if(!draft){
        return res.status(404).json({message: 'Draft not found'})

    }
    const result = await Draft.deleteOne(draft._id)

    const reply = `Draft ${draft.topic} successfully deleted!`

    res.json(reply)
})


module.exports={
    getAlldrafts,
    createNewdraft,
    updatedraft,
    deletedraft
}