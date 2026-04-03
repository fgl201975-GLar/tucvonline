// Script para desplegar Edge Function vía API
// Ejecutar: node deploy-function.js

const supabaseUrl = 'https://eizqjdhupihczirctsse.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpenFqZGh1cGloY3ppcmN0c3NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2ODM4MywiZXhwIjoyMDkwNjQ0MzgzfQ.SImnEQFlH7wiUvvgPsRVGlxxQivKq3FrjVqOEVu0VHY';

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function deployFunction() {
  console.log('🚀 Desplegando Edge Function...');

  // Leer el código de la función
  const functionPath = join(__dirname, 'supabase', 'functions', 'register-user', 'index.ts');
  const functionCode = readFileSync(functionPath, 'utf-8');

  console.log('📝 Código leído:', functionCode.length, 'bytes');

  // Crear el bundle (simplificado)
  const body = {
    name: 'register-user',
    verify_jwt: false,
    import_map: false,
    files: [
      {
        name: 'index.ts',
        content: functionCode,
      },
    ],
  };

  console.log('📤 Enviando a Supabase...');

  try {
    // Primero, verificar si la función ya existe
    const checkResponse = await fetch(
      `${supabaseUrl}/functions/v1`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
      }
    );

    console.log('Check status:', checkResponse.status);

    // Desplegar/actualizar la función
    const deployResponse = await fetch(
      `${supabaseUrl}/functions/v1/register-user`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const deployData = await deployResponse.json();

    if (!deployResponse.ok) {
      console.error('❌ Error al desplegar:', deployData);
      
      // Si ya existe, intentar actualizar
      if (deployData.message?.includes('already')) {
        console.log('🔄 La función ya existe, intentando actualizar...');
        
        const updateResponse = await fetch(
          `${supabaseUrl}/functions/v1/register-user`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        const updateData = await updateResponse.json();

        if (!updateResponse.ok) {
          console.error('❌ Error al actualizar:', updateData);
          process.exit(1);
        }

        console.log('✅ ¡Función actualizada exitosamente!');
      } else {
        process.exit(1);
      }
    } else {
      console.log('✅ ¡Función desplegada exitosamente!');
    }

    console.log('');
    console.log('═══════════════════════════════════');
    console.log('✅ EDGE FUNCTION DESPLEGADA');
    console.log('═══════════════════════════════════');
    console.log('');
    console.log('URL: https://eizqjdhupihczirctsse.supabase.co/functions/v1/register-user');
    console.log('');
    console.log('Ahora el registro debería funcionar sin rate limits.');
    console.log('Recargá tu web y probá registrarte.');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deployFunction();
