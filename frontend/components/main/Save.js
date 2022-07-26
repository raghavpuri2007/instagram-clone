import React, { useState } from 'react'
import { View, TextInput, Image, StyleSheet, Button,Alert } from 'react-native'
import firebase from 'firebase/compat/app';
import {db, auth} from "../.././firebase.js"
import {serverTimestamp} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage"
require("firebase/compat/firestore")
require('firebase/compat/storage')

export default function Save(props) {
    const [caption, setCaption] = useState("");

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase.storage().ref().child(childPath).put(blob)
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
                Alert.alert("Success")
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }

    const savePostData = (downloadURL) => {
        db.collection('posts').doc(auth.currentUser.uid).collection("userPosts").add({
            downloadURL,
            caption,
            likesCount: 0,
            creation: serverTimestamp()
        }).then((function () {
            props.navigation.popToTop();
        })).catch(error => {
            console.log(error)
        })
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: props.route.params.image }} style={styles.image} />
            <TextInput placeholder='Write a Caption...' onChangeText={(caption) => setCaption(caption)} />
            <Button title='Send Post' onPress={() => uploadImage()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
    }
})
