// pre-deploy.js
// Script para verificar que todo esté listo antes del deploy

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verificando proyecto antes del deploy...\n');

let hasErrors = false;
let warnings = [];

// 1. Verificar archivos de configuración
console.log('📋 Verificando archivos de configuración...');

const requiredFiles = [
  'netlify.toml',
  'vite.config.js',
  'package.json',
  'public/_redirects'
];

requiredFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NO ENCONTRADO`);
    hasErrors = true;
  }
});

// 2. Verificar archivos HTML
console.log('\n📄 Verificando archivos HTML...');

const htmlFiles = [
  'index.html',
  'send.html',
  'qr-generator.html',
  'test-firebase.html'
];

htmlFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NO ENCONTRADO`);
    hasErrors = true;
  }
});

// 3. Verificar estructura de carpetas
console.log('\n📁 Verificando estructura de carpetas...');

const requiredDirs = [
  'src',
  'public',
  'css'
];

requiredDirs.forEach(dir => {
  if (existsSync(dir)) {
    console.log(`  ✅ ${dir}/`);
  } else {
    console.log(`  ❌ ${dir}/ - NO ENCONTRADO`);
    hasErrors = true;
  }
});

// 4. Verificar que .env no esté en el proyecto (seguridad)
console.log('\n🔒 Verificando seguridad...');

if (existsSync('.env')) {
  console.log('  ⚠️  .env encontrado - Asegúrate de que esté en .gitignore');
  warnings.push('Archivo .env encontrado. No debe subirse a Git.');
}

if (existsSync('.gitignore')) {
  console.log('  ✅ .gitignore existe');
} else {
  console.log('  ❌ .gitignore NO ENCONTRADO');
  hasErrors = true;
}

// 5. Verificar dependencias
console.log('\n📦 Verificando dependencias...');

if (existsSync('node_modules')) {
  console.log('  ✅ node_modules/ instalado');
} else {
  console.log('  ❌ node_modules/ NO ENCONTRADO');
  console.log('     Ejecuta: npm install');
  hasErrors = true;
}

// 6. Verificar archivos de Firebase
console.log('\n🔥 Verificando configuración de Firebase...');

if (existsSync('src/firebase.js')) {
  console.log('  ✅ src/firebase.js');
} else {
  console.log('  ❌ src/firebase.js - NO ENCONTRADO');
  hasErrors = true;
}

// 7. Recordatorios importantes
console.log('\n📝 Recordatorios para Netlify:');
console.log('  1. Configurar variables de entorno en Netlify UI');
console.log('  2. Todas las variables deben empezar con VITE_');
console.log('  3. Generar nuevo QR con la URL de producción');
console.log('  4. Actualizar reglas de Firebase para producción');

// Resumen
console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ Se encontraron errores. Corrígelos antes de desplegar.\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n⚠️  Advertencias:');
  warnings.forEach(w => console.log(`   - ${w}`));
  console.log('\n✅ El proyecto está listo para desplegar (con advertencias).\n');
  console.log('Ejecuta: npm run build\n');
  process.exit(0);
} else {
  console.log('\n✅ ¡Todo listo para desplegar!\n');
  console.log('Pasos siguientes:');
  console.log('  1. npm run build');
  console.log('  2. Sube a Netlify o haz push a GitHub\n');
  process.exit(0);
}
