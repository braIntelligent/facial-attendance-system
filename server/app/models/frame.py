"""
Modelos Pydantic para procesamiento de frames
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator
import base64


class FrameRequest(BaseModel):
    """Modelo para recibir frames desde Raspberry Pi"""

    image: str = Field(..., description="Imagen en formato base64")
    device_id: str = Field(..., description="ID del dispositivo que envía el frame")

    @validator("image")
    def validar_base64(cls, v):
        """Valida que la imagen sea base64 válido"""
        try:
            base64.b64decode(v)
        except Exception:
            raise ValueError("La imagen debe estar en formato base64 válido")
        return v


class FaceMatch(BaseModel):
    """Información de coincidencia facial"""

    id: int
    name: str
    confidence: float
    location: tuple


class FrameResponse(BaseModel):
    """Modelo de respuesta para procesamiento de frame"""

    status: str = Field(
        ...,
        description="Estado: 'recognized', 'unknown', 'no_face', 'error'",
    )
    nombre: Optional[str] = None
    id_estudiante: Optional[int] = None
    confidence: Optional[float] = None
    registrado: Optional[bool] = None
    mensaje: Optional[str] = None
    faces_found: Optional[int] = None
