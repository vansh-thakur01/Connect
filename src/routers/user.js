const express = require("express");
const userRouther = express.Router();

const userAuth = require("../middleware/userAuth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/users")


userRouther.get("/user/requests/received", userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        console.log(loggedInUser._id);

        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId","firstName lastName").lean();

        res.json({
            message: "Data fetched successfully",
            data:connectionRequests
        })

    }catch(err){
        res.send("Error: " + err.message);
    }
})

userRouther.get("/user/connections", userAuth,async (req,res)=>{
    try{
        let loggedInUser = req.user._id;
        const USER_SAFE_DATA = "firstName lastName";

        const connectionRequest = await ConnectionRequest.find({
            $and:[
                {$or:[
                    {toUserId:loggedInUser},
                    {fromUserId:loggedInUser}
                ]},
                {status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

        const data = connectionRequest.map(obj=>{
            if(obj.fromUserId._id.equals(loggedInUser)) return obj.toUserId;
            else return obj.fromUserId; 
        })

        res.json({
            data
        })

    }catch(err){
        res.send("Error: " + err.message);
    }
})

userRouther.get("/feed", userAuth, async (req,res)=>{
    try{
        let page = (parseInt(req.query.page)) || 0;
        let limit = (parseInt(req.query.limit))|| 10;
        limit = limit > 50 ? 10 : limit;
        page = (page-1)*limit;

        const USER_SAFE_DATA = "firstName lastName";

        const loggedInUser = req.user;
        const haveMet = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);


        const haveMetIdsQuery = haveMet.map((obj)=>{
            if(obj.fromUserId.equals(loggedInUser._id)) return {_id:{$ne:obj.toUserId._id}};
            else return {_id:{$ne:obj.fromUserId._id}}
        })

        const newConnectionsId = await User.find({
            $and:[
                ...haveMetIdsQuery,
                {_id:{$ne:loggedInUser._id}}
            ]
        },{firstName:1,lastName:1}).skip(page).limit(limit).lean()

        res.json({
            message:"New connection found successfully",
            data:newConnectionsId
        });

    }catch(err){
        res.send("Error: " + err.message);
    }
})

module.exports = userRouther