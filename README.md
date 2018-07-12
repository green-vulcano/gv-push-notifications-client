# GreenVulcano Push Notification test application

This is a React application used to test the subscription to a push notification server (Firebase in this case).

## Getting started

### Prerequisites

In order to run the Push Notifications client, you need to install the following frameworks:

- Node.js v9.8.0 or higher ([installation docs](https://nodejs.org/en/download/package-manager/))
- Yarn package manager v1.7.0 or higher ([installation docs](https://yarnpkg.com/lang/en/docs/install))

Here we provide the installation steps needed to install the required frameworks on Ubuntu Linux 16.04.

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

### Configuring the Firebase Messaging client

This application is aable to receive push notifications by the Firebase messaging service. The application contacts the Firebase
API to obtain a token string and display it to the user.
This token can be used to send push notifications to the user contacting the Firebase messaging service.

In order to test the application, you need to have a Firebase account - further reference on [the Firebase website](https://firebase.google.com/) if needed.

Once you created your Firebase account, you need to create or use a Firebase application to serve the Push Notifications client.
If you need to create a Firebase application, open [your Firebase console](https://console.firebase.google.com),
select "Add Project" and follow the instructions to create the application.

Then, in the Firebase console, open your Firebase application. Select "Add Firebase to your Web app". The popup that will be shown displays the
code snippet that the Push Notifications application needs to contact the Firebase API in order to subscribe to push notifications.
The code that needs to be copied is highlighted in the following screenshot:

![Screenshot](./utilities/screenshot.png)

Replace the ```var firebaseConfig``` variable with the highlighted code in the following files: ```src/App.js```,  ```public/firebase-messaging-sw.js```. This way, the Push Notifications application will be able to contact the Firebase API.

You're now ready to run the application.

### Running the application

First, clone this repository or download it. Then, reach the folder containing the downloaded files and
run ```yarn start```.

Here we provide the steps needed to run the application on Ubuntu Linux 16.04. Open a terminal and run the following commands:

```
git clone https://github.com/mrambler90/gv-push-notifications-client
cd gv-push-notifications-client
yarn start
```

The application should be started, and a new browser tab containing the running application should be automatically opened.
Usually the application runs on ```localhost:3000``` (or on a different port, if port 3000 is held by another running process).
Check the output of the ```yarn build``` command to determine the correct internet address of the Push Notifications application.

### Generating a push notifications token

In the application window, push the switch button. The web browser will ask you for the permission to receive push notifications.
Once this permission is granted, the application will interact with the Firebase application you defined, and it will obtain a token
which will be displayed in the application window.

![Token](./utilities/token.png)

You will need this token to send push notifications to the application. You can copy it into your clipboard by pushing the Copy Token button.

### Sending a push notification to the application

The final step of this tutorial is sending a push notification to the Push Notifications application. In order to do so, you need to make an
HTTP request to the Firebase API, defined as follows.


```
POST https://fcm.googleapis.com/fcm/send

Headers:

Authorization: key=<your Firebase API key>
Content-Type: application/json

Body: {
    "to": "<the token you generated in the application>",
    "data": {
        "notification": {
            "body": "<the notification body>",
            "title": "<the notification title>"
        }
    },
    "priority": 10
}

```

Your Firebase API key is present in the apiKey parameter of the Firebase configuration code that you previouly inserted in the code.

You may use any HTTP client application to issue this HTTP request - such as [Postman](https://www.getpostman.com/). Once the HTTP request
is correctly sent, you should see that the push notification is received by the web browser.

## For the devs: TODO list

- Show a loading splash screen for long-waiting operations (e.g. Firebase API invocations)
- Consider the case in which the application could not contact the Firebase API (e.g. it is offline)
- Move the Firebase API configuration into a single configuration file
- Make the application a Progressive Web Application
- Graphical refinements:
	- Show a [Snackbar](https://material-ui.com/demos/snackbars/) when the *Copy Token* button is pressed

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
