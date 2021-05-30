import * as React from "react";
import { render } from "react-dom";
import { initializeApp } from "firebase/app";
import { getFunctions, useFunctionsEmulator } from "firebase/functions";
import { getFirestore, useFirestoreEmulator } from "firebase/firestore";
import { getDatabase, useDatabaseEmulator } from "firebase/database";
import { Main } from "./Main";

const firebaseConfig = {
  apiKey: "AIzaSyCo6d0ATy9DnEim_CjTi8blo9KFx2G-Ag0",
  authDomain: "rvmafia-3f73f.firebaseapp.com",
  databaseURL:
    "https://rvmafia-3f73f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rvmafia-3f73f",
  storageBucket: "rvmafia-3f73f.appspot.com",
  messagingSenderId: "915213187190",
  appId: "1:915213187190:web:e7b7f35460e42395768757",
};
initializeApp(firebaseConfig);

if (location.hostname === "localhost") {
  const functions = getFunctions();
  const firestore = getFirestore();
  const database = getDatabase();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useFunctionsEmulator(functions, "localhost", 5001);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useFirestoreEmulator(firestore, "localhost", 4200);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useDatabaseEmulator(database, "localhost", 9000);
}

const root = document.createElement("div");

render(<Main />, root);

document.body.appendChild(root);
