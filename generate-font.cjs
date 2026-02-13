// Script para generar atlas MSDF con soporte completo para español
const generateBMFont = require('msdf-bmfont-xml');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, 'public/fonts/Cinzel/Cinzel-Regular.ttf');
const outputPath = path.join(__dirname, 'public/fonts/Cinzel/Cinzel');

// Caracteres a incluir: básicos + español (tildes, ñ, ¿, ¡)
const charset = 
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' + // Letras básicas
  'ÁÉÍÓÚáéíóúÑñ' + // Español
  '0123456789' + // Números
  '.,;:!?¡¿' + // Puntuación
  '\'"-()[]{}' + // Símbolos
  ' '; // Espacio

const options = {
  outputType: 'json',
  filename: outputPath,
  charset: charset,
  fontSize: 64,
  fieldType: 'msdf',
  distanceRange: 4,
  roundDecimal: 2,
  smartSize: true,
  pot: true, // Power of two texture size
  square: false,
  textureSize: [1024, 1024]
};

console.log('🔨 Generando atlas MSDF con soporte para español...');
console.log('📝 Caracteres incluidos:', charset);

generateBMFont(fontPath, options, (error, textures, font) => {
  if (error) {
    console.error('❌ Error al generar fuente:', error);
    process.exit(1);
  }

  // Guardar el archivo JSON
  fs.writeFileSync(outputPath + '.json', font.data, 'utf8');
  console.log('✅ Archivo JSON generado:', outputPath + '.json');

  // Guardar la textura PNG
  textures.forEach((texture, index) => {
    const texturePath = outputPath + (index > 0 ? index : '') + '.png';
    fs.writeFileSync(texturePath, texture.texture);
    console.log('✅ Textura generada:', texturePath);
  });

  console.log('🎉 ¡Fuente generada exitosamente con soporte para tildes!');
  console.log('');
  console.log('Caracteres soportados:');
  console.log('- Letras con tildes: á, é, í, ó, ú, Á, É, Í, Ó, Ú');
  console.log('- Letra ñ: ñ, Ñ');
  console.log('- Signos de interrogación y exclamación: ¿, ¡');
});
