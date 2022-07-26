import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, Button } from 'react-native'
import firebase from "firebase/compat/app"
import {db, auth} from "../../firebase.js"
require('firebase/firestore')
import { connect } from 'react-redux'

function Profile(props) {
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const { currentUser, posts, following} = props;
        if(props.route.params.uid === auth.currentUser.uid) {
            setUser(currentUser);
            setUserPosts(posts)
        } else {
            db.collection("users").doc(props.route.params.uid).get().then((snapshot) => {
                if (snapshot.exists) {
                    setUser(snapshot.data())
                } else {
                    console.log('Error in Profile JS');
                }
            })

            db.collection("posts").doc(props.route.params.uid).collection("userPosts").orderBy("creation", "asc").get().then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                setUserPosts(posts)
            })
        }
        if(props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }
    }, [props.route.params.uid, props.following])

    const follow = () => {
        db.collection("following").doc(auth.currentUser.uid).collection("userFollowing").doc(props.route.params.uid).set({});
        setFollowing(true);
    }

    const unfollow = () => {
        db.collection("following").doc(auth.currentUser.uid).collection("userFollowing").doc(props.route.params.uid).delete();
        setFollowing(false);
    }

    const logout = () => {
        auth.signOut();
    }

    if(user === null) {
        return <View />
    } 
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {props.route.params.uid !== auth.currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button 
                                title="Following"
                                onPress={() => unfollow()}
                            />
                        ) : (
                            <Button title="Follow" onPress={() => follow()}/>
                        )}
                    </View>
                ) : <Button title="Logout" onPress={() => logout()}/>}
            </View>
            <View style={styles.containerGallery}>
                <FlatList style={styles.containerImage} numColumns={3} horizontal={false} data={userPosts} renderItem={({item}) => (
                    <Image style={styles.post} source={{uri: item.downloadURL}} />
                )}/>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        alignItems: 'center'
    },
    containerInfo: {
        margin: 20
    },
    post: {
        width: '33%',
        height: '33%',
        aspectRatio: 1 / 1,
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3
    }

})

const mapStateProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateProps, null)(Profile)