import React, { Component } from 'react';

import firebase from 'firebase/app';
import 'firebase/messaging';

import PNSwitch from './PNSwitch';
import TokenCard from './TokenCard';

import logo from './logo_gv.png';
import icon from './logo_gv.png';
import './App.css';

const denied = "denied"
const granted = "granted";

class App extends Component {

    constructor(props) {

        // the first, mandatory instruction of a constructor
        super(props);

        // prepare a flag determining whether the push notifications are supported
        var pushNotificationsSupported = undefined;

        // prepare the user opt choice about push notifications
        var userOpt = undefined;

        // prepare the Firebase Cloud Messaging (FCM) configuration TODO replace this
        var firebaseConfig = {
            /*apiKey: <YOUR_API_KEY>,
			authDomain: <YOUR_AUTH_DOMAIN>,
			databaseURL: <YOUR_DATABASE_URL>,
			projectId: <YOUR_PROJECT_ID>,
			storageBucket: <YOUR_STORAGE_BUCKET>,
			messagingSenderId: <YOUR_MESSAGING_SENDER_ID>*/
        };



        /*
            initializing the Firebase Cloud Messaging (FCM) client
        */

       console.log("Initializing the FCM client...");

       // initialize the Firebase component with the given settings
       firebase.initializeApp(firebaseConfig);
       
       // prepare the FCM component to use to receive push notifications
       var FCM = firebase.messaging();

       // prepare the FCM API token bean generated when the user opts in for the push notifications
       var firebaseToken = undefined;



        /*
            determining the user choice about push notifications
        */

        // determine whether the browser supports the push notifications
        pushNotificationsSupported = "Notification" in window;

        // if push notifications are not supported, then no further processing is needed
        if (!pushNotificationsSupported) {

            console.log("Push notifications are not supported by this browser");

            // prepare a state containing just the pushNotificationsSupported flag
            this.state = {

                pushNotificationsSupported: pushNotificationsSupported

            }

            // proceeed to the rendering of the front-end application
            return;

        }

        // then, determine whether the user already opted in or out for the push notifications
        var permission = Notification.permission;

        // define a pending flag to track the pending request of the Firebase API token
        var pending = false;

        // if the user explicitly opted out for the push notifications, then track this into the component state
        if (permission === denied) {
            
            console.log("User opted-out for the push notifications");

            userOpt = denied;

        }

        // otherwise, if the user explicitly opted out for the push notifications, then track this into
        // the component state
        else if (permission === granted) {

            console.log("User opted-in for the push notifications");

            userOpt = granted;

            pending = true;

            // retrieve the FCM API token
            FCM.getToken()

                // if the request operation was successful, retrieve the APi token (a promise to wait for)
                .then(function(token) {

                    console.log("FCM API token: ", token);

                    this.setState({

                        firebaseToken: {
                            token: token,
                            pending: false
                        }

                    });

                }.bind(this))

                // if any error occurred, then no valid FCM token is available
                .catch(function(err) {

                    console.log("Unable to retrieve the FCM API token to receive push notifications: ", err);

                    userOpt = undefined;
                    
                    firebaseToken = undefined;

                });

        }

        // otherwise, the user has not opted for the push notifications yet (and so set it to undefined)
        else {

            console.log("User has not already opted for the push notifications yet");

            userOpt = undefined;

        }



        /*
            initialize the component state
        */

        this.state = {

            pushNotificationsSupported: pushNotificationsSupported,
            userOpt: userOpt,
            firebaseConfig: firebaseConfig,
            firebaseToken: {
                token: firebaseToken,
                pending: pending
            },
            FCM: FCM

        }



        /*
            bind the component functions
        */

        this.userNotificationsOptChanged = this.userNotificationsOptChanged.bind(this);
        this.userNotificationsOptIn = this.userNotificationsOptIn.bind(this);
        this.userNotificationsOptOut = this.userNotificationsOptOut.bind(this);
        this.messageReceived = this.messageReceived.bind(this);
        this.refreshFCMToken = this.refreshFCMToken.bind(this);



        /*
            register the needed callbacks
        */

        FCM.onMessage(payload => this.messageReceived(payload));

        FCM.onTokenRefresh(() => this.refreshFCMToken(FCM));
        
    }

    // callback to catch FCM API token refresh (it has to be stored in the component state)
    refreshFCMToken(FCM) {

        // retrieve the FCM token
        FCM.getToken()

            // as soon as the token is available, store it in the component state 
            .then(function(token) {

                console.log("FCM retrieved token: ", token);

                // update the FCM token in the component state
                this.setState({

                    firebaseToken: token

                });

            }.bind(this))

            // if any error occurred, then no FCM token was deleted
            .catch(function(err) {
        
                console.log("Unable to update the FCM API token for push notifications: ", err);

                // erase the FCM API token from the component state 
                this.setState({
                    
                    firebaseToken: undefined

                });

            }.bind(this));

    }



    // callback to catch incoming push notifications in this component
    messageReceived(payload) {

        console.log("Notification received:\n", payload);

        // retrieve the userOpt state property
        const userOpt = this.state.userOpt;

        // determine whether the user explicitly opted-in for push notifications
        const isGranted = userOpt !== undefined && typeof(userOpt) === "string" && userOpt === granted;

        // if the user did not explicitly allowed push notifications, then do not display it
        if (!isGranted) {

            console.warn("User did not explicitly allow push notifications");

            return;

        }

        // parse the JSON content of the push notification
        var notificationBody = JSON.parse(payload.data.notification);

        // extract the notification title and body
        var title = notificationBody.title;
        var body = notificationBody.body;

        // prepare the push notification parameters
        var duration = 5000;
        var options = {
            body: body,
            icon: icon
        };

        // instantiate the notification object
        var notification = new Notification(title, options);

        // set the notification close timeout
        setTimeout(notification.close.bind(notification), duration);
        
    }

    // callback invoked by a child node to notify the App component about the user decision about push notifications
    userNotificationsOptChanged(value) {

        // if the passed value is true, then invoke the opt-in function
        if (typeof(value) === "boolean" && value === true) { this.userNotificationsOptIn(); return; }

        // if the passed value is false, then invoke the opt-out function
        if (typeof(value) === "boolean" && value === false) { this.userNotificationsOptOut(); return; }

    }

    // callback invoked by a child node to notify the App component that the user opted in for push notifications
    userNotificationsOptIn() {

        // if push notifications are not supported by this browser, then this is an error condition
        var pushNotificationsSupported = this.state.pushNotificationsSupported;

        if (pushNotificationsSupported === false) {

            console.error("This browser does not support push notifications");

            return;
            
        }

        // if the user has already opted in, then this is an error condition
        var userOpt = this.state.userOpt;

        if (userOpt === true) {

            console.error("User has already opted-in for push notifications");

            return;

        }

        // prepare the FCM API token generated when the user opts in for the push notifications
        var firebaseToken = undefined;

        // retrieve the FCM component from the App component state
        var FCM = this.state.FCM;

        // request the permission to receive push notifications through the FCM client
        FCM.requestPermission()

            // if the request operation was successful, retrieve the APi token (a promise to wait for)
            .then(function() {

                console.log("Push Notification permission granted");
        
                return FCM.getToken();
                
            })

            // as soon as the token is available, store it in the component state
            .then(function(token) {

                console.log("FCM generated token: ", token);

                firebaseToken = {
                    token: token,
                    pending: false
                }

                // store the generated Firebase token and the new user opt-in choice in the component state
                this.setState({

                    userOpt: granted,

                    firebaseToken: firebaseToken

                });

            }.bind(this))

            // if any error occurred, then no valid FCM token is available
            .catch(function(err) {
        
                console.log("Unable to get permission to receive push notifications: ", err);

                // store the undefined Firebase token and set the user opt-out choice in the component state 
                this.setState({

                    userOpt: denied,
                    
                    firebaseToken: undefined

                });

            }.bind(this));

    }

    // callback invoked by a child node to notify the App component that the user opted out for push notifications
    userNotificationsOptOut() {

        // if push notifications are not supported by this browser, then this is an error condition
        var pushNotificationsSupported = this.state.pushNotificationsSupported;

        if (pushNotificationsSupported === false) {

            console.error("This browser does not support push notifications");

            return;
            
        }

        // if the user has already opted out, then this is an error condition
        var userOpt = this.state.userOpt;

        if (userOpt === false) {

            console.error("User has already opted-out for push notifications");

            return;
            
        }

        console.info("User toggled off the reception of push notifications");

        // erase the FCM token from the component state, and set the user opt choice to undefined
        this.setState({

            userOpt: undefined,

            firebaseToken: undefined

        });

        /* TODO keeping this deprecated code for now
        
        // retrieve the FCM component from the App component state
        var FCM = this.state.FCM;

        // if the FCM component is undefined, then no unsubscribe operation has to be performed
        if (FCM === undefined) {

            console.warn("Undefined FCM component and/or token");

            return;

        }

        // otherwise, issue the deletion of the token through the FCM API:

        // first, retrieve the FCM token
        FCM.getToken()

            // as soon as the token is available, request for its deletion
            .then(function(token) {

                return FCM.deleteToken(token);

            })

            // as soon as the token is deleted, confirm the operation success
            .then(function() {

                console.log("FCM token successfully deleted");

                // erase the FCM token from the component state, and set the user opt choice to undefined
                this.setState({

                    userOpt: undefined,

                    firebaseToken: undefined

                });

            }.bind(this))

            // if any error occurred, then no FCM token was deleted
            .catch(function(err) {
        
                console.log("Unable to opt-out for push notifications: ", err);

                // store the undefined Firebase token and set the user choice to undefined in the component state 
                this.setState({

                    userOpt: undefined,
                    
                    firebaseToken: undefined

                });

            }.bind(this));*/

    }



    // render the main component of the application
    render() {

        // prepare the push notifications label substrings
        const labelP1 = "Push notifications are";
        const labelP2 = "supported by this browser.";

        // prepare the style to apply in case the push notifications are supported by the browser
        const okStyle = {
            color: "#4CAF50",
            fontWeight: "bold"
        }

        // prepare the style to apply in case the push notifications are NOT supported by the browser
        const errorStyle = {
            color: "#B71C1C",
            fontWeight: "bold"
        }

        // retrieve the state property determining whether the browser supports the push notifications
        const pushNotificationsSupported = this.state.pushNotificationsSupported;

        // compose the push notifications label depending on whether the browser supports the push notifications
        const pushNotificationsLabel = pushNotificationsSupported === true ?
                                                (<div style={okStyle}><p>{labelP1 + " " + labelP2}</p></div>) :
                                                (<div style={errorStyle}><p>{labelP1 + " not " + labelP2}</p></div>);

        // retrieve the user choice about push notifications
        const userOpt = this.state.userOpt;

        // retrieve the Firebase API token (use it only if its pending flag is set to false)
        const firebaseToken = this.state.firebaseToken;



        /*
            perform the component rendering
        */
        
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-still-logo" alt="logo" />
                    <h1 className="App-title">GreenVulcano Push Notifications test app</h1>
                </header>
                {pushNotificationsLabel}
                {pushNotificationsSupported ?
                                <PNSwitch
                                    userOpt={userOpt}
                                    firebaseToken={firebaseToken}
                                    callback={this.userNotificationsOptChanged}
                                    pushNotificationsEnabled={pushNotificationsSupported} /> : <div></div>}
                {pushNotificationsSupported ?
                                <TokenCard
                                    userOpt={userOpt}
                                    firebaseToken={firebaseToken}
                                    pushNotificationsEnabled={pushNotificationsSupported}/> : <div></div>}
            </div>
        );

    }

}

export default App;
