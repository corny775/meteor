import math
from typing import Optional, Tuple

class ImpactSimulator:
    """
    Scientific impact simulation calculations based on:
    - Collins et al. (2005) crater scaling laws
    - Holsapple (1993) impact cratering equations
    - Schultz & Gault (1975) seismic effects
    """
    
    # Physical constants
    EARTH_RADIUS = 6371  # km
    GRAVITY = 9.81  # m/s²
    TNT_JOULES = 4.184e9  # joules per kiloton
    WATER_DEPTH_AVG = 3688  # meters
    
    @staticmethod
    def calculate_impact_energy(size: float, density: float, velocity: float) -> Tuple[float, float]:
        """
        Calculate impact energy using kinetic energy formula.
        E = 0.5 * m * v²
        
        Args:
            size: Asteroid diameter in meters
            density: Density in kg/m³
            velocity: Velocity in km/s
            
        Returns:
            Tuple of (energy in joules, energy in megatons TNT)
        """
        radius = size / 2
        volume = (4 / 3) * math.pi * (radius ** 3)
        mass = volume * density
        velocity_ms = velocity * 1000  # Convert to m/s
        
        energy_joules = 0.5 * mass * (velocity_ms ** 2)
        megatons_tnt = energy_joules / (ImpactSimulator.TNT_JOULES * 1000)
        
        return energy_joules, megatons_tnt
    
    @staticmethod
    def calculate_crater_size(energy_mt: float, is_water: bool) -> Tuple[float, float]:
        """
        Calculate crater dimensions using scaling laws.
        
        Args:
            energy_mt: Impact energy in megatons TNT
            is_water: Whether impact is on water
            
        Returns:
            Tuple of (diameter in meters, depth in meters)
        """
        # Scaling constant (higher for water impacts)
        K = 1.8 if is_water else 1.2
        
        # Scaling law: D = K * E^(1/3.4)
        diameter = K * (energy_mt ** (1 / 3.4)) * 1000  # Convert to meters
        depth = diameter / 5  # Typical depth-to-diameter ratio
        
        return diameter, depth
    
    @staticmethod
    def calculate_seismic_effects(energy_joules: float) -> Tuple[float, float]:
        """
        Estimate seismic magnitude and affected radius.
        
        Args:
            energy_joules: Impact energy in joules
            
        Returns:
            Tuple of (Richter magnitude, affected radius in km)
        """
        # Richter magnitude formula
        magnitude = (2 / 3) * (math.log10(energy_joules) - 4.8)
        magnitude = min(magnitude, 12)  # Cap at maximum possible
        
        # Affected radius where shaking is felt (Modified Mercalli intensity > III)
        radius = 10 ** (0.5 * magnitude - 0.8)
        
        return magnitude, radius
    
    @staticmethod
    def calculate_tsunami_effects(energy_mt: float) -> Optional[Tuple[float, float]]:
        """
        Calculate tsunami characteristics for water impacts.
        
        Args:
            energy_mt: Impact energy in megatons TNT
            
        Returns:
            Tuple of (wave height in meters, affected radius in km) or None
        """
        # Tsunami wave height (meters)
        wave_height = (energy_mt / 1000) ** 0.25 * 10
        wave_height = min(wave_height, 500)  # Physical limit
        
        # Affected radius (km)
        affected_radius = math.sqrt(energy_mt) * 15
        affected_radius = min(affected_radius, 10000)  # Pacific Ocean scale
        
        return wave_height, affected_radius
    
    @staticmethod
    def calculate_atmospheric_effects(energy_mt: float) -> Tuple[float, float, float]:
        """
        Calculate atmospheric and thermal effects.
        
        Args:
            energy_mt: Impact energy in megatons TNT
            
        Returns:
            Tuple of (fireball radius, thermal radiation radius, overpressure radius) in km
        """
        # Fireball radius (km)
        fireball_radius = (energy_mt ** 0.4) * 0.28
        
        # Thermal radiation radius (3rd degree burns, km)
        thermal_radiation = (energy_mt ** 0.41) * 2.2
        
        # Overpressure radius (5 psi, structural damage, km)
        overpressure = (energy_mt ** 0.33) * 2.2
        
        return fireball_radius, thermal_radiation, overpressure
    
    @staticmethod
    def estimate_casualties(overpressure_radius: float, population_density: float = 50) -> Tuple[int, int]:
        """
        Estimate casualties based on affected area.
        
        Args:
            overpressure_radius: Radius of overpressure zone in km
            population_density: Population per km² (default: 50)
            
        Returns:
            Tuple of (estimated casualties, affected population)
        """
        affected_area = math.pi * (overpressure_radius ** 2)
        affected_population = int(affected_area * population_density)
        casualty_rate = 0.5  # 50% casualty rate in affected zone
        
        estimated_casualties = int(affected_population * casualty_rate)
        
        return estimated_casualties, affected_population
