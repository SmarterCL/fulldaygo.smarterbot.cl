#!/bin/bash
# Script para configurar variables de entorno en Vercel
# Las credenciales de Clerk ya están incluidas en este script

echo "🔧 Configurando variables de entorno en Vercel..."
echo ""
echo "Este script te ayudará a configurar las variables de Clerk en Vercel."
echo "Asegúrate de tener instalado Vercel CLI y estar autenticado."
echo ""

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI no está instalado."
    echo "Instálalo con: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI encontrado"
echo ""

# Link project si no está linkeado
echo "📌 Verificando link del proyecto..."
vercel link

echo ""
echo "🔑 Configurando variables de entorno..."
echo ""

# Configurar NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo "Configurando NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY..."
echo "pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
echo "pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY preview
echo "pk_test_c2V0dGxpbmctaG9nLTk3LmNsZXJrLmFjY291bnRzLmRldiQ" | vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY development

# Configurar CLERK_SECRET_KEY
echo "Configurando CLERK_SECRET_KEY..."
echo "sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz" | vercel env add CLERK_SECRET_KEY production
echo "sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz" | vercel env add CLERK_SECRET_KEY preview
echo "sk_test_74O53iKBUH9ZZLkbZQuCAba3XJIxxBvwxTNY0lifPz" | vercel env add CLERK_SECRET_KEY development

echo ""
echo "✅ Variables de entorno configuradas!"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Hacer un redeploy del proyecto: vercel --prod"
echo "2. O push a GitHub para trigger automático"
echo ""
echo "Para verificar las variables configuradas:"
echo "vercel env ls"
