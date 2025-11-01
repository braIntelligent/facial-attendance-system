"""
Modelos Pydantic para Asistencia
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class AttendanceRecord(BaseModel):
    """Modelo para registro de asistencia"""

    id_estudiante: int = Field(..., description="ID del estudiante")
    device_id: Optional[str] = Field(None, description="ID del dispositivo (aula)")


class AttendanceResponse(BaseModel):
    """Modelo de respuesta para asistencia"""

    id_asistencia: int
    id_estudiante: int
    nombre_completo: str
    rut: Optional[str]
    hora_ingreso: str
    dispositivo_id: Optional[str]

    class Config:
        from_attributes = True
