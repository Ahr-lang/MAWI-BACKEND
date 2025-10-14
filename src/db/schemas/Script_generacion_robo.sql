-- ==========================================================
--  ROBO DATABASE SCHEMA (corrected with user relations)
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
    user_email      VARCHAR(255)
);

-- ==========================================================
--  2. FORMULARIO 1
-- ==========================================================
CREATE TABLE IF NOT EXISTS formulario1 (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transecto         VARCHAR,
    clima             VARCHAR,
    temporada         VARCHAR,
    tipoAnimal        VARCHAR,
    nombreComun       VARCHAR,
    nombreCientifico  VARCHAR,
    numeroIndividuos  VARCHAR,
    tipoObservacion   VARCHAR,
    observaciones     VARCHAR,
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    temperaturaMaxima VARCHAR,
    humedadMaxima     VARCHAR,
    temperaturaMinima VARCHAR,
    fecha             VARCHAR,
    editado           VARCHAR,
    id_usuario        INT REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  3. FORMULARIO 2
-- ==========================================================
CREATE TABLE IF NOT EXISTS formulario2 (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    zona              VARCHAR,
    clima             VARCHAR,
    temporada         VARCHAR,
    tipoAnimal        VARCHAR,
    nombreComun       VARCHAR,
    nombreCientifico  VARCHAR,
    numeroIndividuos  VARCHAR,
    tipoObservacion   VARCHAR,
    alturaObservacion VARCHAR,
    observaciones     VARCHAR,
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    temperaturaMaxima VARCHAR,
    humedadMaxima     VARCHAR,
    temperaturaMinima VARCHAR,
    fecha             VARCHAR,
    editado           VARCHAR,
    id_usuario        INT REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  4. FORMULARIO 3
-- ==========================================================
CREATE TABLE IF NOT EXISTS formulario3 (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo            VARCHAR,
    clima             VARCHAR,
    temporada         VARCHAR,
    seguimiento       BOOLEAN,
    cambio            BOOLEAN,
    cobertura         VARCHAR,
    tipoCultivo       VARCHAR,
    disturbio         VARCHAR,
    observaciones     VARCHAR,
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    temperaturaMaxima VARCHAR,
    humedadMaxima     VARCHAR,
    temperaturaMinima VARCHAR,
    fecha             VARCHAR,
    editado           VARCHAR,
    id_usuario        INT REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  5. FORMULARIO 4
-- ==========================================================
CREATE TABLE IF NOT EXISTS formulario4 (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo              VARCHAR,
    clima               VARCHAR,
    temporada           VARCHAR,
    quad_a              VARCHAR,
    quad_b              VARCHAR,
    sub_quad            VARCHAR,
    habitoDeCrecimiento VARCHAR,
    nombreComun         VARCHAR,
    nombreCientifico    VARCHAR,
    placa               VARCHAR,
    circunferencia      VARCHAR,
    distancia           VARCHAR,
    estatura            VARCHAR,
    altura              VARCHAR,
    observaciones       VARCHAR,
    latitude            DOUBLE PRECISION,
    longitude           DOUBLE PRECISION,
    temperaturaMaxima   VARCHAR,
    humedadMaxima       VARCHAR,
    temperaturaMinima   VARCHAR,
    fecha               VARCHAR,
    editado             VARCHAR,
    id_usuario          INT REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  6. FORMULARIO 5
-- ==========================================================
CREATE TABLE IF NOT EXISTS formulario5 (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    zona              VARCHAR,
    clima             VARCHAR,
    temporada         VARCHAR,
    tipoAnimal        VARCHAR,
    nombreComun       VARCHAR,
    nombreCientifico  VARCHAR,
    numeroIndividuos  VARCHAR,
    tipoObservacion   VARCHAR,
    alturaObservacion VARCHAR,
    observaciones     VARCHAR,
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    temperaturaMaxima VARCHAR,
    humedadMaxima     VARCHAR,
    temperaturaMinima VARCHAR,
    fecha             VARCHAR,
    editado           VARCHAR,
    id_usuario        INT REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  7. FORMULARIO 6
-- ==========================================================
CREATE TABLE IF NOT EXISTS formulario6 (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo             VARCHAR,
    clima              VARCHAR,
    temporada          VARCHAR,
    zona               VARCHAR,
    nombreCamara       VARCHAR,
    placaCamara        VARCHAR,
    placaGuaya         VARCHAR,
    anchoCamino        VARCHAR,
    fechaInstalacion   VARCHAR,
    distanciaObjetivo  VARCHAR,
    alturaLente        VARCHAR,
    checklist          VARCHAR,
    observaciones      VARCHAR,
    latitude           DOUBLE PRECISION,
    longitude          DOUBLE PRECISION,
    temperaturaMaxima  VARCHAR,
    humedadMaxima      VARCHAR,
    temperaturaMinima  VARCHAR,
    fecha              VARCHAR,
    editado            VARCHAR,
    id_usuario         INT REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  8. FORMULARIO 7
-- ==========================================================
CREATE TABLE IF NOT EXISTS formulario7 (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clima              VARCHAR,
    temporada          VARCHAR,
    zona               VARCHAR,
    pluviosidad        VARCHAR,
    temperaturaMaxima  VARCHAR,
    humedadMaxima      VARCHAR,
    temperaturaMinima  VARCHAR,
    nivelQuebrada      VARCHAR,
    latitude           DOUBLE PRECISION,
    longitude          DOUBLE PRECISION,
    fecha              VARCHAR,
    editado            VARCHAR,
    id_usuario         INT REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  9. IMAGE (polymorphic link to forms)
-- ==========================================================
CREATE TABLE IF NOT EXISTS image (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    formularioId     BIGINT,
    formularioType   VARCHAR,
    imageUri         VARCHAR,
    id_usuario       INT REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  10. UNIFIED JUNCTION TABLE (UsuarioFormulario)
-- ==========================================================
CREATE TABLE IF NOT EXISTS usuarioformulario (
    usuarioId BIGINT NOT NULL,
    formId    BIGINT NOT NULL,
    formType  VARCHAR NOT NULL,
    PRIMARY KEY (usuarioId, formId, formType),
    FOREIGN KEY (usuarioId) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
--  Indexes for better query performance
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_form1_user ON formulario1(id_usuario);
CREATE INDEX IF NOT EXISTS idx_form2_user ON formulario2(id_usuario);
CREATE INDEX IF NOT EXISTS idx_form3_user ON formulario3(id_usuario);
CREATE INDEX IF NOT EXISTS idx_form4_user ON formulario4(id_usuario);
CREATE INDEX IF NOT EXISTS idx_form5_user ON formulario5(id_usuario);
CREATE INDEX IF NOT EXISTS idx_form6_user ON formulario6(id_usuario);
CREATE INDEX IF NOT EXISTS idx_form7_user ON formulario7(id_usuario);
CREATE INDEX IF NOT EXISTS idx_image_user ON image(id_usuario);
CREATE INDEX IF NOT EXISTS idx_usuarioformulario_user ON usuarioformulario(usuarioId);

-- ==========================================================
--  End of Schema
-- ==========================================================
