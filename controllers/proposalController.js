const Proposal= require('../models/proposal')
const User = require('../models/user')
const asycHandler= require('express-async-handler')
const Admin = require('../models/admin')
const sendEmail = require("../utils/email/sendEmail");
const multer = require('multer');
// @des GET ALL USERS
// @route GET /users
// @access Private

const getAllproposals = asycHandler(async (req, res) =>{
        const proposals = await Proposal.find().select().lean()
        if(!proposals?.length){
            return res.status(400).json({message: 'No proposals found!'})
        }
        res.json(proposals)
})
// @des CREATE NEW USER
// @route POST /users
// @access Private

const createNewproposal = asycHandler(async (req, res) =>{
        const {proposalId, coverData, introductionData, proposalData, planofactionData , investmentData, aboutusData, contactsData, reviewsData, corporateVideoData, impressionData, closingData,  sender_email, clients_name, clients_email, clients_phone, clients_GST, sendProp}= req.body
    
        //Confirm data 
        if (!clients_name|| !clients_email|| !clients_phone|| !clients_GST){
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
        if(sender_email){
            const email = sender_email
            foundAdmin= await Admin.findOne({email}).lean().exec()
            if(foundAdmin){
                sender= foundAdmin.email
            }
        }
        if(clients_email){
            const email = clients_email
            foundUser= await User.findOne({email}).lean().exec()
            if(foundUser){
                reciever= foundUser.email
            }
        }
        
        
          // ... (existing code)
        
          // Add images to proposalObject
          

        const proposalObject ={ clients_name, clients_email, clients_phone, clients_GST, proposalId, coverData, introductionData, proposalData, planofactionData , investmentData, aboutusData, contactsData, reviewsData, corporateVideoData, impressionData, closingData}

        // Create a store newproposal

        const newProposal = await Proposal.create({proposalObject});

        
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
            res.status(201).json({message: `Proposal is now sent!`})
            console.log("Successful")
        } else{
            res.status(400).json({message: 'Invaild Data used'})
            
        }
       
})

// @des Update USER
// @route Patch /users
// @access Private

const updateproposal = asycHandler(async (req, res) =>{
    const{proposalId, status, acceptData, questionData}= req.body

    //Confirm Data
    if(!proposalId){
        console.log('ID NOT FOUND')
        return res.status(400).json({meesage: 'ID required!'})
    }
    const proposal = await Proposal.findOne({proposalId}).exec()
    if(!proposal){
        console.log('PROPO NOT FOUND!')
        return res.status(400).json({message: 'Proposal not found!'})
    }
    //Check for duplicates
    
    //const duplicates= await Proposal.findOne({topic, clients_name}).lean().exec()

    //Allow updates to the original user
    //if (duplicates && duplicates.proposalId.toString() !== proposal._id){
    //        return res.status(409).json({message: 'Duplicate Proposal'})
    //}
    let foundAdmin
    if(proposal.sender){
        const email = proposal.sender
        foundAdmin= await Admin.findOne({email}).lean().exec()
    
    }
    proposal.status= status
    if(acceptData){
        proposal.acceptData = acceptData
        //Woho!! Proposal is accepted!
        if(foundAdmin){
            sendEmail(
                foundAdmin.email,
                "Woho!! Proposal is accepted!",
                {
                  name: foundAdmin.fullName,
                  proposalName: proposal.coverData.proposalTitle,
                  clientName: proposal.clients_name,
                  date: acceptData.date,
                  
                },
                "./template/proposal.handlebars"
              );
        }
    }
    if(questionData){
        proposal.questionData = questionData
        if(foundAdmin){
            sendEmail(
                foundAdmin.email,
                "You had a sales query to be addressed!",
                {
                  name: foundAdmin.fullName,
                  proposalName: proposal.coverData.proposalTitle,
                  clientName: proposal.clients_name,
                  question: questionData.question,
                  
                },
                "./template/proposalQuestion.handlebars"
              );
        }
    }
    
    const updatedproposal= await Proposal.findByIdAndUpdate(proposal._id, proposal)
    if(updatedproposal){
        res.status(200)
       
    }

    
    console.log('Updated')
    return res.json({message: `Updated!`})
})

// @des delete USER
// @route delete /users
// @access Private

const deleteproposal = asycHandler(async (req, res) =>{
    const {_id}= req.body
    if(_id){
        return res.status(400).json({message: 'ProposalID required'})

    }

    

    //if(notes?.length){
    //    return res.status(400).json({message: 'PROPOSAL HAS USERS'})
    //}
    const proposal = await Proposal.findOne({summary, clients_name}).lean().exec()

    if(!proposal){
        return res.status(400).json({message: 'Proposal not found'})

    }
    const result = await Proposal.deleteOne(proposal._id)

    const reply = `Proposal ${proposal.topic} successfully deleted!`

    res.json(reply)
})


module.exports={
    getAllproposals,
    createNewproposal,
    updateproposal,
    deleteproposal
}