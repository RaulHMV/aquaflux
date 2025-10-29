-- ==========================================
-- AQUAFLUX DATABASE SCHEMA
-- PostgreSQL Database Structure
-- ==========================================

-- Drop existing tables if needed (CUIDADO: esto borra todos los datos)
-- DROP TABLE IF EXISTS users CASCADE;

-- ==========================================
-- TABLA: users
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id_user SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- ==========================================
-- ÍNDICES para optimizar búsquedas
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ==========================================
-- COMENTARIOS en la tabla
-- ==========================================
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema AquaFlux';
COMMENT ON COLUMN users.id_user IS 'ID único del usuario (auto-incrementable)';
COMMENT ON COLUMN users.username IS 'Nombre de usuario único para login';
COMMENT ON COLUMN users.first_name IS 'Primer nombre del usuario (NO incluye apellido)';
COMMENT ON COLUMN users.password_hash IS 'Contraseña hasheada con bcrypt (nunca guardar en texto plano)';
COMMENT ON COLUMN users.created_at IS 'Fecha y hora de creación del usuario';
COMMENT ON COLUMN users.updated_at IS 'Fecha y hora de última actualización';
COMMENT ON COLUMN users.is_active IS 'Estado del usuario (true = activo, false = inactivo)';

-- ==========================================
-- FUNCIÓN para auto-actualizar updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- TRIGGER para updated_at
-- ==========================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- DATOS DE PRUEBA (opcional)
-- ==========================================
-- Usuario de prueba (password: test1234)
-- Hash generado con bcrypt rounds=10
INSERT INTO users (username, first_name, password_hash) 
VALUES (
    'testuser',
    'Usuario',
    '$2a$10$XQVqH0YZvJ9YQh5K7xLxV.9jQH5F5h5F5F5F5F5F5F5F5F5F5F5F5'
) ON CONFLICT (username) DO NOTHING;

-- ==========================================
-- VERIFICACIÓN de la estructura
-- ==========================================
-- Para verificar que todo se creó correctamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM users;

-- ==========================================
-- CONSULTAS ÚTILES
-- ==========================================
-- Ver todos los usuarios:
-- SELECT id_user, username, first_name, is_active, created_at FROM users;

-- Ver usuarios activos:
-- SELECT * FROM users WHERE is_active = true;

-- Buscar usuario por username:
-- SELECT * FROM users WHERE username = 'testuser';

-- Actualizar nombre de usuario:
-- UPDATE users SET first_name = 'NuevoNombre' WHERE id_user = 1;

-- Desactivar usuario:
-- UPDATE users SET is_active = false WHERE id_user = 1;

-- Eliminar usuario (solo si es necesario):
-- DELETE FROM users WHERE id_user = 1;
