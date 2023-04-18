const {db} = require('./firebase')
const firebase = require('firebase-admin');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
async function createUser(req, res){
     try {
          const userName = req.body.UserId;
          const newDoc = db.collection('my collection').doc(userName)
          if((await newDoc.get()).data()){
               return res.send({
                    error : "user name already taken"
               })
          }
          console.log("hi")
          const body = req.body;
          body['hash'] = await bcrypt.hash(req.body.password, 10);
          
          const newUser = await newDoc.set({
               'UserId' : userName,
               'password' : body.hash,
               'first': body.first,
               'middle': body.middle,
               'last': body.last,
               'born': body.born,
               'friends' : body.arr
          });
          req.isAuthenticated = true;
          console.log("hi")
          
          return res.status(201).send(newUser);
     } catch (err) {
          console.log(err);
          return res.status(500).send({
               error : "internal server error"
          })
     }
}


async function isAuthenticated(req, res, next){
     if(req.isAuthenticated){
          next()
     }
     else{
        return res.send({
          error : "unauthorized"
        })  
     }
}

async function login(req, res, next){
     try {
          console.log('here')
          const userName = req.body.userId
          const newDoc = (await db.collection('my collection').doc(userName).get()).data();
          console.log(newDoc)
          if(!newDoc){
               return res.send({
                    error : "User not found"
               });
          }
          const userRegistered = await bcrypt.compare(req.body.password, newDoc.password);
          console.log(userRegistered)
          if(userRegistered){
               const token = jwt.sign({
                    userId : newDoc.UserId,
               },
               process.env.SECRET_KEY_FACULTY,
               {
               expiresIn : "1h"
               })
               req.authenticated = true
               res.send({
                    status : "auth successful",
                    token : token
               });
               next();
          }
          
     } catch (error) {
          console.log(error)
          return res.send({
               error : "internal server error"
          })
     }
     
}



async function getUserDetails(req, res){
     try {
          const userName = req.params.userId;
          const user = await db.collection('my collection').doc(userName).get();
          if(!user.data()){
               return res.send({
                    error : "User not found"
               });
          }
          // console.log(user.data());
          return res.status(200).send(user.data());
     } catch (err) {
          return res.status(500).send({
               error : "internal server error"
          });
     }
}

async function deleteUserData(req, res){
     try {
          const userName = req.params.userId;
          const user = db.collection('my collection').doc(userName)
          if(!(await user.get()).data()){
               return res.status(404).send({
                    error : "user not found"
               })
          }
          const deletedUser = await user.delete();
          console.log(deletedUser)
          return res.status(200).send({
               status : "deletion successful"
          })
     } catch (error) {
          return res.status(500).send({
               error : "internal server error"
          });
     }
}

async function updateUserDetails(req, res){
     try {
          const userName = req.params.userId;
          const updateDetails = req.body
          // console.log(key)
          const user = db.collection('my collection').doc(userName);
          if(!(await user.get()).data()){
               return res.status(404).send({
                    error : "user not found"
               });
          }
          // const batch = db.batch();
          //  batch.update(user, updateDetails)
          const updatedData = await user.update({
               first : updateDetails["first"],
               middle : updateDetails["middle"],
               last : updateDetails["last"]
          });
          return res.status(202).send(updatedData)
     } catch (err) {
          return res.status(500).send({
               error : "internal server error"
          });
     }
}


async function getAllDocuments(req, res){
     try {
          const Docs = db.collection('my collection');
          const userDocs = await Docs.get();
          const data = {}
          // console.log(data)
          userDocs.forEach((doc) => {
               console.log(doc.id, doc.data())
               // data[(doc.id)]= doc.data()   
          });
          // return console.log(data)
          return res.status(200).send({"userDocs" :userDocs.docs})
     } catch (error) {
          return res.status(500).send({
               "error" : "internal server error"
          })
     }
}


async function updateDetails(req, res){
     try {
          const userName = req.params.userId;
          const updateDetails = req.body
          // console.log(key)
          const user = db.collection('my collection').doc(userName);
          if(!(await user.get()).data()){
               return res.status(404).send({
                    error : "user not found"
               });
          }
          const updatedData = await user.update(updateDetails);
          return res.status(202).send(updatedData) 
     }catch (error) {
          return res.status(500).send({
               error : "internal server error"
          })
     }
}

//--------------adds only one value-------------
async function updateFriends(req, res){
     try {
          const userName = req.params.userId;
          const updateDetails = req.body
          // console.log(key)
          const user = db.collection('my collection').doc(userName);
          if(!(await user.get()).data()){
               return res.status(404).send({
                    error : "user not found"
               });
          }
          const updatedData = await user.update({
               "friends" : firebase.firestore.FieldValue.arrayUnion(...updateDetails["friends"]),
             
          });
          return res.status(202).send(updatedData) 
     }catch (error) {
          return res.status(500).send({
               error : "internal server error"
          })
     }
}


async function mergeDetails(req, res){
     try {
          const userName = req.params.userId;
          const updateDetails = req.body
          // console.log(key)
          const user = db.collection('my collection').doc(userName);
          if(!(await user.get()).data()){
               return res.status(404).send({
                    error : "user not found"
               });
          }
          const updatedData = await user.set(updateDetails,{
               merge : true
          });
          return res.status(202).send(updatedData) 
     }catch (error) {
          return res.status(500).send({
               error : "internal server error"
          })
     }
}


async function filterUserByAge(req, res){
     try {
          
          const {age} = req.body
          const user = await db.collection('my collection').where("age", ">=", age).get();
          user.forEach((doc)=>{
               console.log(doc.id, doc.data())
          })   
          return res.status(202).send(user.docs) 
     }catch (error) {
          return res.status(500).send({
               error : "internal server error"
          })
     }
}


async function userWithCommonFriends(req, res){
     try {
          const {friends} = req.body
          const user = await db.collection('my collection').where("friends", "in", friends).get();
          user.forEach((doc)=>{
               console.log(doc.id, doc.data())
          })
          return res.status(202).send(user.docs) 
     }catch (error) {
          return res.status(500).send({
               error : "internal server error"
          })
     }
}


async function batchCommit(req, res){
     try {
          const userName = req.params.userId;
          const updateDetails = req.body
          // console.log(key)
          // console.log(updateDetails, [updateDetails])
          const user = db.collection('my collection').doc(userName);
          if(!(await user.get()).data()){
               return res.status(404).send({
                    error : "user not found"
               });
          }
          const batch = db.batch();
          Object.keys(updateDetails).forEach((key)=>{
               // console.log(key, updateDetails[key])
               batch.update(user, {
                    [key] : updateDetails[key]
               })
          })
          await batch.commit()
          res.status(200).send({
               "status" : "batched write successful" 
          })
     } catch (error) {
          return res.status(500).send({
               error : "internal server error"
          }) 
     }
}







module.exports = {
     createUser,
     getUserDetails,
     deleteUserData,
     updateUserDetails,
     getAllDocuments,
     updateDetails,
     updateFriends,
     mergeDetails,
     userWithCommonFriends,
     filterUserByAge,
     batchCommit,
     login,
     isAuthenticated,
};