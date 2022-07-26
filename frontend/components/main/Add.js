import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App({ navigation }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    useEffect(() => {
        (async () => {
            const { cameraStatus } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });


        if (!result.cancelled) {
            setImage(result.uri);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <Camera ref={ref => setCamera(ref)} style={styles.camera} type={type} ratio={"1:1"} />
            </View>
            <Button
                title="Flip"
                onPress={() => {
                    setType(type === CameraType.back ? CameraType.front : CameraType.back);
                }}>
            </Button>
            <Button title="Take Picture" onPress={() => takePicture()} />
            <Button title="Pick Image" onPress={() => pickImage()} />
            <Button title="Save" onPress={() => navigation.navigate("Save", { image: image })} />
            {image && <Image source={{ uri: image }} style={styles.picture} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        aspectRatio: 1,
    },
    buttonContainer: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    button: {},
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    picture: {
        flex: 1,
    }
})