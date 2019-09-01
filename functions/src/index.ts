import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
const corsHandler = cors({origin: true});

admin.initializeApp(functions.config().firebase);

const sendNotification = (owner_uid, type) => {
    
    return new Promise((resolve, reject) => {
        admin.firestore().collection("users").doc(owner_uid).get().then((doc)=> {
            if(doc.exists && doc.data().token){
                if(type === "new_comment"){
                    admin.messaging().sendToDevice(doc.data().token, {
                        data: {
                            title: "A new commment has ben made on your post.",
                            sound: "default",
                            body: "Tap to Check"
                        }
                    }).then(sent => {
                        resolve(sent)
                    }).catch(err => {
                        reject(err)
                    });
                } else if(type === "new_like"){
                    admin.messaging().sendToDevice(doc.data().token, {
                        data: {
                            title: "Someone liked your post on Feedly",
                            sound: "default",
                            body: "Tap to Check"
                        }
                    }).then(sent => {
                        resolve(sent)
                    }).catch(err => {
                        reject(err)
                    });
                }
            }
        })
    })
}

export const updateLikesCount = functions.https.onRequest((request, response) => {
    corsHandler(request, response, () => {
        const postId = request.body.postId;
        const userId = request.body.userId;
        const action = request.body.action;
        
        admin.firestore().collection("posts").doc(postId).get()
            .then((data) => {
                let likesCount = data.data().likesCount || 0;
                const updateData = {};
                if(action === "like") {
                    updateData["likesCount"] = ++likesCount;
                    updateData[`likes.${userId}`] = true;
                } else {
                    updateData["likesCount"] = --likesCount;
                    updateData[`likes.${userId}`] = false;
                }
                admin.firestore().collection("posts").doc(postId).update(updateData)
                    .then(() => {
                        // if(action === "like"){
                        //     sendNotification(data.data().owner, "new_like");
                        // }
                        response.status(200).send("Done");
                    }).catch((err) => {
                        response.status(err.code).send(err.message);
                    })
            }).catch((err) => {
                response.status(err.code).send(err.message);
            })
    });
})
export const updateCommentsCount = functions.firestore.document('comments/{commentId}').onCreate(async (event) => {
    const data = event.data();
    const postId = data.post;
    const doc = await admin.firestore().collection("posts").doc(postId).get();
    if(doc.exists){
        let commentsCount = doc.data().commentsCount || 0;
        commentsCount++;
        await admin.firestore().collection("posts").doc(postId).update({
            "commentsCount": commentsCount
        })
        return true;
        // return  sendNotification(doc.data().owner, "new_comment");
    }else{
        return false;
    }
})
