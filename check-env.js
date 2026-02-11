// check-env.js
// Script para verificar que las variables de entorno estén configuradas correctamente

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config();

const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

console.log('🔍 Verificando configuración de variables de entorno...\n');

// Verificar que existe el archivo .env
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.error('❌ Error: No se encontró el archivo .env');
  console.log('\n📝 Solución:');
  console.log('1. Copia el archivo .env.example:');
  console.log('   copy .env.example .env');
  console.log('2. Edita el archivo .env con tus credenciales de Firebase\n');
  process.exit(1);
}

console.log('✅ Archivo .env encontrado\n');

// Verificar cada variable
let allValid = true;
let missingVars = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value || value.includes('tu_') || value.includes('aqui')) {
    console.log(`❌ ${varName}: No configurada o usa valor de ejemplo`);
    missingVars.push(varName);
    allValid = false;
  } else {
    console.log(`✅ ${varName}: Configurada`);
  }
});

console.log('\n' + '='.repeat(60) + '\n');

if (allValid) {
  console.log('🎉 ¡Todas las variables están configuradas correctamente!');
  console.log('\n📱 Puedes iniciar el servidor:');
  console.log('   npm run dev\n');
  process.exit(0);
} else {
  console.log('⚠️  Faltan configurar las siguientes variables:\n');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Pasos para solucionar:');
  console.log('1. Abre el archivo .env');
  console.log('2. Reemplaza los valores de ejemplo con tus credenciales de Firebase');
  console.log('3. Guarda el archivo');
  console.log('4. Ejecuta este script de nuevo: node check-env.js\n');
  console.log('📚 Para más ayuda, consulta: VARIABLES-ENTORNO.md\n');
  process.exit(1);
}
