// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-messaging.js');

// prepare the Firebase Cloud Messaging (FCM) configuration TODO replace this
var firebaseConfig = {
    /*apiKey: <YOUR_API_KEY>,
    authDomain: <YOUR_AUTH_DOMAIN>,
    databaseURL: <YOUR_DATABASE_URL>,
    projectId: <YOUR_PROJECT_ID>,
    storageBucket: <YOUR_STORAGE_BUCKET>,
    messagingSenderId: <YOUR_MESSAGING_SENDER_ID>*/
};

// initialize the firebase component with the given settings
firebase.initializeApp(firebaseConfig);

// retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// load the application icon
var icon = './logo_gv.png';

messaging.setBackgroundMessageHandler(payload => {
    
    const notificationEnvelop = JSON.parse(payload.data.notification);  

    const title = notificationEnvelop.title;
    const options = {
        body: notificationEnvelop.body,
        icon: icon
    };

    self.registration.showNotification(title, options);

});
