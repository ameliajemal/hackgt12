// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXx6qQn6U_1cUTgmIayE1yUZE2_KfulyI",
  authDomain: "parkura-52aaa.firebaseapp.com",
  projectId: "parkura-52aaa",
  storageBucket: "parkura-52aaa.appspot.com",
  messagingSenderId: "186694906017",
  appId: "1:186694906017:web:0e6b691af102e8b89380e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * List all folder names under the given storage path.
 */
export const listSubfolders = async (path) => {
  const folderRef = ref(storage, path);
  const res = await listAll(folderRef);
  return res.prefixes.map(p => p.name.replace(/\/$/, ""));
};

/**
 * Fetch and parse a test.txt file for a session
 */
export const fetchSessionMetrics = async (patientName, gameName, sessionId) => {
  const fileRef = ref(storage, `${patientName}/${gameName}/${sessionId}/test.txt`);
  const url = await getDownloadURL(fileRef);
  const text = await fetch(url).then(r => r.text());

  const metrics = {};
  text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .forEach(line => {
      const [key, ...rest] = line.split(":");
      const raw = rest.join(":").trim();

      if (raw.startsWith("[")) metrics[key] = JSON.parse(raw);
      else if (!isNaN(raw)) metrics[key] = parseFloat(raw);
      else metrics[key] = raw;
    });

  return { id: sessionId, ...metrics };
};

/**
 * Fetch all sessions for a patient
 */
export const getPatientData = async (patientName) => {
  const games = await listSubfolders(patientName);
  const data = {};

  await Promise.all(
    games.map(async gameName => {
      const sessionIds = await listSubfolders(`${patientName}/${gameName}`);
      const sessions = await Promise.all(
        sessionIds.map(sid => fetchSessionMetrics(patientName, gameName, sid))
      );
      data[gameName] = sessions;
    })
  );

  return data;
};
