// ============================================
// SCRIPT DE INICIALIZACIÓN
// Sistema de Posts y Comentarios
// ============================================

// 1. CONSTRAINTS DE LLAVE (UNICIDAD Y EXISTENCIA)
// -----------------------------------------

// Usuario: idu 
CREATE CONSTRAINT usuario_id_key IF NOT EXISTS
FOR (u:USUARIO) 
REQUIRE u.idu IS NODE KEY;

// Post: idp 
CREATE CONSTRAINT post_id_key IF NOT EXISTS
FOR (p:POST) 
REQUIRE p.idp IS NODE KEY;

// Comentario: llave compuesta única (consec + idp)
// idp viene de post, por la relación fuerte
CREATE CONSTRAINT comentario_compuesto_key IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE (c.idp, c.consec) IS NODE KEY;

// 2. CONSTRAINTS DE EXISTENCIA (NOT NULL)
// -----------------------------------------

// USUARIO
CREATE CONSTRAINT usuario_nombre_exists IF NOT EXISTS
FOR (u:USUARIO) 
REQUIRE u.nombre IS NOT NULL;

// POST
CREATE CONSTRAINT post_contenido_exists IF NOT EXISTS
FOR (p:POST) 
REQUIRE p.contenido IS NOT NULL;

// COMENTARIO
CREATE CONSTRAINT comentario_contenidoCom_exists IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.contenidoCom IS NOT NULL;

CREATE CONSTRAINT comentario_fechorCom_exists IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.fechorCom IS NOT NULL;

CREATE CONSTRAINT comentario_likeNotLike_exists IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.likeNotLike IS NOT NULL;

// 3. CONSTRAINTS DE TIPO
// -----------------------------------------

// USUARIO
CREATE CONSTRAINT usuario_nombre_type IF NOT EXISTS
FOR (u:USUARIO) 
REQUIRE u.nombre IS :: STRING;

// POST
CREATE CONSTRAINT post_idp_type IF NOT EXISTS
FOR (p:POST) 
REQUIRE p.idp IS :: INTEGER;

CREATE CONSTRAINT post_contenido_type IF NOT EXISTS
FOR (p:POST) 
REQUIRE p.contenido IS :: STRING;

// COMENTARIO
CREATE CONSTRAINT comentario_idp_type IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.idp IS :: INTEGER;

CREATE CONSTRAINT comentario_consec_type IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.consec IS :: INTEGER;

CREATE CONSTRAINT comentario_contenidoCom_type IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.contenidoCom IS :: STRING;

CREATE CONSTRAINT comentario_fechorCom_type IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.fechorCom IS :: LOCAL DATETIME;

CREATE CONSTRAINT comentario_fechorAut_type IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.fechorAut IS :: LOCAL DATETIME;

CREATE CONSTRAINT comentario_likeNotLike_type IF NOT EXISTS
FOR (c:COMENTARIO) 
REQUIRE c.likeNotLike IS :: BOOLEAN;
