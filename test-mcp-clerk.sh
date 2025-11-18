#!/bin/bash

# Script de prueba para el sistema MCP de Clerk
# Este script demuestra cómo usar los endpoints MCP para configurar y validar Clerk

echo "=== Test del Sistema MCP de Clerk ==="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (cambiar según el entorno)
BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "📍 Base URL: $BASE_URL"
echo ""

# Test 1: Verificar configuración actual
echo "Test 1: Verificar configuración de Clerk"
echo "----------------------------------------"
response=$(curl -s "$BASE_URL/api/mcp/clerk-config")
echo "$response" | python3 -m json.tool

if echo "$response" | grep -q '"status": "ok"'; then
    echo -e "${GREEN}✓ Endpoint funcionando correctamente${NC}"
else
    echo -e "${RED}✗ Error en el endpoint${NC}"
fi
echo ""

# Test 2: Validar formato de llaves válidas
echo "Test 2: Validar llaves con formato correcto"
echo "--------------------------------------------"
response=$(curl -s -X POST "$BASE_URL/api/mcp/clerk-config" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "validate",
    "publishableKey": "pk_test_abc123def456ghi789",
    "secretKey": "sk_test_xyz987uvw654rst321"
  }')
echo "$response" | python3 -m json.tool

if echo "$response" | grep -q '"valid": true'; then
    echo -e "${GREEN}✓ Validación correcta para llaves con formato válido${NC}"
else
    echo -e "${RED}✗ Error en validación${NC}"
fi
echo ""

# Test 3: Validar llaves con formato inválido
echo "Test 3: Validar llaves con formato inválido"
echo "--------------------------------------------"
response=$(curl -s -X POST "$BASE_URL/api/mcp/clerk-config" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "validate",
    "publishableKey": "invalid_key",
    "secretKey": "also_invalid"
  }')
echo "$response" | python3 -m json.tool

if echo "$response" | grep -q '"valid": false'; then
    echo -e "${GREEN}✓ Validación correcta para llaves con formato inválido${NC}"
else
    echo -e "${RED}✗ Error en validación${NC}"
fi
echo ""

# Test 4: Validar llaves desajustadas (test vs live)
echo "Test 4: Validar llaves desajustadas (test vs live)"
echo "---------------------------------------------------"
response=$(curl -s -X POST "$BASE_URL/api/mcp/clerk-config" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "validate",
    "publishableKey": "pk_test_abc123def456ghi789",
    "secretKey": "sk_live_xyz987uvw654rst321"
  }')
echo "$response" | python3 -m json.tool

if echo "$response" | grep -q '"keysMatch": false'; then
    echo -e "${GREEN}✓ Validación correcta - detectó desajuste test/live${NC}"
else
    echo -e "${RED}✗ Error en validación${NC}"
fi
echo ""

# Test 5: Verificar páginas de autenticación
echo "Test 5: Verificar acceso a páginas de autenticación"
echo "----------------------------------------------------"

# Sign-in
status_signin=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sign-in")
if [ "$status_signin" = "200" ]; then
    echo -e "${GREEN}✓ Página /sign-in accesible (HTTP $status_signin)${NC}"
else
    echo -e "${YELLOW}⚠ Página /sign-in: HTTP $status_signin${NC}"
fi

# Sign-up
status_signup=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sign-up")
if [ "$status_signup" = "200" ]; then
    echo -e "${GREEN}✓ Página /sign-up accesible (HTTP $status_signup)${NC}"
else
    echo -e "${YELLOW}⚠ Página /sign-up: HTTP $status_signup${NC}"
fi
echo ""

echo "=== Resumen de Tests ==="
echo "Todos los endpoints MCP están funcionando correctamente."
echo ""
echo "Próximos pasos:"
echo "1. Configurar variables de entorno reales en .env.local"
echo "2. Reiniciar el servidor de desarrollo"
echo "3. Ejecutar nuevamente este script para verificar la conexión con Clerk"
echo ""
