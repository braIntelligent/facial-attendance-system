CREATE TABLE estudiantes (
  id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(100) NOT NULL,
  rut VARCHAR(20) UNIQUE,
  path_foto_referencia VARCHAR(255) NOT NULL
);

CREATE TABLE asistencia (
  id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
  id_estudiante INT NOT NULL,
  fecha_registro DATE NOT NULL,
  hora_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dispositivo_id VARCHAR(50),
  
  FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
  -- Esto evita duplicados para el mismo estudiante el mismo día
  UNIQUE KEY (id_estudiante, fecha_registro)
);