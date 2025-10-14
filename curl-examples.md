# Ejemplos de cURL para agregar formularios

## 🔑 Headers comunes requeridos:
# - Authorization: Bearer {JWT_TOKEN}
# - apikey: {TENANT_API_KEY}
# - Content-Type: application/json

## 📍 URLs base:
# Local: http://localhost:3000/api
# Producción: https://tu-api.com/api

---

## 🌾 AGROMO - Formulario único

### Crear envío de formulario agrícola
```bash
curl -X POST "http://localhost:3000/api/agromo/forms/formulario/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "apikey: agromo-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_formulario": "Formulario de Siembra Maíz",
    "fecha": "2025-10-14",
    "hora": "08:30:00",
    "nombre_operador": "Juan Pérez",
    "medidas_plantio": "Distancia entre surcos: 80cm, Profundidad: 5cm",
    "datos_clima": "Soleado, Temperatura: 25°C",
    "observaciones": "Condiciones óptimas para siembra",
    "id_agricultor": 1,
    "id_cultivo": 1
  }'
```

---

## 🦌 BIOMO - Formularios específicos

### Formulario 1: Transecto de observación
```bash
curl -X POST "http://localhost:3000/api/biomo/forms/1/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "apikey: biomo-key-456" \
  -H "Content-Type: application/json" \
  -d '{
    "transecto": "Transecto A-01",
    "clima": "Soleado",
    "temporada": "Seca",
    "tipoAnimal": "Mamífero",
    "nombreComun": "Venado cola blanca",
    "nombreCientifico": "Odocoileus virginianus",
    "numeroIndividuos": "3",
    "tipoObservacion": "Visual directa",
    "observaciones": "Animales en área abierta",
    "latitude": 19.4326,
    "longitude": -99.1332,
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 2: Zona de observación
```bash
curl -X POST "http://localhost:3000/api/biomo/forms/2/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "apikey: biomo-key-456" \
  -H "Content-Type: application/json" \
  -d '{
    "zona": "Zona Norte",
    "clima": "Nublado",
    "temporada": "Lluviosa",
    "tipoAnimal": "Ave",
    "nombreComun": "Águila calva",
    "nombreCientifico": "Haliaeetus leucocephalus",
    "numeroIndividuos": "1",
    "tipoObservacion": "Visual",
    "alturaObservacion": "15 metros",
    "observaciones": "Ave en vuelo sobre el río",
    "latitude": 19.4426,
    "longitude": -99.1432,
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 3: Seguimiento de cobertura
```bash
curl -X POST "http://localhost:3000/api/biomo/forms/3/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "apikey: biomo-key-456" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "COV-001",
    "clima": "Parcialmente nublado",
    "temporada": "Transición",
    "seguimiento": true,
    "cambio": false,
    "cobertura": "Bosque secundario",
    "tipoCultivo": "Natural",
    "disturbio": "Ninguno",
    "observaciones": "Área bien conservada",
    "latitude": 19.4526,
    "longitude": -99.1532,
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 4: Cuadrante de vegetación
```bash
curl -X POST "http://localhost:3000/api/biomo/forms/4/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "apikey: biomo-key-456" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "QUAD-001",
    "clima": "Soleado",
    "temporada": "Seca",
    "quad_a": "10x10m",
    "quad_b": "5x5m",
    "sub_quad": "1x1m",
    "habitoDeCrecimiento": "Árbol",
    "nombreComun": "Encino",
    "nombreCientifico": "Quercus spp.",
    "placa": "ENC-001",
    "circunferencia": "120cm",
    "distancia": "50cm",
    "estatura": "8m",
    "altura": "6m",
    "observaciones": "Árbol maduro en buen estado",
    "latitude": 19.4626,
    "longitude": -99.1632,
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 5: Observación animal zona específica
```bash
curl -X POST "http://localhost:3000/api/biomo/forms/5/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiJhZ" \
  -H "apikey: biomo-key-456" \
  -H "Content-Type: application/json" \
  -d '{
    "zona": "Zona Centro",
    "clima": "Lluvioso",
    "temporada": "Lluviosa",
    "tipoAnimal": "Reptil",
    "nombreComun": "Iguana verde",
    "nombreCientifico": "Iguana iguana",
    "numeroIndividuos": "2",
    "tipoObservacion": "Visual",
    "alturaObservacion": "2 metros",
    "observaciones": "Iguanas en rama baja",
    "latitude": 19.4726,
    "longitude": -99.1732,
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 6: Instalación de cámara trampa
```bash
curl -X POST "http://localhost:3000/api/biomo/forms/6/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "apikey: biomo-key-456" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "CAM-001",
    "clima": "Nublado",
    "temporada": "Transición",
    "zona": "Sendero principal",
    "nombreCamara": "Bushnell 119477C",
    "placaCamara": "BH-001",
    "placaGuaya": "GU-001",
    "anchoCamino": "2 metros",
    "fechaInstalacion": "2025-10-14",
    "distanciaObjetivo": "3 metros",
    "alturaLente": "1.5 metros",
    "checklist": "Batería OK, SD OK, Sensor OK",
    "observaciones": "Cámara instalada en árbol caído",
    "latitude": 19.4826,
    "longitude": -99.1832,
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

### Formulario 7: Condiciones ambientales
```bash
curl -X POST "http://localhost:3000/api/biomo/forms/7/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "apikey: biomo-key-456" \
  -H "Content-Type: application/json" \
  -d '{
    "clima": "Lluvioso",
    "temporada": "Lluviosa",
    "zona": "Estación meteorológica",
    "pluviosidad": "15mm",
    "temperaturaMaxima": "28°C",
    "humedadMaxima": "85%",
    "temperaturaMinima": "22°C",
    "nivelQuebrada": "1.2m",
    "latitude": 19.4926,
    "longitude": -99.1932,
    "fecha": "2025-10-14",
    "editado": "false"
  }'
```

---

## 🤖 ROBO - Formularios con datos ambientales

### Formulario 1: Transecto con datos ambientales
```bash
curl -X POST "http://localhost:3000/api/robo/forms/1/submission" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
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
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
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
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
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
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
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
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
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
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
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
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
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

## 📝 Notas importantes:

1. **Autenticación requerida**: Todos los requests necesitan JWT token válido
2. **API Key por tenant**: Cada tenant tiene su propia API key
3. **Campos requeridos**: Solo se muestran campos principales, algunos pueden ser opcionales
4. **Coordenadas**: Usar formato decimal para latitude/longitude
5. **Fechas**: Formato YYYY-MM-DD
6. **IDs de usuario**: Se asignan automáticamente del token JWT

## 🧪 Para probar:

1. Obtener JWT token con login endpoint
2. Usar la API key correspondiente del tenant
3. Reemplazar los valores de ejemplo con datos reales
4. Verificar respuesta 201 para creación exitosa</content>
<parameter name="filePath">c:\Users\ahuerta\Downloads\awaq\MAWI-BACKEND\curl-examples.md