import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {CopyToClipboard} from 'react-copy-to-clipboard';

const denied = "denied";
const granted = "granted";

class TokenCard extends Component {

	/*
		the constructor needs the following parameters:

		-   userOpt: the user choice about push notifications, which is necessary to determine whether to 
			render the component (supported values: "granted", "denied", undefined);
		-   pushNotificationsEnabled: a flag used to determine whether to render the component;
		-	firebaseToken: the Firebase API token bean whose token string has to be rendered;
			if the bean pending flag is not set to true, then the Firebase token is not ready yet
	*/
	constructor(props) {

		// the first, mandatory instruction of a constructor
		super(props);

		// prepare the user opt choice about push notifications
        var userOpt = updateStatus(props.userOpt);

        // prepare the push notifications enabled flag
		var pushNotificationsEnabled = updatePushNotificationsEnabled(props.pushNotificationsEnabled);

		// prepare the Firebase API token bean
		var firebaseToken = props.firebaseToken;
		
		// define the styles to apply to each sub-component of this component
		var styles = {

			card: {
				width: "40%",
				margin: "auto"
			},

			pos: {
				marginBottom: 12,
			},

			emptyDiv: {
				padding: "15px"
			},

			loadingLabelStyle: {
				color: "#FFA726",
				fontWeight: "bold"
			},

			errorLabelStyle: {
				color: "#B71C1C",
				fontWeight: "bold"
			},

			okStyle: {
				color: "#4CAF50",
				fontWeight: "bold",
				wordBreak: "break-all"
			}

		}

        // define the initial status of the component
        this.state = {

            userOpt: userOpt,

			pushNotificationsEnabled: pushNotificationsEnabled,

			firebaseToken: firebaseToken,
			
			styles: styles

		};
		
	}

	componentWillReceiveProps(nextProps) {

        // prepare the user opt choice about push notifications
        var userOpt = updateStatus(nextProps.userOpt);

        // prepare the push notifications enabled flag
		var pushNotificationsEnabled = updatePushNotificationsEnabled(nextProps.pushNotificationsEnabled);

		// prepare the Firebase API token bean
		var firebaseToken = nextProps.firebaseToken;

        // update the  status of the component
        this.setState({

            userOpt: userOpt,

			pushNotificationsEnabled: pushNotificationsEnabled,

			firebaseToken: firebaseToken

        });

    }

	render() {

		// retrieve the user opt choice
		const userOpt = this.state.userOpt;

		// retrieve the push notification enabled flag for the browser
		const pushNotificationsEnabled = this.state.pushNotificationsEnabled;

		// retrieve the styles to apply to each sub-component of this component
		const styles = this.state.styles;

		// retrieve the Firebase API token bean from the component state
		var firebaseToken = this.state.firebaseToken;

		// determine whether the Firebase API token is ready to be rendered
		const tokenReadyAndValid = firebaseToken !== undefined
												
										&& firebaseToken.pending !== undefined
										&& typeof(firebaseToken.pending) === "boolean"
										&& firebaseToken.pending === false
										
										&& firebaseToken.token !== undefined
										&& typeof(firebaseToken.token) === "string";

		// determine whether the Firebase API token is pending
		const tokenPending = firebaseToken !== undefined
												
										&& firebaseToken.pending !== undefined
										&& typeof(firebaseToken.pending) === "boolean"
										&& firebaseToken.pending === true;

		// produce the Firebase API token string to present to the user
		const tokenString = tokenReadyAndValid ?
										<div style={styles.okStyle}><code>{firebaseToken.token}</code></div> :
										(tokenPending ?
														<div style={styles.loadingLabelStyle}><code>Loading the API token...</code></div> :
														<div style={styles.errorLabelStyle}><code>Error! Undefined token!</code></div>);

		// determine whether to render the component, according to whether the user explicitly granted the
		// permission to receive push notifications
		var 	displayComponent = 	pushNotificationsEnabled !== undefined
												&& typeof(pushNotificationsEnabled) === "boolean"
												&& pushNotificationsEnabled === true;

				displayComponent = 	displayComponent
												&& userOpt !== undefined
												&& typeof(userOpt) === "string"
												&& userOpt === granted;

		// if the component should not be displayed, then return immediately
		if (!displayComponent) return <div/>;

		// prepare the copy button only if the token is ready to be rendered
		var copyButton = tokenReadyAndValid ?
								<CopyToClipboard
									text={tokenReadyAndValid ? firebaseToken.token : ""}
									onCopy={() => copyToClipboard(firebaseToken.token)}>

									<Button variant="outlined" color="primary"><b>COPY TOKEN</b></Button>

								</CopyToClipboard> :
								<div></div>

		// otherwise, render the component
		return <div>

					<Card style={styles.card}>

						<CardContent>

							<Typography variant="headline">
								
								Your Firebase Token

							</Typography>
							
							<div style={styles.emptyDiv}></div>
							
							{tokenString}

						</CardContent>

						<CardActions>

							{copyButton}

						</CardActions>

					</Card>
					
	  			</div>
		
	}

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

// this function copies the Firebase API token into the user clipboard
// TODO complete the implementation by displaying a Snackbar message
function copyToClipboard(event) {

	console.log(event);
	
}

export default TokenCard;