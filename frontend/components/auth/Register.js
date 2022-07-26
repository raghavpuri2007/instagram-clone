import React, { Component } from 'react'
import { View, Button, TextInput } from "react-native";
import { auth, db } from '../../firebase';
class RegisterScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        const { email, password, name } = this.state;
        auth.createUserWithEmailAndPassword(email, password).then((result) => {
            db.collection("users").doc(auth.currentUser.uid).set({
                name, email
            })
            console.log(result);
        }).catch((result) => {
            console.log(result)
        })
    }

    render() {
        return (
            <View>
                <TextInput placeholder='Name' onChangeText={(name) => this.setState({ name })} />
                <TextInput placeholder='Email' onChangeText={(email) => this.setState({ email })} />
                <TextInput placeholder='Password' onChangeText={(password) => this.setState({ password })} secureTextEntry={true} />

                <Button onPress={() => { this.onSignUp() }} title="Sign Up" />
            </View>
        )
    }
}

export default RegisterScreen
