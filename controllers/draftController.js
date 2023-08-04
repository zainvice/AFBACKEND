const Draft= require('../models/draft')
const User = require('../models/user')
const asycHandler= require('express-async-handler')
const Admin= require('../models/admin')
const multer = require('multer');
const Proposal = require('../models/proposal')
const sendEmail = require("../utils/email/sendEmail");

/* //For Uploading image blobs
    const upload = multer({
        limits: {
          fileSize: 5 * 1024 * 1024, // 5 MB limit for each image
        },
        fileFilter(req, file, cb) {
          if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'));
          }
          cb(null, true);
        },
      }).single('backgroundImage'); 
      
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: 'Image upload error: ' + err.message });
        } else if (err) {
          return res.status(400).json({ message: 'Unexpected error during image upload' });
        }
    
        // Image is successfully uploaded
        if(req.body.introductionData.backgroundImage){
        const backgroundImage = {
          data: req.body.introductionData.backgroundImage.buffer,
          contentType: req.body.introductionData.backgroundImage.mimetype,
        };
        introductionData.backgroundImage = backgroundImage;
        }
    
        // ... (existing code)
    
        // Add image to proposalObject
       
    
        // ... (other code)
    }); */

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
        const {proposalId, coverData, introductionData, proposalData, planofactionData , investmentData, aboutusData, contactsData, reviewsData, corporateVideoData, impressionData, closingData,  sender_email, clients_name, clients_email, clients_phone, clients_GST}= req.body
        console.log(req.body)

        if(coverData){
            console.log(coverData)
        }
        if(introductionData){
            console.log(introductionData)
        }
        if(!proposalId){
            return res.status(400).json({meesage: 'ID is required!'})
        }

        //Check for duplicates
        

        const duplicates = await Draft.findOne({proposalId}).lean().exec()

        if(duplicates){
            console.log('Duplicate found!')
            updatedraft(req, res)
        }
        let foundAdmin

        if(sender_email){
            const email = sender_email
            foundAdmin= await Admin.findOne({email}).lean().exec()
        }
        

        const sender = sender_email
        const _id = proposalId
        // Create a store newdraft

        const newDraft = await Draft.create({ proposalId, clients_name, clients_email, clients_GST, clients_phone, sender});

        const email = clients_email
        const foundUser= await User.findOne({email}).lean().exec()
        if(!foundUser){
            const fullName = clients_name
            const email= clients_email
            const GST = clients_GST
            const phone = clients_phone
            const newUser = await User.create({fullName, email, GST, phone})
            if(newUser){
                console.log("New User created!")
            }
        }
        
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
    const {proposalId, coverData, introductionData, proposalData, planofactionData , investmentData, aboutusData, contactsData, reviewsData, corporateVideoData, impressionData, closingData,  sender_email, clients_name, clients_email, clients_phone, clients_GST, sendProp}= req.body

    //Confirm Data
    if(!proposalId){
        return res.status(400).json({meesage: 'ID is required!'})
    }
    const draft = await Draft.findOne({proposalId}).lean().exec()
    if(!draft){
        return res.status(400).json({message: 'Draft not found!'})
    }
    

    //Check for existance
    if(clients_name){
        draft.clients_name = clients_name
    }
    if(clients_email){
        draft.clients_email = clients_email
    }
    if(clients_GST){
        draft.clients_GST = clients_GST
    }
    if(clients_phone){
        draft.clients_phone = clients_phone
    }
    if(coverData){
        console.log(coverData)
        draft.coverData= coverData
        console.log('Cover Changed')
    }
    if(introductionData){
        draft.introductionData= introductionData
    }
    if(proposalData){
        draft.proposalData= proposalData
    }
    if(investmentData){
        draft.investmentData= investmentData
    }
    if(planofactionData){
        draft.planofactionData= planofactionData
    }
    if(aboutusData){
        draft.aboutusData= aboutusData
    }
    if(contactsData){
        draft.contactsData= contactsData
    }
    if(reviewsData){
        draft.reviewsData= reviewsData
    }
    if(corporateVideoData){
        draft.corporateVideoData= corporateVideoData
    }
    if(impressionData){
        draft.impressionData= impressionData
    }
    if(closingData){
        draft.closingData= closingData
    }   
    const updateddraft= await Draft.findByIdAndUpdate(draft._id, draft)
    console.log('Successfully Updated')
    if(sendProp){
        
    
        //Confirm data 
        if (!updateddraft.clients_name|| !updateddraft.clients_email|| !updateddraft.clients_phone|| !updateddraft.clients_GST){
                return res.status(400).json({message: 'Fill all required fields!'})

        }

        //Check for duplicates
        
        /*const duplicates = await Proposal.findOne({summary}).lean().exec()

        if(duplicates){
            return res.status(409).json({message: 'Proposal already exits!'})
            //console.log('DUP')
        }*/
        let foundAdmin
        let foundUser
        let sender= 'NONE'
        let reciever= 'NONE'
        if(updateddraft.sender){
            const email = updateddraft.sender
            foundAdmin= await Admin.findOne({email}).lean().exec()
            if(foundAdmin){
                sender= foundAdmin.email
            }
        }
        if(updateddraft.clients_email){
            const email = updateddraft.clients_email
            foundUser= await User.findOne({email}).lean().exec()
            if(foundUser){
                reciever= foundUser.email
            }
        }
        
        
          // ... (existing code)
        
          // Add images to proposalObject
        const clients_name= updateddraft.clients_name  
        const clients_email= updateddraft.clients_email
        const clients_phone= updateddraft.clients_phone
        const clients_GST= updateddraft.clients_GST
        const proposalId= updateddraft.proposalId
        const coverData= updateddraft.coverData
        const introductionData= updateddraft.introductionData
        const proposalData= updateddraft.proposalData
        const planofactionData= updateddraft.planofactionData
        const investmentData= updateddraft.investmentData
        const aboutusData = updateddraft.aboutusData;
        const contactsData = updateddraft.contactsData;
        const reviewsData = updateddraft.reviewsData;
        const corporateVideoData = updateddraft.corporateVideoData;
        const impressionData = updateddraft.impressionData;
        const closingData = updateddraft.closingData;


        //Check for Duplicates

        const duplicate = await Proposal.findOne({proposalId}).exec()
        if(duplicate){
            console.log("Proposal has already been sent!")
            return res.status(400)
        }


        const proposalObject ={ clients_name, clients_email, clients_phone, clients_GST, proposalId, coverData, introductionData, proposalData, planofactionData , investmentData, aboutusData, contactsData, reviewsData, corporateVideoData, impressionData, closingData}

        // Create a store newproposal

        const newProposal = await Proposal.create({clients_name, clients_email, clients_phone, clients_GST, proposalId, coverData, introductionData, proposalData, planofactionData , investmentData, aboutusData, contactsData, reviewsData, corporateVideoData, impressionData, closingData, sender, reciever});

        
        if(newProposal){
            if(foundAdmin){
                foundAdmin.proposals.push(newProposal)
                const savedAdmin = await Admin.findByIdAndUpdate(foundAdmin._id, foundAdmin)
                if(savedAdmin){
                    console.log(`Proposal Added to ${foundAdmin.email} dash`)
                }
            }
            if(foundUser){
                foundUser.proposals.push(newProposal)
                const savedUser = await User.findByIdAndUpdate(foundUser._id, foundUser)
                if(savedUser){
                    console.log(`Proposal Added to ${foundUser.email} dash`)
                }
                sendEmail(
                    foundUser.email,
                    "New Proposal Recieved!",
                    {
                      name: foundUser.fullName,
                      
                    },
                    "./template/proposal.handlebars"
                  );
            }
            
            console.log("Proposal Created Successfullly")
            const result = await Draft.deleteOne(updateddraft._id)

            const reply = `Draft successfully deleted!`
            console.log(reply)
        } else{
            console.log("Proposal Haulted")
            
        }
    }
    if(updateddraft){
        return res.status(200).json({message: "Successfully Done"})
    }
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