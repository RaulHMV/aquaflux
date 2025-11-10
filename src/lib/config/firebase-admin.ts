// ==========================================
// FIREBASE ADMIN CONFIGURATION
// ==========================================

import * as admin from 'firebase-admin';

// Inicializar Firebase Admin solo una vez
if (!admin.apps.length) {
  try {
    // En producción (Vercel), usa variables de entorno
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('✅ Firebase Admin inicializado desde variables de entorno');
    } 
    // En desarrollo local, usa el archivo JSON
    else {
      const serviceAccount = require('../../../aquaflux-ec94e-firebase-adminsdk-fbsvc-4057a9ca6a.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin inicializado desde archivo local');
    }
  } catch (error) {
    console.error('❌ Error inicializando Firebase Admin:', error);
  }
}

export default admin;
