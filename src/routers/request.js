const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/users");
const mongoose = require("mongoose");   


const userAuth = require("../middleware/userAuth");

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: " + status});
        }

        if(!mongoose.Types.ObjectId.isValid(toUserId)) return res.status(400).json({message:"Invalid User Id format"})


        const toUser = await User.findOne({_id:toUserId});
        if(!toUser) res.status(404).json({message:"User not Found"});



        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(existingConnectionRequest) return res.status(400).json({message:"Connection Request Already Exist"});

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();
        return res.json({
            message:"Connection Request Sent Successfully",
            data
        })
    }catch(err){
        res.status(404).send("Error: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res)=>{
    try{
        let loggedInUser = req.user;
        let {status, requestId} = req.params;
        
        let allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)) return res.status(400).json({message:"Status is not valid"});
        if(!mongoose.Types.ObjectId.isValid(requestId)) return res.status(400).json({message:"RequestedId format is invalid"});
        const connectionRequest = await ConnectionRequest.findOne({_id:requestId,toUserId:loggedInUser,status:"interested"});
        if(!connectionRequest){
            return res.status(400).json({message:"Connection request not found"});
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({message:"Connection request" + status, data});

    }catch(err){
        res.status(400).send("Error: ", + err.message);
    }
})

module.exports = requestRouter;