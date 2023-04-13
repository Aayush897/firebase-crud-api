const express = require('express')
// const {db} = require('./firebase');
const { createUser, getUserDetails, updateUserDetails, deleteUserData } = require('./model');
const router = express.Router()

//--------------------------creating the user -------------------------

router.post('/createUser/:userId', async(req, res)=>{
     return await createUser(req, res);   
})

//----------------------getting user details--------------------------

router.get('/getUser/:userId', async(req, res)=>{   
     return getUserDetails(req, res);
})

//---------------deleting the user by unique UserName---------------------

router.delete('/deleteUser/:userId', async (req, res)=>{
     return await deleteUserData(req, res);
})

//------------------updating the user name-------------------

router.post('/:userId/updateUser', async (req, res)=>{
     return await updateUserDetails(req, res);
})


module.exports = router;