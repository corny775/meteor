from fastapi import APIRouter, HTTPException
from models import DeflectionStrategy, DeflectionResult, OrbitalData
import math

router = APIRouter()

@router.post("/calculate", response_model=DeflectionResult)
async def calculate_deflection(strategy: DeflectionStrategy):
    """
    Calculate deflection parameters for a given strategy.
    """
    try:
        if strategy.type == "kinetic-impactor":
            result = calculate_kinetic_impactor(strategy)
        elif strategy.type == "gravity-tractor":
            result = calculate_gravity_tractor(strategy)
        elif strategy.type == "laser-ablation":
            result = calculate_laser_ablation(strategy)
        else:
            raise HTTPException(status_code=400, detail="Unknown deflection strategy")
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

def calculate_kinetic_impactor(strategy: DeflectionStrategy) -> DeflectionResult:
    """
    Calculate parameters for kinetic impactor mission.
    
    Momentum transfer: Δv = (β * m_impactor * v_impactor) / m_asteroid
    where β is momentum enhancement factor (typically 1.5-3.0)
    """
    # Typical impactor parameters
    impactor_mass = 1000  # kg (spacecraft mass)
    impactor_velocity = 10000  # m/s (relative velocity)
    beta = 2.0  # momentum enhancement factor
    
    # Calculate delta-v
    delta_v = (beta * impactor_mass * impactor_velocity) / strategy.asteroid_mass
    
    # Success probability based on time available
    days_needed = 180  # Typical mission duration
    success_prob = min(strategy.time_available / days_needed, 1.0) * 0.85
    
    # Number of missions required
    required_missions = max(1, int(strategy.asteroid_mass / (impactor_mass * 100)))
    
    return DeflectionResult(
        delta_v=delta_v,
        success_probability=success_prob,
        required_missions=required_missions
    )

def calculate_gravity_tractor(strategy: DeflectionStrategy) -> DeflectionResult:
    """
    Calculate parameters for gravity tractor mission.
    
    Uses gravitational attraction to slowly alter orbit.
    Requires long mission duration but very precise.
    """
    # Gravity tractor parameters
    spacecraft_mass = 20000  # kg
    distance = 100  # meters from asteroid
    G = 6.67430e-11  # gravitational constant
    
    # Gravitational force
    force = G * spacecraft_mass * strategy.asteroid_mass / (distance ** 2)
    
    # Acceleration
    acceleration = force / strategy.asteroid_mass
    
    # Delta-v over mission duration
    time_seconds = strategy.time_available * 24 * 60 * 60
    delta_v = acceleration * time_seconds
    
    # Success probability (requires long duration)
    days_needed = 365  # Requires at least 1 year
    success_prob = min(strategy.time_available / days_needed, 1.0) * 0.95
    
    return DeflectionResult(
        delta_v=delta_v,
        success_probability=success_prob,
        required_missions=1
    )

def calculate_laser_ablation(strategy: DeflectionStrategy) -> DeflectionResult:
    """
    Calculate parameters for laser ablation mission.
    
    Uses focused laser to vaporize surface material,
    creating thrust through ablation.
    """
    # Laser parameters
    laser_power = 100000  # watts
    efficiency = 0.1  # 10% efficiency
    
    # Ablation thrust
    thrust = laser_power * efficiency / (3e8)  # Approximate
    
    # Delta-v over mission duration
    time_seconds = strategy.time_available * 24 * 60 * 60
    delta_v = (thrust * time_seconds) / strategy.asteroid_mass
    
    # Success probability (experimental technology)
    days_needed = 270
    success_prob = min(strategy.time_available / days_needed, 1.0) * 0.70
    
    required_missions = max(1, int(strategy.asteroid_mass / 1e9))
    
    return DeflectionResult(
        delta_v=delta_v,
        success_probability=success_prob,
        required_missions=required_missions
    )

@router.get("/strategies")
async def list_strategies():
    """
    List all available deflection strategies with descriptions.
    """
    return {
        "strategies": [
            {
                "id": "kinetic-impactor",
                "name": "Kinetic Impactor",
                "description": "Ram the asteroid with a spacecraft to change its velocity vector",
                "effectiveness": 0.8,
                "min_time_required_days": 180,
                "technology_readiness": "proven",
                "example": "NASA DART mission (2022)"
            },
            {
                "id": "gravity-tractor",
                "name": "Gravity Tractor",
                "description": "Use spacecraft's gravitational pull to slowly alter orbit",
                "effectiveness": 0.9,
                "min_time_required_days": 365,
                "technology_readiness": "theoretical",
                "example": "None (proposed concept)"
            },
            {
                "id": "laser-ablation",
                "name": "Laser Ablation",
                "description": "Vaporize surface material with laser to create thrust",
                "effectiveness": 0.7,
                "min_time_required_days": 270,
                "technology_readiness": "experimental",
                "example": "DE-STAR concept"
            }
        ]
    }
