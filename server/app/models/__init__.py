"""
Modelos Pydantic para validación de datos
"""

from .student import StudentCreate, StudentResponse
from .attendance import AttendanceRecord, AttendanceResponse
from .frame import FrameRequest, FrameResponse

__all__ = [
    "StudentCreate",
    "StudentResponse",
    "AttendanceRecord",
    "AttendanceResponse",
    "FrameRequest",
    "FrameResponse",
]
