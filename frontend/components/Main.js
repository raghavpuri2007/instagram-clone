import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Foundation from "react-native-vector-icons/Foundation"
import Feather from "react-native-vector-icons/Feather"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../redux/actions'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import SearchScreen from './main/Search'
import ProfileScreen from './main/Profile'
import FeedScreen from './main/Feed'

import firebase from "firebase/compat/app"

const EmptyScreen = () => {
    return (null);
}

const Tab = createMaterialBottomTabNavigator();

export class MainScreen extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
        this.props.clearData();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName='Feed' labeled={false}>
                <Tab.Screen name="Feed" component={FeedScreen} options={{
                    tabBarIcon: ({ color, size }) => (
                        <Foundation name="home" color={color} size={26} />
                    )
                }} />
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="search" color={color} size={26} />
                    )
                }} />
                <Tab.Screen name="Add" component={EmptyScreen} listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Add ")
                    }
                })} options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="plus-square" color={color} size={26} />
                    ),
                }} />
                <Tab.Screen name="Profile" component={ProfileScreen} listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                    }
                })} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-circle-outline" color={color} size={26} />
                    ),
                }} />
            </Tab.Navigator>
        )
    }
}


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center'
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(MainScreen)