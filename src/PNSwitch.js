import React, { Component } from 'react';
import { Switch } from '@material-ui/core';

const denied = "denied"
const granted = "granted";

class PNSwitch extends Component {

    /*
        the constructor needs the following parameters:

        -   userOpt: the user choice about push notifications, which has to be reflected in the
            switch status (supported values: "granted", "denied", undefined);
        -   firebaseToken: a bean containing the Firebase API token and a pending flag, used to determine
            whether the token is not a Promise;
            it is used to determine whether it is necessary to set the switch to its off status, since
            the absence of the token would require requesting it to the Firebase API;
        -   callback: a callback to invoke whenever the user changes the status of the switch
            (i.e. when the user changes his/her decision about push notifications permissions);
        -   pushNotificationsEnabled: a flag used to determine whether the push notifications are
            supported by the browser
    */
    constructor(props) {

        // the first, mandatory instruction of a constructor
        super(props);

        // prepare the initial status of the switch
        var initialStatus = updateStatus(props.userOpt);

        // retrieve the Firebase API token bean
        var firebaseToken = props.firebaseToken;

        // prepare the callback function to call whenever the switch changes its status
        var notificationsCallback = updateCallback(props.callback);

        // prepare the push notifications enabled flag
        var pushNotificationsEnabled = updatePushNotificationsEnabled(props.pushNotificationsEnabled);

        // define the initial status of the component
        this.state = {

            status: initialStatus,

            firebaseToken: firebaseToken,

            notificationsCallback: notificationsCallback,

            pushNotificationsEnabled: pushNotificationsEnabled

        };

    }

    // callback to intercept the status changing of the switch component
    handleChange = name => event => {

        // retrieve the new value of the switch (N.B. its state has to be changed accordingly
        // from the parent component)
        var flag = event.target.checked;

        // if the switch callback is defined, thne invoke it
        if (this.state.notificationsCallback !== undefined)
            
            this.state.notificationsCallback(flag);

        // otherwise, log an error condition
        else

            console.error("No callback defined for the switch - its status will not be updated");

    };

    componentWillReceiveProps(nextProps) {

        // prepare the status of the switch
        var status = updateStatus(nextProps.userOpt);

        // retrieve the Firebase API token bean
        var firebaseToken = nextProps.firebaseToken;

        // prepare the callback function to call whenever the switch changes its status
        var callback = updateCallback(nextProps.callback);

        // prepare the push notifications enabled flag
        var pushNotificationsEnabled = updatePushNotificationsEnabled(nextProps.pushNotificationsEnabled);

        // update the status of the component
        this.setState({

            status: status,

            firebaseToken: firebaseToken,

            notificationsCallback: callback,

            pushNotificationsEnabled: pushNotificationsEnabled

        });

    }

    render() {

        // retrieve the switch callback
        const callback = this.state.notificationsCallback;

        // retrieve the user opt choice
        const userOpt = this.state.status;

        // retrieve the Firebase API token bean
        const firebaseToken = this.state.firebaseToken;

        // prepare the error condition flag by checking the presence of a valid callback function
        var errorCondition = !isFunction(callback);

        // prepare the error label style
        var errorLabelStyle = {
            color: "#B71C1C",
            fontWeight: "bold"
        }

        // determine whether the user explicitly opted-in for push notifications
        var isGranted = userOpt !== undefined && typeof(userOpt) === "string" && userOpt === granted;

        // if the Firebase API token is not defined yet, then set the switch to its off status
        isGranted = isGranted
                                && firebaseToken !== undefined

                                && firebaseToken.pending !== undefined
                                && typeof(firebaseToken.pending) === "boolean"
                                && firebaseToken.pending === false
                                
                                && firebaseToken.token !== undefined
                                && typeof(firebaseToken.token) === "string";

        // determine whether the user explicitly opted-out for push notifications
        var isDenied = userOpt !== undefined && typeof(userOpt) === "string" && userOpt === denied;

        // prepare the label of the switch depending on its status
        const label =   !errorCondition ?
                            (this.state.pushNotificationsEnabled && !isDenied ?
                                (isGranted ? "Push notifications enabled" : "Push notifications disabled"):
                                "Please unlock push notifications in your browser") :
                            <div style={errorLabelStyle}>Invalid component initialization!<br/>Check out the console log.</div>;

        // prepare the switch style properties
        var switchStyle = {
            textAlign: "center",
            padding: "50px"
        }

        // render the component by using its state
        return(
            
            <div style={switchStyle}>
                {label}<br />
                <Switch
                    checked={isGranted}
                    onChange={this.handleChange()}
                    value="status"
                    color="primary"
                    disabled={errorCondition || isDenied}
                />
            </div>
        )

    }

}

// determine whether the specified parameter is a callable function
function isFunction(f) {

    return f && f !== undefined && {}.toString.call(f) === '[object Function]';

}

// determine whether the specified user opt choice is a valid opt choice;
// if so, return it; otherwise, return undefined by default
function updateStatus(userOpt) {

    // initialize the variable to return
    var result = undefined;

    // if the userOpt parameter is passed and it is either the "granted" or the "denied" string,
    // then use its value as the switch status
    if (userOpt !== undefined && typeof(userOpt) === "string") {
        
        if (userOpt === granted || userOpt === denied)
    
            result = userOpt;

    }

    // otherwise, set the initial switch status to false by default
    else

        result = undefined;

    return result;
        
}

// determine whether the specified callback parameter is a valid function;
// if so, return it; otherwise, return undefined
function updateCallback(callback) {

    var result = undefined;

    // if the callback is a callable function, then use its reference as the switch callback
    if (isFunction(callback))

        result = callback;

    // otherwise, leave the callback undefined
    else {

        console.warn("No callback defined for the switch - setting an undefined logging callback");

        result = undefined;

    }

    return result;

}

// determine whether the push notifications enabled field is a valid boolean;
// if so, return it; otherwise, return false by default
function updatePushNotificationsEnabled(pushNotificationsEnabled) {

    // initialize the variable to return
    var result = undefined;

    // if the pushNotificationsEnabled parameter is passed and it is a boolean value,
    // then use its value as the push notifications enabled flag
    if (pushNotificationsEnabled !== undefined && typeof(pushNotificationsEnabled) === "boolean")
    
        result = pushNotificationsEnabled;

    // otherwise, set the initial push notifications enabled flag to false by default
    else

        result = false;

    return result;
        
}

export default PNSwitch;