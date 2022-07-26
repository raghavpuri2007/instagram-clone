import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, FlatList, Button } from 'react-native'
import firebase from "firebase/compat/app"
import {db, auth} from "../../firebase.js"
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([])
    const [currentUserLike, setCurrentUserLike] = useState(false)
    useEffect(() => {
        if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            

            props.feed.sort(function(x, y) {
                return x.creation - y.creation;
            })

            setPosts(props.feed);
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        db.collection("posts").doc(userId).collection("userPosts").doc(postId).collection("likes").doc(auth.currentUser.uid).set({})
        setCurrentUserLike(true)
    }
    const onDislikePress = (userId, postId) => {
        db.collection("posts").doc(userId).collection("userPosts").doc(postId).collection("likes").doc(auth.currentUser.uid).delete()
        setCurrentUserLike(false);
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList style={styles.containerImage} numColumns={1} horizontal={false} data={posts} renderItem={({item}) => (
                    <View style={styles.postContainer}>
                        <Text style={styles.containerGallery}>{item.user.name}</Text>
                        <Image style={styles.post} source={{ uri: item.downloadURL }} />
                        { currentUserLike ? (
                            <Button title="Dislike" onPress={() => onDislikePress(item.user.uid, item.id)} />
                        ) : (<Button title="Like" onPress={() => onLikePress(item.user.uid, item.id) } /> )}
                        <Text onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid:  item.user.uid})}>View Comments...</Text>
                    </View>
                )} />
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
        flex: 1,
        width: '100%',
        height: '100%',
        aspectRatio: 3 / 2,
    },
    containerGallery: {
        flex: 1
    },
    postContainer: {
        paddingVertical: 50,
    }

})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})

export default connect(mapStateToProps, null)(Feed)