"""
database.py - Módulo de conexión y operaciones con MySQL
Proporciona una interfaz para todas las operaciones de base de datos
"""

import mysql.connector
from mysql.connector import Error
from contextlib import contextmanager
from datetime import date, datetime
from typing import Dict, List, Optional, Any
import logging

from app.config import DB_CONFIG

logger = logging.getLogger(__name__)


class Database:
    """Clase para manejar operaciones con MySQL"""

    def __init__(self) -> None:
        self.config = DB_CONFIG

    @contextmanager
    def get_connection(self):
        """
        Context manager para obtener conexión a la base de datos

        Yields:
            mysql.connector.connection.MySQLConnection: Conexión activa a la base de datos

        Raises:
            Error: Si ocurre un error de conexión o de base de datos
        """
        conn = None
        try:
            conn = mysql.connector.connect(**self.config)
            yield conn
            conn.commit()
        except Error as e:
            if conn:
                conn.rollback()
            logger.error(f"Error de base de datos: {e}")
            raise
        finally:
            if conn and conn.is_connected():
                conn.close()

    def crear_estudiante(
        self,
        nombre_completo: str,
        rut: str,
        path_foto: str
    ) -> Optional[Dict[str, Any]]:
        """
        Inserta un nuevo estudiante en la base de datos

        Args:
            nombre_completo: Nombre completo del estudiante
            rut: RUT del estudiante
            path_foto: Nombre del archivo de foto (ej. 'juan_perez.jpg')

        Returns:
            Dict con información del estudiante creado o None si falla

        Example:
            >>> db.crear_estudiante("Juan Pérez", "12.345.678-9", "juan_perez.jpg")
            {'id_estudiante': 1, 'nombre_completo': 'Juan Pérez', ...}
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                query = """
                INSERT INTO estudiantes (nombre_completo, rut, path_foto_referencia)
                VALUES (%s, %s, %s)
                """
                cursor.execute(query, (nombre_completo, rut, path_foto))

                # Obtener el ID del estudiante que acabamos de crear
                new_id = cursor.lastrowid
                cursor.close()

                return {
                    "id_estudiante": new_id,
                    "nombre_completo": nombre_completo,
                    "rut": rut,
                    "path_foto_referencia": path_foto
                }

        except mysql.connector.Error as e:
            # Manejar error de RUT/Llave duplicada
            if e.errno == 1062:  # Error 'Duplicate entry'
                logger.error(
                    f"Error al crear estudiante: RUT '{rut}' o nombre ya existe. "
                    f"Verifica que no esté duplicado en la base de datos."
                )
                return None
            logger.error(f"Error al crear estudiante '{nombre_completo}': {e}")
            return None

    def registrar_asistencia(
        self,
        id_estudiante: int,
        device_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Registra la asistencia de un estudiante

        Args:
            id_estudiante: ID del estudiante a registrar
            device_id: ID del dispositivo que registró la asistencia (opcional)

        Returns:
            Dict con información del resultado del registro:
            - success: bool indicando si fue exitoso
            - resultado: 'nuevo_registro', 'actualizado' o 'sin_cambios'
            - id_estudiante: ID del estudiante
            - error: mensaje de error (solo si success=False)
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)

                fecha_hoy = date.today()

                # Insertar o actualizar (si ya existe para hoy)
                query = """
                INSERT INTO asistencia (id_estudiante, fecha_registro, dispositivo_id)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    hora_ingreso = CURRENT_TIMESTAMP,
                    dispositivo_id = VALUES(dispositivo_id)
                """

                cursor.execute(query, (id_estudiante, fecha_hoy, device_id))

                # Verificar si fue INSERT o UPDATE
                if cursor.rowcount == 1:
                    resultado = "nuevo_registro"
                elif cursor.rowcount == 2:
                    resultado = "actualizado"
                else:
                    resultado = "sin_cambios"

                cursor.close()

                return {
                    "success": True,
                    "resultado": resultado,
                    "id_estudiante": id_estudiante
                }

        except Error as e:
            logger.error(
                f"Error al registrar asistencia para estudiante ID {id_estudiante}: {e}"
            )
            return {
                "success": False,
                "error": str(e)
            }

    def obtener_estudiantes(self) -> List[Dict[str, Any]]:
        """
        Obtiene la lista completa de estudiantes

        Returns:
            Lista de diccionarios con información de cada estudiante

        Example:
            >>> db.obtener_estudiantes()
            [{'id_estudiante': 1, 'nombre_completo': 'Juan Pérez', ...}, ...]
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)

                query = """
                SELECT id_estudiante, nombre_completo, rut, path_foto_referencia
                FROM estudiantes
                ORDER BY nombre_completo
                """

                cursor.execute(query)
                estudiantes = cursor.fetchall()
                cursor.close()

                return estudiantes

        except Error as e:
            logger.error(f"Error al obtener lista de estudiantes: {e}")
            return []

    def obtener_asistencia_hoy(self) -> List[Dict[str, Any]]:
        """
        Obtiene los registros de asistencia del día actual

        Returns:
            Lista de diccionarios con información de asistencia del día
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)

                fecha_hoy = date.today()

                query = """
                SELECT
                    a.id_asistencia,
                    a.id_estudiante,
                    e.nombre_completo,
                    e.rut,
                    a.hora_ingreso,
                    a.dispositivo_id
                FROM asistencia a
                INNER JOIN estudiantes e ON a.id_estudiante = e.id_estudiante
                WHERE a.fecha_registro = %s
                ORDER BY a.hora_ingreso DESC
                """

                cursor.execute(query, (fecha_hoy,))
                asistencias = cursor.fetchall()
                cursor.close()

                # Convertir datetime a string para JSON
                for asistencia in asistencias:
                    if isinstance(asistencia['hora_ingreso'], datetime):
                        asistencia['hora_ingreso'] = asistencia['hora_ingreso'].strftime('%H:%M:%S')

                return asistencias

        except Error as e:
            logger.error(f"Error al obtener asistencia del día: {e}")
            return []

    def obtener_estudiante_por_id(self, id_estudiante: int) -> Optional[Dict[str, Any]]:
        """
        Obtiene información de un estudiante específico

        Args:
            id_estudiante: ID del estudiante a buscar

        Returns:
            Dict con información del estudiante o None si no existe
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)

                query = """
                SELECT id_estudiante, nombre_completo, rut, path_foto_referencia
                FROM estudiantes
                WHERE id_estudiante = %s
                """

                cursor.execute(query, (id_estudiante,))
                estudiante = cursor.fetchone()
                cursor.close()

                return estudiante

        except Error as e:
            logger.error(f"Error al obtener estudiante con ID {id_estudiante}: {e}")
            return None

    def verificar_cooldown(
        self,
        id_estudiante: int,
        segundos: int = 300
    ) -> bool:
        """
        Verifica si un estudiante ya fue registrado recientemente

        Args:
            id_estudiante: ID del estudiante a verificar
            segundos: Tiempo de cooldown en segundos (default: 300 = 5 minutos)

        Returns:
            True si el estudiante está en cooldown, False si puede registrarse
        """
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor(dictionary=True)

                query = """
                SELECT hora_ingreso
                FROM asistencia
                WHERE id_estudiante = %s
                  AND fecha_registro = CURDATE()
                  AND hora_ingreso > DATE_SUB(NOW(), INTERVAL %s SECOND)
                LIMIT 1
                """

                cursor.execute(query, (id_estudiante, segundos))
                resultado = cursor.fetchone()
                cursor.close()

                return resultado is not None

        except Error as e:
            logger.error(f"Error al verificar cooldown para estudiante ID {id_estudiante}: {e}")
            return False


# Instancia global
db = Database()
