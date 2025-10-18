import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const data = JSON.parse(fs.readFileSync("./knowYourBike.json", "utf8"));

const firebaseConfig = {
  apiKey: "AIzaSyBDfBhlBPxl46klGGBtOGun1apq7pX33rk",
  authDomain: "aashviautomotive.firebaseapp.com",
  projectId: "aashviautomotive",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function upload() {
  const ref = doc(db, "content", "knowYourBike");
  await setDoc(ref, data);
  console.log("✅ KnowYourBike data imported successfully");
}

upload().catch(console.error);
