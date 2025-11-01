"""
Módulos core del sistema
"""

from .database import db
from .face_recognition import face_recognition_processor

# Alias para compatibilidad
face_processor = face_recognition_processor

__all__ = ["db", "face_processor", "face_recognition_processor"]
