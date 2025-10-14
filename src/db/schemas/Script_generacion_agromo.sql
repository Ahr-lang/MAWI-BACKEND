-- ==========================================================
--  AGROMO Unified Database Schema
-- ==========================================================


-- ==========================================================
--  1. USERS
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    lastaccess      TIMESTAMPTZ,
    lastlogin       TIMESTAMPTZ,
    user_email      VARCHAR(255),
    telefono        VARCHAR(20),
    empresa         TEXT,
    cargo           TEXT,
    ubicacion       TEXT,
    rol             VARCHAR(50),
    estado_conexion BOOLEAN DEFAULT FALSE
);

-- ==========================================================
--  2. AGRICULTOR
-- ==========================================================
CREATE TABLE IF NOT EXISTS agricultor (
    id_agricultor     SERIAL PRIMARY KEY,
    nombre            TEXT NOT NULL,
    email             TEXT,
    ubicacion         TEXT,
    estado_conexion   BOOLEAN DEFAULT FALSE,
    foto_perfil       BYTEA,
    id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- ==========================================================
--  3. CULTIVO
-- ==========================================================
CREATE TABLE IF NOT EXISTS cultivo (
    id_cultivo        SERIAL PRIMARY KEY,
    nombre            TEXT,
    tipo              TEXT NOT NULL,
    fecha_siembra     DATE,
    area              REAL,
    estado            VARCHAR(50),
    estado_conexion   BOOLEAN DEFAULT FALSE,
    id_agricultor     INT REFERENCES agricultor(id_agricultor) ON DELETE CASCADE
);

-- ==========================================================
--  4. FORMULARIO
-- ==========================================================
CREATE TABLE IF NOT EXISTS formulario (
    id_formulario     SERIAL PRIMARY KEY,
    nombre_formulario TEXT,
    fecha             DATE,
    hora              TIME,
    nombre_operador   TEXT,
    medidas_plantio   TEXT,
    datos_clima       TEXT,
    observaciones     TEXT,
    estado_conexion   BOOLEAN DEFAULT FALSE,
    id_agricultor     INT REFERENCES agricultor(id_agricultor) ON DELETE SET NULL,
    id_cultivo        INT REFERENCES cultivo(id_cultivo) ON DELETE SET NULL
);

-- ==========================================================
--  5. CONDICIONES CLIMATICAS
-- ==========================================================
CREATE TABLE IF NOT EXISTS condiciones_climaticas (
    id_condicion          SERIAL PRIMARY KEY,
    id_formulario         INT REFERENCES formulario(id_formulario) ON DELETE CASCADE,
    estado_clima          TEXT,
    condiciones_tierra    TEXT,
    temperatura           REAL,
    humedad_ambiente      REAL,
    viento                REAL,
    humedad_tierra        REAL
);

-- ==========================================================
--  6. DETALLES QUIMICOS
-- ==========================================================
CREATE TABLE IF NOT EXISTS detalles_quimicos (
    id_detalle        SERIAL PRIMARY KEY,
    id_formulario     INT REFERENCES formulario(id_formulario) ON DELETE CASCADE,
    tipo_quimico      TEXT,
    metodo_aplicacion TEXT
);

-- ==========================================================
--  7. FOTOGRAFIA
-- ==========================================================
CREATE TABLE IF NOT EXISTS fotografia (
    id_foto         SERIAL PRIMARY KEY,
    ruta_archivo    TEXT,
    fecha_foto      DATE,
    descripcion     TEXT,
    estado_conexion BOOLEAN DEFAULT FALSE,
    id_formulario   INT REFERENCES formulario(id_formulario) ON DELETE CASCADE,
    archivo         BYTEA
);

-- ==========================================================
--  8. CHAT IA
-- ==========================================================
CREATE TABLE IF NOT EXISTS chat_ia (
    id_chat     SERIAL PRIMARY KEY,
    id_usuario  INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    mensaje     TEXT,
    imagen      BYTEA,
    creado_en   TIMESTAMP DEFAULT NOW()
);

-- ==========================================================
--  Indexes for better query performance
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_agricultor_usuario ON agricultor(id_usuario);
CREATE INDEX IF NOT EXISTS idx_cultivo_agricultor ON cultivo(id_agricultor);
CREATE INDEX IF NOT EXISTS idx_formulario_agricultor ON formulario(id_agricultor);
CREATE INDEX IF NOT EXISTS idx_formulario_cultivo ON formulario(id_cultivo);
CREATE INDEX IF NOT EXISTS idx_condiciones_formulario ON condiciones_climaticas(id_formulario);
CREATE INDEX IF NOT EXISTS idx_quimicos_formulario ON detalles_quimicos(id_formulario);
CREATE INDEX IF NOT EXISTS idx_foto_formulario ON fotografia(id_formulario);
CREATE INDEX IF NOT EXISTS idx_chat_usuario ON chat_ia(id_usuario);

-- ==========================================================
--  End of Schema
-- ==========================================================
