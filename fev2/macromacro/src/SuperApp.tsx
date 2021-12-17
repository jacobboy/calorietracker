import React, { useEffect, useState } from 'react';
import './App.css';
import { FirebaseAPI } from "./firebaseApi/api";
import { initFirebaseApp } from "./firebase-config";

import { Button } from '@mui/material';
import { User } from "firebase/auth";
import App from "./App";

initFirebaseApp()

function SuperApp({firebaseApi= new FirebaseAPI()}) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        firebaseApi.registerAuthCallback(setUser)
    }, [])

    return (
        <div className="App">
            {
                !user ?
                    <Button onClick={firebaseApi.signIn}>Sign In</Button>
                    :
                    <App/>
            }
        </div>
    );
}

export default SuperApp;
