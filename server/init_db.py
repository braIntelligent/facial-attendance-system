#!/usr/bin/env python3
"""
init_db.py - Script para inicializar la base de datos
Ejecutar después de levantar MySQL con docker-compose
"""

import sys
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def init_database():
    """Inicializa la base de datos ejecutando schema.sql"""

    print("🔧 Inicializando base de datos...")
    print("-" * 50)

    # Configuración de conexión (sin especificar la BD primero)
    config = {
        "host": os.getenv("DB_HOST", "localhost"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASS"),
        "port": int(os.getenv("DB_PORT", 3306))
    }

    db_name = os.getenv("DB_NAME", "asistencia_db")

    try:
        # Conectar a MySQL (sin BD específica)
        print(f"📡 Conectando a MySQL en {config['host']}:{config['port']}...")
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        # Crear base de datos si no existe
        print(f"🗄️  Creando base de datos '{db_name}'...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"✅ Base de datos '{db_name}' lista")

        # Seleccionar la base de datos
        cursor.execute(f"USE {db_name}")

        # Leer y ejecutar schema.sql
        print("📄 Ejecutando schema.sql...")
        with open("schema.sql", "r", encoding="utf-8") as f:
            schema_sql = f.read()

        # Ejecutar cada statement (separados por ;)
        statements = schema_sql.split(';')
        for statement in statements:
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                except Error as e:
                    # Ignorar errores de "tabla ya existe"
                    if "already exists" not in str(e):
                        print(f"⚠️  Advertencia: {e}")

        conn.commit()
        print("✅ Schema ejecutado correctamente")

        # Verificar tablas creadas
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"\n📊 Tablas en la base de datos:")
        for table in tables:
            print(f"   - {table[0]}")

        cursor.close()
        conn.close()

        print("\n" + "=" * 50)
        print("✅ Base de datos inicializada exitosamente")
        print("=" * 50)
        print("\n💡 Próximos pasos:")
        print("   1. python -m app.main  # Iniciar servidor")
        print("   2. Agregar estudiantes desde el dashboard web")
        print("   3. Los encodings se generarán automáticamente")

        return True

    except Error as e:
        print(f"\n❌ Error de MySQL: {e}")
        print("\n💡 Asegúrate de que:")
        print("   1. Docker está corriendo: docker ps")
        print("   2. MySQL está activo: docker-compose up -d")
        print("   3. Las credenciales en .env son correctas")
        return False

    except FileNotFoundError:
        print("\n❌ Error: No se encuentra 'schema.sql'")
        print("   Asegúrate de ejecutar este script desde la carpeta 'server/'")
        return False

    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        return False


if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
