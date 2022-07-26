import React, { Component } from 'react'
import { View, Button, TextInput } from "react-native";
import { auth } from '../../firebase';
class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.onSignIn = this.onSignIn.bind(this);
    }

    onSignIn() {
        const { email, password } = this.state;
        auth.signInWithEmailAndPassword(email, password).then((result) => {
            console.log(result);
        }).catch((result) => {
            console.log(result)
        })
    }

    render() {
        return (
            <View>
                <TextInput placeholder='Email' onChangeText={(email) => this.setState({ email })} />
                <TextInput placeholder='Password' onChangeText={(password) => this.setState({ password })} secureTextEntry={true} />

                <Button onPress={() => { this.onSignIn() }} title="Sign In" />
            </View>
        )
    }
}

export default LoginScreen
