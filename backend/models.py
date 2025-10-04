from pydantic import BaseModel, Field
from typing import Optional, Dict

class ImpactLocation(BaseModel):
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lng: float = Field(..., ge=-180, le=180, description="Longitude")

class ImpactParameters(BaseModel):
    size: float = Field(..., gt=0, description="Asteroid size in meters")
    density: float = Field(..., gt=0, description="Density in kg/m³")
    velocity: float = Field(..., gt=0, description="Velocity in km/s")
    angle: float = Field(..., ge=0, le=90, description="Entry angle in degrees")
    impact_location: ImpactLocation
    is_water_impact: Optional[bool] = False

class EnergyResult(BaseModel):
    joules: float
    megatons_tnt: float

class CraterResult(BaseModel):
    diameter: float
    depth: float

class SeismicResult(BaseModel):
    magnitude: float
    radius: float

class TsunamiResult(BaseModel):
    wave_height: float
    affected_radius: float

class AtmosphericResult(BaseModel):
    fireball_radius: float
    thermal_radiation: float
    overpressure: float

class CasualtiesResult(BaseModel):
    estimated: int
    affected_population: int

class ImpactResults(BaseModel):
    energy: EnergyResult
    crater: CraterResult
    seismic: SeismicResult
    tsunami: Optional[TsunamiResult] = None
    atmospheric: AtmosphericResult
    casualties: Optional[CasualtiesResult] = None

class OrbitalData(BaseModel):
    a: float  # semi-major axis (AU)
    e: float  # eccentricity
    i: float  # inclination (degrees)
    omega: float  # argument of periapsis (degrees)
    Omega: float  # longitude of ascending node (degrees)
    M: float  # mean anomaly (degrees)

class DeflectionStrategy(BaseModel):
    type: str = Field(..., description="Type: kinetic-impactor, gravity-tractor, or laser-ablation")
    time_available: float = Field(..., description="Time available in days")
    asteroid_mass: float = Field(..., description="Asteroid mass in kg")

class DeflectionResult(BaseModel):
    delta_v: float = Field(..., description="Velocity change in m/s")
    success_probability: float = Field(..., description="Probability of success (0-1)")
    required_missions: int = Field(..., description="Number of missions required")
    new_orbital_data: Optional[OrbitalData] = None
