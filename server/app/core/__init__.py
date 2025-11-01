"""
Módulos core del sistema
"""

from .database import db
from .face_recognition import face_processor

__all__ = ["db", "face_processor"]
