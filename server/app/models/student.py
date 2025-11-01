"""
Modelos Pydantic para Estudiantes
"""

from typing import Optional
from pydantic import BaseModel, Field, validator
import re


class StudentCreate(BaseModel):
    """Modelo para crear un nuevo estudiante"""

    nombre_completo: str = Field(
        ..., min_length=3, max_length=100, description="Nombre completo del estudiante"
    )
    rut: Optional[str] = Field(
        None, description="RUT del estudiante (formato: 12.345.678-9)"
    )

    @validator("nombre_completo")
    def validar_nombre(cls, v):
        """Valida que el nombre solo contenga caracteres válidos"""
        if not re.match(r"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", v):
            raise ValueError(
                "El nombre solo puede contener letras, espacios y acentos"
            )
        return v.strip().title()

    @validator("rut")
    def validar_rut(cls, v):
        """Valida formato de RUT chileno (opcional)"""
        if v is None:
            return v

        # Limpiar espacios
        v = v.strip()

        # Validar formato básico
        if not re.match(r"^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$", v):
            raise ValueError(
                "Formato de RUT inválido. Use: 12.345.678-9 o 1.234.567-K"
            )

        return v


class StudentResponse(BaseModel):
    """Modelo de respuesta para estudiante"""

    id_estudiante: int
    nombre_completo: str
    rut: Optional[str]
    path_foto_referencia: str

    class Config:
        from_attributes = True  # Permite crear desde objetos ORM
