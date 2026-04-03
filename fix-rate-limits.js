// Script para desactivar rate limits en Supabase
// Ejecutar: node fix-rate-limits.js

const supabaseUrl = 'https://eizqjdhupihczirctsse.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpenFqZGh1cGloY3ppcmN0c3NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2ODM4MywiZXhwIjoyMDkwNjQ0MzgzfQ.SImnEQFlH7wiUvvgPsRVGlxxQivKq3FrjVqOEVu0VHY';

async function fixRateLimits() {
  console.log('Desactivando rate limits...');

  // Actualizar configuración de Auth vía API
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/config`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({
      rate_limit_email: 1000,
      rate_limit_sms: 1000,
      rate_limit_token_refresh: 1000,
      rate_limit_anonymous_users: 1000,
      rate_limit_verify_otp: 1000,
      rate_limit_sign_in: 1000,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('❌ Error:', data);
    console.log('');
    console.log('Alternativa: Andá manualmente a Supabase → Project Settings → Auth → Rate Limits');
    console.log('Y cambiá todos los valores a 1000');
    process.exit(1);
  }

  console.log('✅ Configuración actualizada');
  console.log('');
  console.log('═══════════════════════════════════');
  console.log('✅ ¡RATE LIMITS AUMENTADOS!');
  console.log('═══════════════════════════════════');
  console.log('');
  console.log('Ahora los usuarios pueden registrarse sin límites.');
  console.log('Recargá tu web y probá el registro.');
  console.log('');
}

fixRateLimits();
