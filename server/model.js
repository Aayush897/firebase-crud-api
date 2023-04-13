const {db} = require('./firebase')

async function createUser(req, res){
    try {
        const userName = req.params.userId;
        const newDoc = db.collection('my collection').doc(userName)
        if((await newDoc.get()).data()){
             return res.send({
                  error : "user name already taken"
             })
        }
        const {first, middle, last, born, arr} = req.body;
        const newUser = await newDoc.set({
             'UserId' : userName,
             'first': first,
             'middle': middle,
             'last': last,
             'born': born,
             'friends' : arr
        });
        return res.status(201).send(newUser);
   } catch (err) {
        return res.status(500).send({
             error : err
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
             error : err
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
             error : err
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
             error : err
        });
   }
}





module.exports = {
    createUser,
    getUserDetails,
    deleteUserData,
    updateUserDetails,
};