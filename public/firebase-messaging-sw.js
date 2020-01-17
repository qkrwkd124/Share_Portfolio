importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '852847351085'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload){
    new Notification(payload.notification.title + '\n' + payload.notification.body);
});
 