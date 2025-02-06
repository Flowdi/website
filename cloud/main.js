// Firebase-Konfiguration (ersetze die Platzhalter durch deine echten Werte aus der Firebase-Konsole)
const firebaseConfig = {
    apiKey: "DEIN_API_KEY",
    authDomain: "DEIN-PROJEKT.firebaseapp.com",
    projectId: "DEIN-PROJEKT",
    storageBucket: "DEIN-PROJEKT.appspot.com",
    messagingSenderId: "DEINE_MESSAGING_SENDER_ID",
    appId: "DEINE_APP_ID"
  };
  
  // Firebase initialisieren
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
  
  // Zugriff auf Firebase Auth
  const auth = firebase.auth();
  
  // Login-Button Event-Listener
  document.getElementById('loginBtn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Erfolgreich angemeldet
        const user = userCredential.user;
        console.log('Erfolgreich angemeldet:', user);
        // Weiterleitung zur Dashboard-Seite
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.error('Fehler beim Login:', error);
        errorMessage.textContent = error.message;
      });
  });
  