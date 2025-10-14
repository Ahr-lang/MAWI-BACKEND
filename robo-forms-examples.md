# 🚀 Ejemplos Completos de cURL para ROBO - Formularios

## 🔑 API Keys:
- **robo**: `robo-key-789`

## 📍 URLs base:
- Local: `http://localhost:3000/api`
- Producción: `https://tu-api.com/api`

---

## 🔐 PASO 1: Login para obtener JWT Token

```bash
curl -X POST "http://localhost:3000/api/robo/users/login" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "usuario@robo.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "usuario",
    "user_email": "usuario@robo.com",
    "tenant": "robo"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "7d"
}
```

---

## 💡 Variables para los ejemplos:
```bash
# Reemplaza con tu token real obtenido del login
JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
FORM_ID=123  # Reemplaza con ID real obtenido de POST
```

---

## 📝 PASO 2: Crear Formularios (POST /api/robo/forms/{formKey}/submission)

### Formulario 1: Transecto con datos ambientales
```bash
curl -X POST "http://localhost:3000/api/robo/forms/1/submission" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "transecto": "Transecto R-01",
    "clima": "Soleado",
    "temporada": "Seca",
    "tipoAnimal": "Mamífero",
    "nombreComun": "Jabalí",
    "nombreCientifico": "Tayassu pecari",
    "numeroIndividuos": "4",
    "tipoObservacion": "Huellas",
    "observaciones": "Huellas recientes en sendero",
    "latitude": 19.5026,
    "longitude": -99.2032,
    "temperaturaMaxima": "32°C",
    "humedadMaxima": "45%",
    "temperaturaMinima": "18°C",
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 2: Zona con datos ambientales
```bash
curl -X POST "http://localhost:3000/api/robo/forms/2/submission" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "zona": "Zona Sur",
    "clima": "Nublado",
    "temporada": "Lluviosa",
    "tipoAnimal": "Ave",
    "nombreComun": "Guacamaya roja",
    "nombreCientifico": "Ara macao",
    "numeroIndividuos": "2",
    "tipoObservacion": "Visual",
    "alturaObservacion": "20 metros",
    "observaciones": "Pareja volando sobre dosel",
    "latitude": 19.5126,
    "longitude": -99.2132,
    "temperaturaMaxima": "26°C",
    "humedadMaxima": "78%",
    "temperaturaMinima": "20°C",
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 3: Seguimiento con datos ambientales
```bash
curl -X POST "http://localhost:3000/api/robo/forms/3/submission" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ROB-COV-001",
    "clima": "Parcialmente nublado",
    "temporada": "Transición",
    "seguimiento": true,
    "cambio": true,
    "cobertura": "Bosque maduro",
    "tipoCultivo": "Natural",
    "disturbio": "Leve",
    "observaciones": "Cambios en composición de especies",
    "latitude": 19.5226,
    "longitude": -99.2232,
    "temperaturaMaxima": "29°C",
    "humedadMaxima": "65%",
    "temperaturaMinima": "19°C",
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 4: Cuadrante con datos ambientales
```bash
curl -X POST "http://localhost:3000/api/robo/forms/4/submission" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ROB-QUAD-001",
    "clima": "Soleado",
    "temporada": "Seca",
    "quad_a": "10x10m",
    "quad_b": "5x5m",
    "sub_quad": "1x1m",
    "habitoDeCrecimiento": "Palma",
    "nombreComun": "Palma real",
    "nombreCientifico": "Roystonea regia",
    "placa": "PAL-001",
    "circunferencia": "95cm",
    "distancia": "30cm",
    "estatura": "12m",
    "altura": "10m",
    "observaciones": "Palma en excelente estado",
    "latitude": 19.5326,
    "longitude": -99.2332,
    "temperaturaMaxima": "33°C",
    "humedadMaxima": "40%",
    "temperaturaMinima": "21°C",
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 5: Animal zona específica con datos ambientales
```bash
curl -X POST "http://localhost:3000/api/robo/forms/5/submission" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "zona": "Zona Este",
    "clima": "Lluvioso",
    "temporada": "Lluviosa",
    "tipoAnimal": "Anfibio",
    "nombreComun": "Rana arborícola",
    "nombreCientifico": "Hyla spp.",
    "numeroIndividuos": "6",
    "tipoObservacion": "Auditiva",
    "alturaObservacion": "1 metro",
    "observaciones": "Cantos nocturnos intensos",
    "latitude": 19.5426,
    "longitude": -99.2432,
    "temperaturaMaxima": "24°C",
    "humedadMaxima": "92%",
    "temperaturaMinima": "18°C",
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 6: Cámara trampa con datos ambientales
```bash
curl -X POST "http://localhost:3000/api/robo/forms/6/submission" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "ROB-CAM-001",
    "clima": "Nublado",
    "temporada": "Transición",
    "zona": "Camino secundario",
    "nombreCamara": "Reconyx HC600",
    "placaCamara": "RC-001",
    "placaGuaya": "GU-R001",
    "anchoCamino": "1.5 metros",
    "fechaInstalacion": "2025-10-14",
    "distanciaObjetivo": "2.5 metros",
    "alturaLente": "1.2 metros",
    "checklist": "Batería OK, Memoria OK, Sensor OK",
    "observaciones": "Cámara en zona de alta actividad",
    "latitude": 19.5526,
    "longitude": -99.2532,
    "temperaturaMaxima": "27°C",
    "humedadMaxima": "70%",
    "temperaturaMinima": "17°C",
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 7: Condiciones ambientales detalladas
```bash
curl -X POST "http://localhost:3000/api/robo/forms/7/submission" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "clima": "Lluvioso",
    "temporada": "Lluviosa",
    "zona": "Estación climática automatizada",
    "pluviosidad": "22mm",
    "temperaturaMaxima": "25°C",
    "humedadMaxima": "88%",
    "temperaturaMinima": "19°C",
    "nivelQuebrada": "1.8m",
    "latitude": 19.5626,
    "longitude": -99.2632,
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

---

## 📖 PASO 3: Leer Formularios (GET)

### Obtener todos los formularios del usuario
```bash
curl -X GET "http://localhost:3000/api/robo/forms" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789"
```

### Obtener formularios de un tipo específico (ej: Formulario 1)
```bash
curl -X GET "http://localhost:3000/api/robo/forms/1" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789"
```

### Obtener formulario específico por ID
```bash
curl -X GET "http://localhost:3000/api/robo/forms/1/$FORM_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789"
```

---

## ✏️ PASO 4: Actualizar Formulario (PUT)

```bash
curl -X PUT "http://localhost:3000/api/robo/forms/1/$FORM_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789" \
  -H "Content-Type: application/json" \
  -d '{
    "observaciones": "Formulario actualizado con nueva información",
    "numeroIndividuos": "5",
    "editado": "true"
  }'
```

---

## 🗑️ PASO 5: Eliminar Formulario (DELETE)

```bash
curl -X DELETE "http://localhost:3000/api/robo/forms/1/$FORM_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: robo-key-789"
```

---

## 🔄 Script Completo de Prueba

### Para probar todo el flujo automáticamente:
```bash
#!/bin/bash

# Configuración
TENANT="robo"
API_KEY="robo-key-789"
EMAIL="usuario@robo.com"
PASSWORD="password123"
BASE_URL="http://localhost:3000/api"

echo "🔑 Obteniendo JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/$TENANT/users/login" \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"user_email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$JWT_TOKEN" = "null" ] || [ -z "$JWT_TOKEN" ]; then
  echo "❌ Error obteniendo token"
  echo "Respuesta: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Token obtenido: ${JWT_TOKEN:0:50}..."

echo "📝 Creando formulario..."
FORM_RESPONSE=$(curl -s -X POST "$BASE_URL/$TENANT/forms/1/submission" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transecto": "Transecto TEST-01",
    "clima": "Soleado",
    "temporada": "Seca",
    "tipoAnimal": "Mamífero",
    "nombreComun": "Jabalí",
    "nombreCientifico": "Tayassu pecari",
    "numeroIndividuos": "4",
    "tipoObservacion": "Huellas",
    "observaciones": "Prueba automática",
    "latitude": 19.5026,
    "longitude": -99.2032,
    "temperaturaMaxima": "32°C",
    "humedadMaxima": "45%",
    "temperaturaMinima": "18°C",
    "fecha": "2025-10-14",
    "editado": "false"
  }')

echo "📋 Respuesta del formulario:"
echo $FORM_RESPONSE | jq '.'

# Extraer ID del formulario creado
FORM_ID=$(echo $FORM_RESPONSE | jq -r '.data.id')

if [ "$FORM_ID" != "null" ] && [ -n "$FORM_ID" ]; then
  echo "🔍 Consultando formulario creado..."
  GET_RESPONSE=$(curl -s -X GET "$BASE_URL/$TENANT/forms/1/$FORM_ID" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "apikey: $API_KEY")

  echo "📖 Respuesta GET:"
  echo $GET_RESPONSE | jq '.'

  echo "✏️ Actualizando formulario..."
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/$TENANT/forms/1/$FORM_ID" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "apikey: $API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"observaciones": "Actualizado por script automático", "editado": "true"}')

  echo "📝 Respuesta UPDATE:"
  echo $UPDATE_RESPONSE | jq '.'

  echo "🗑️ Eliminando formulario..."
  DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/$TENANT/forms/1/$FORM_ID" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "apikey: $API_KEY")

  echo "🗑️ Respuesta DELETE:"
  echo $DELETE_RESPONSE | jq '.'
else
  echo "❌ No se pudo obtener ID del formulario creado"
fi
```

---

## 📋 Respuestas Esperadas

### ✅ POST (201 Created)
```json
{
  "message": "Submission created",
  "tenant": "robo",
  "formKey": "1",
  "data": {
    "id": 123,
    "transecto": "Transecto R-01",
    "clima": "Soleado",
    "id_usuario": 1,
    "createdAt": "2025-10-14T...",
    "updatedAt": "2025-10-14T..."
  }
}
```

### ✅ GET (200 OK)
```json
{
  "message": "Form retrieved",
  "tenant": "robo",
  "formKey": "1",
  "data": {
    "id": 123,
    "transecto": "Transecto R-01",
    "clima": "Soleado",
    "tipoAnimal": "Mamífero",
    "numeroIndividuos": "4",
    "latitude": 19.5026,
    "longitude": -99.2032,
    "temperaturaMaxima": "32°C",
    "humedadMaxima": "45%",
    "fecha": "2025-10-14",
    "id_usuario": 1
  }
}
```

### ✅ PUT (200 OK)
```json
{
  "message": "Form updated",
  "tenant": "robo",
  "formKey": "1",
  "data": {
    "id": 123,
    "observaciones": "Actualizado con nueva información",
    "editado": "true"
  }
}
```

### ✅ DELETE (200 OK)
```json
{
  "message": "Form deleted",
  "tenant": "robo",
  "formKey": "1",
  "formId": "123"
}
```

---

## ⚠️ Códigos de Error

- **400**: Datos inválidos
- **401**: Token inválido o ausente
- **403**: API key inválida
- **404**: Formulario no encontrado
- **500**: Error del servidor

---

## 💡 Consejos para Testing

1. **Primero**: Ejecuta el login para obtener JWT token
2. **Crea**: Un formulario con POST para obtener un ID
3. **Lee**: Usa GET para verificar que se creó correctamente
4. **Actualiza**: Modifica algunos campos con PUT
5. **Elimina**: Borra el formulario de prueba con DELETE
6. **Verifica**: Que ya no existe intentando GET nuevamente

¡Ya tienes ejemplos completos para probar todos los endpoints de formularios en ROBO! 🚀</content>
<parameter name="filePath">c:\Users\ahuerta\Downloads\awaq\MAWI-BACKEND\robo-forms-examples.md