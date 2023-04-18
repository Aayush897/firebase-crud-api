const express = require('express')
// const {db} = require('./firebase');
const { 
     createUser, 
     getUserDetails, 
     updateUserDetails, 
     deleteUserData,
     getAllDocuments,
     updateDetails,
     updateFriends,
     mergeDetails,
     userWithCommonFriends,
     filterUserByAge,
     batchCommit,
     login,
     // isAuthenticated,
} = require('./model');

const {isAuthenticated} = require('./middleware')

const router = express.Router()

router.post('/login',login) 



//--------------------------creating the user -------------------------

router.post('/createUser/', async(req, res)=>{
     return await createUser(req, res);   
})

//----------------------getting user details--------------------------

router.get('/getUser/:userId', isAuthenticated , async(req, res)=>{   
     return getUserDetails(req, res);
})

//---------------deleting the user by unique UserName---------------------

router.delete('/deleteUser/:userId', isAuthenticated, async (req, res)=>{
     return await deleteUserData(req, res);
})

//------------------updating the user name-------------------

router.post('/:userId/updateUser', isAuthenticated, async (req, res)=>{
     return await updateUserDetails(req, res);
})

//------------------getting all the documents from the collection--------------------

router.get('/allDocs', async(req, res)=>{
     return await getAllDocuments(req, res);
})

//------------------query snapshot------------------------------------------

// router.get('/collectionsQuerySnap', async(req, res)=>{
//      return await getQuerySnap(req, res);
// })

//----------------update the user-------------------------------------

router.post('/:userId/update', isAuthenticated, async(req, res)=>{
     return await updateDetails(req, res);
})

//----------------------updating friends------------------------

router.post('/:userId/updateFriends', isAuthenticated, async(req, res)=>{
     return await updateFriends(req, res);
})

//------------------merging additional info----------

router.post('/:userId/mergeDetails', isAuthenticated, async(req, res)=>{
     return await mergeDetails(req, res);
})

//------------------filtering using where----------

router.post('/filterUserByAge', async(req, res)=>{
     return await filterUserByAge(req, res);
})

//------------------fetching users with common friends----------

router.post('/userWithCommonFriends', async(req, res)=>{
     return await userWithCommonFriends(req, res);
})

//------------------trying to update in the batch----------

router.post('/:userId/batchCommit', async(req, res)=>{
     return await batchCommit(req, res);
})

//------------------login---------------------------




module.exports = router;