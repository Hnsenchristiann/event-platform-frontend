import firebase from '../firebase.js'
import { 
    doc, 
    query, 
    startAfter, 
    // endAt, 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    runTransaction, 
    arrayRemove, 
    arrayUnion, 
    increment,
    orderBy,
    limit
} from "firebase/firestore";  
import { validatePostData } from '@/_services/validators.js';
import utils from '../utils/index.js'

export default class{
    static async createPost(id, text, images = []){
        const userRef = doc(firebase.db, 'users', firebase.auth.currentUser.uid)
        const postRef = collection(firebase.db, 'events', id, 'posts')
        return await addDoc(postRef, {
            date: new Date(),
            user: userRef,
            status: 0,
            images,
            text: validatePostData(text), 
        })
    }

    static async getEvent(id, withPosts = false){
        const promises = []

        const eventRef = doc(firebase.db, 'events', id)
        const docResult = getDoc(eventRef)
        promises.push(docResult)

        if(withPosts){
            const postsRef = collection(firebase.db, 'events', id, 'posts')
            const postsDoc = getDocs(postsRef)
            promises.push(postsDoc)
        }

        return await Promise.allSettled(promises)
    }

    static async getEvents(limitParam = 10, startAfterParam = null){
        const eventRef = collection(firebase.db, 'events')
        let q;
        if(startAfterParam){
            q = query(eventRef, orderBy('name'), limit(limitParam), startAfter(startAfterParam))
        }else{
            q = query(eventRef, orderBy('name'), limit(limitParam))
        }
        const snap = await getDocs(q)
        const docs = Object.values(snap.docs)
        const events = []
        for(let i = 0; i < docs.length; i++){
            const data = docs[i].data()
            data.ref = docs[i].ref
            events.push(data)
        }
        return events
    }

    static async getEventsWithCoverDataUrl(limitParam = 10, startAfterParam = null, queries = []){
        const eventRef = collection(firebase.db, 'events')
        let q;
        if(startAfterParam){
            q = query(eventRef, orderBy('name'), limit(limitParam), startAfter(startAfterParam), ...queries)
        }else{
            q = query(eventRef, orderBy('name'), limit(limitParam), ...queries)
        }
        const snap = await getDocs(q)
        const docs = Object.values(snap.docs)
        const events = []
        const promises = []
        for(let i = 0; i < docs.length; i++){
            const data = docs[i].data()
            promises.push(utils.getDataUrlFromStorage(data.cover_picture).then((image) => {
                data.cover_picture = image
                data.doc = docs[i]
                events.push(data)
            }))
            // const blob = await getBlob(ref(firebase.storage, data.cover_picture));//getBlob(data.cover_picture)
            // const newProfilePicture = await new Promise((resolve, reject) => {
            //     var a = new FileReader();
            //     a.onload = function(e) {
            //         resolve(e.target.result);
            //     }
            //     a.onerror = function(e){
            //         reject(e);
            //     }
            //     a.readAsDataURL(blob);
            // })
            // data.cover_picture = newProfilePicture
        }
        await Promise.allSettled(promises)
        return events
    }

    static async toggleEventSubscribe(eventId){
        if(!firebase.auth.currentUser){
            return -1
        }
        const uidRef = doc(firebase.db, 'users/' + firebase.auth.currentUser.uid)
        const eventIdRef = doc(firebase.db, 'events/' + eventId)
        const pivotRef = doc(firebase.db, 'users_events_subscribers/' + eventId)

        try {
            const rt = runTransaction(firebase.db, async (t) => {
                const uDoc = t.get(uidRef)
                const eDoc = t.get(eventIdRef)
                const pDoc = t.get(pivotRef)

                const docs = await Promise.all([uDoc, eDoc, pDoc])

                docs.forEach((doc) => {
                    if (!doc.exists()) {
                        throw "Document does not exist!";
                    }
                })

                const userData = docs[0].data()
                const { cover_picture, name } = docs[1].data()

                const followingObj = userData.following.filter((fol) => {
                    return fol.parent.id == eventId && fol.parent_type == 'events'
                })
                if(followingObj.length > 0){
                    t.update(uidRef, {following: arrayRemove(followingObj[0])})
                    t.update(eventIdRef, {subscribers: increment(-1)})
                    t.update(pivotRef, {users: arrayRemove(uidRef)})
                }else{
                    t.update(uidRef, {following: arrayUnion({
                        parent: eventIdRef,
                        parent_type: 'events',
                        data: {
                            cover_picture,
                            name
                        }
                    })})
                    t.update(eventIdRef, {subscribers: increment(1)})
                    t.update(pivotRef, {users: arrayUnion(uidRef)})
                }
            });
            return rt
        } catch (e) {
            // This will be a "population is too big" error.
            console.error(e);
        }
    }
}