import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
// import { response } from 'express';
import axios from 'axios';
import { resolve } from 'q';

const POSTS = 'posts'
const PORTFOLIOS = 'portfolios'
const LOG = 'log'
const MEMBER = 'member'
const COMMENT = 'comment'
const PUSHTOKENS = 'pushtokens'

// Setup Firebase
const config = {
    apiKey: "AIzaSyBs4D2Hk5MCukzUl_EMiGjsdbx73fMVZic",
    authDomain: "ssafy-webmobile-a85da.firebaseapp.com",
    databaseURL: "https://ssafy-webmobile-a85da.firebaseio.com",
    projectId: "ssafy-webmobile-a85da",
    storageBucket: "",
    messagingSenderId: "852847351085",
    appId: "1:852847351085:web:5305fca2ec797a28"
}

firebase.initializeApp(config)

const firestore = firebase.firestore()

// var admin = require("firebase-admin");
// var serviceAccount = require("./ssafy-webmobile-a85da-d38c54a65222.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://ssafy-webmobile-a85da.firebaseio.com"
// });

firestore.enablePersistence({ experimentalTabSynchronization: true })

Notification.requestPermission().then((permission)=> {
    if (permission === 'granted') {
      if(window.localStorage.getItem('sentToServer') != '1'){
        messaging.getToken().then((currentToken) => {
            firestore.collection(PUSHTOKENS).add({
                currentToken
            });
            window.localStorage.setItem('sentToServer', '1')
          }).catch((err) => {
              console.log('An error occurred while saving token. ', err);
          });
      }
    }else{
      messaging.getToken().then((currentToken) => {
        messaging.deleteToken(currentToken).then(() => {
          window.localStorage.setItem('sentToServer', '0')
          firestore.collection(PUSHTOKENS).doc().delete()
        }).catch((err) => {
          console.log('Unable to delete token. ', err);
        });
      }).catch((err) => {
        console.log('Error retrieving Instance ID token. ', err);
      });
    }
  });

const messaging = firebase.messaging();
messaging.usePublicVapidKey('BPlpmfy0xxc0C8SfW6Gmjada81ud9yZMagx7-jVZ_9UDMwyW146b39ohLYPFd7DtMEcAEhKs1cCkvdMQU39hcwM');
messaging.onMessage((payload) => {
    new Notification(payload.notification.title + '\n' + payload.notification.body);
});	

export default {
    getPosts() {
        const postsCollection = firestore.collection(POSTS)
        return postsCollection
            .orderBy('created_at', 'desc')
            .get()
            .then((docSnapshots) => {
                return docSnapshots.docs.map((doc) => {
                    let data = doc.data()
                    data.created_at = new Date(data.created_at.toDate())
                    data.id = doc.id
                    return data
                })
            })
    },
    postPost(title, body) {
        return firestore.collection(POSTS).add({
            title,
            body,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        })
    },
    updatePost(ptitle,pbody,pid){
        var data = {
            title: ptitle,
            body: pbody,
        };

        var setDoc = firestore.collection(POSTS).doc(pid).update(data);
    },
    deletePost(uid) {
        var deletDoc = firestore.collection(POSTS).doc(uid).delete();
        return deletDoc;
    },
    getPortfolios() {
        const postsCollection = firestore.collection(PORTFOLIOS)
        return postsCollection
            .orderBy('created_at', 'desc')
            .get()
            .then((docSnapshots) => {
                return docSnapshots.docs.map((doc) => {
                    let data = doc.data()
                    data.created_at = new Date(data.created_at.toDate())
                    data.id = doc.id
                    return data
                })
            })
    },
    postPortfolio(title, body, img) {
        return firestore.collection(PORTFOLIOS).add({
            title,
            body,
            img,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        })
    },
    loginWithGoogle() {
        let provider = new firebase.auth.GoogleAuthProvider()
        return firebase.auth().signInWithPopup(provider).then(function(result) {
            let accessToken = result.credential.accessToken
            let user = result.user
            return result
        }).catch(function(error) {
            console.error('[Google Login Error]', error)
        })
    },
    getUserInfo() {
        const user = firebase.auth().currentUser;
        return user;
    },
    getOneUserInfo(email) {
        const usersCollection = firestore.collection(MEMBER).where('email', '==', email)
        return usersCollection
            .get()
            .then((docSnapshots) => {
                return docSnapshots.docs.map((doc) => {
                    // console.log("doc" + doc.id)

                    // console.log(doc.data())
                    let data = doc.data()
                    data.id = doc.id
                        // return doc.data()
                    return data
                })
            })

    },
    getAllUserInfo() {
        const usersCollection = firestore.collection(MEMBER)
        return usersCollection
            .orderBy('auth')
            .get()
            .then((docSnapshots) => {
                return docSnapshots.docs.map((doc) => {
                    // console.log("doc" + doc.id)
                    // console.log(doc.data())
                    let data = doc.data()
                    data.id = doc.id
                        // return doc.data()
                    return data
                })
            })

    },
    getPushTokens() {
        const pushTokens = firestore.collection(PUSHTOKENS)
        return pushTokens
            .get()
            .then((docSnapshots) => {
                return docSnapshots.docs.map((doc) => {
                    let data = doc.data()
                    data.id = doc.id
                    return data
                })
            })

    },
    updateUserInfo(id, updateauth) {
        var info = firestore.collection(MEMBER).doc(id);
        info.update({ auth: updateauth })
    },
    setUserInfo(uid, auth, email) {
        return firestore.collection(MEMBER).add({
            uid,
            auth,
            email
        })
    },
    postImage(link) {
        const user = firebase.auth().currentUser;
        user.updateProfile({
            photoURL: link
        })
    },
    writeLog(to, email, time) {
        return firestore.collection(LOG).add({
            to,
            email,
            time
        })
    },
    updatePort(utitle, ubody, uimg, uid) {
        var data = {
            title: utitle,
            body: ubody,
            img: uimg
        };

        var setDoc = firestore.collection(PORTFOLIOS).doc(uid).update(data);
    },
    deletePort(uid) {
        var deletDoc = firestore.collection(PORTFOLIOS).doc(uid).delete();
        return deletDoc;
    },
    postcomment(uid ,아이디, 내용){
        return firestore.collection(PORTFOLIOS).doc(uid).collection(COMMENT).add({
            아이디,
            내용,
            글쓴날: firebase.firestore.FieldValue.serverTimestamp()
        })
    },
    getcomment(uid){
        const commentsCollection = firestore.collection(PORTFOLIOS).doc(uid).collection(COMMENT)
        return commentsCollection
            .orderBy('글쓴날', 'asc')
            .get()
            .then((docSnapshots) => {
                return docSnapshots.docs.map((doc) => {
                    let data = doc.data()
                    data.글쓴날 = new Date(data.글쓴날.toDate())
                    data.글쓴날 = data.글쓴날.getFullYear()+'년'+data.글쓴날.getMonth()+'월'+data.글쓴날.getDate()+'일'+' '+data.글쓴날.getHours()+':'+data.글쓴날.getMinutes()
                    data.id = doc.id
                    return data
                })
            })
    },
    updatecomment(uid,cid,cbody){
        var data = {
            내용 : cbody
        };
        var setDoc = firestore.collection(PORTFOLIOS).doc(uid).collection(COMMENT).doc(cid).update(data);
    },
    deleteComment(uid,cid){
        var deletDoc = firestore.collection(PORTFOLIOS).doc(uid).collection(COMMENT).doc(cid).delete();
        return deletDoc;
    },
    pushAlarm(token, title, body){
        return new Promise((resolve, reject) => {
            axios.post('https://fcm.googleapis.com/fcm/send', {
                    "to" : token,
                    "notification" : {
                        "title" : title,
                        "body" : body,
                    },
                }, {
                        headers : {
                            "Content-Type": 'application/json',
                            "Authorization": 'key=AAAAxpGp1S0:APA91bFaV3Hnnhc-BFQu8e4heSNb8k3EO6fmFy0qbYAzly4ukn3uM5rPtOpiAhdlDATQeJ2oOqvAYJBSVIOFDvX2BPAI-CBqTkJbmLkyPtMgHwDXGWDeDUoFMcgesDgOnw5osJw4Hhlr'
                        }
                    }
                )
                .then(response => {
                    console.log(response)
                    resolve(response)
                })
                .catch(err => {
                    console.log(err)
                })
        })
    },
}