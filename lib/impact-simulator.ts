import { ImpactParameters, ImpactResults } from '@/types';
import { USGSService } from './usgs-service';
import { PopulationService } from './population-service';

export class ImpactSimulator {
  // Physical constants
  private static readonly EARTH_RADIUS = 6371; // km
  private static readonly GRAVITY = 9.81; // m/s²
  private static readonly TNT_JOULES = 4.184e9; // joules per kiloton
  private static readonly WATER_DEPTH_AVG = 3688; // meters

  /**
   * Calculate impact energy using kinetic energy formula
   * E = 0.5 * m * v²
   */
  static calculateImpactEnergy(params: ImpactParameters): {
    joules: number;
    megatonsTNT: number;
  } {
    const radius = params.size / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * params.density;
    const velocityMS = params.velocity * 1000;
    const energyJoules = 0.5 * mass * Math.pow(velocityMS, 2);
    const megatonsTNT = energyJoules / (this.TNT_JOULES * 1000);

    return {
      joules: energyJoules,
      megatonsTNT,
    };
  }

  /**
   * Calculate crater dimensions using scaling laws
   * Based on Collins et al. (2005) and Holsapple (1993)
   */
  static calculateCraterSize(params: ImpactParameters): {
    diameter: number;
    depth: number;
  } {
    const energy = this.calculateImpactEnergy(params);
    const energyMT = energy.megatonsTNT;

    // Scaling law: D = K * E^(1/3.4)
    const K = params.isWaterImpact ? 1.8 : 1.2;
    const diameter = K * Math.pow(energyMT, 1 / 3.4) * 1000;
    const depth = diameter / 5;

    return {
      diameter,
      depth,
    };
  }

  /**
   * Estimate seismic magnitude and affected radius
   * Based on Schultz & Gault (1975)
   */
  static calculateSeismicEffects(params: ImpactParameters): {
    magnitude: number;
    radius: number;
  } {
    const energy = this.calculateImpactEnergy(params);
    const energyJoules = energy.joules;

    // Richter magnitude formula
    const magnitude = (2 / 3) * (Math.log10(energyJoules) - 4.8);

    // Affected radius (km) where shaking is felt
    const radius = Math.pow(10, 0.5 * magnitude - 0.8);

    return {
      magnitude: Math.min(magnitude, 12),
      radius,
    };
  }

  /**
   * Calculate tsunami characteristics for water impacts
   */
  static calculateTsunamiEffects(params: ImpactParameters): {
    waveHeight: number;
    affectedRadius: number;
  } | null {
    if (!params.isWaterImpact) return null;

    const energy = this.calculateImpactEnergy(params);
    const energyMT = energy.megatonsTNT;

    // Tsunami wave height (meters)
    const waveHeight = Math.pow(energyMT / 1000, 0.25) * 10;

    // Affected radius (km)
    const affectedRadius = Math.sqrt(energyMT) * 15;

    return {
      waveHeight: Math.min(waveHeight, 500),
      affectedRadius: Math.min(affectedRadius, 10000),
    };
  }

  /**
   * Calculate atmospheric effects
   */
  static calculateAtmosphericEffects(params: ImpactParameters): {
    fireballRadius: number;
    thermalRadiation: number;
    overpressure: number;
  } {
    const energy = this.calculateImpactEnergy(params);
    const energyMT = energy.megatonsTNT;

    // Fireball radius (km)
    const fireballRadius = Math.pow(energyMT, 0.4) * 0.28;

    // Thermal radiation radius (3rd degree burns, km)
    const thermalRadiation = Math.pow(energyMT, 0.41) * 2.2;

    // Overpressure radius (5 psi, structural damage, km)
    const overpressure = Math.pow(energyMT, 0.33) * 2.2;

    return {
      fireballRadius,
      thermalRadiation,
      overpressure,
    };
  }

  /**
   * Complete impact simulation
   */
  /**
   * Main simulation function with USGS terrain enhancement
   */
  static async simulate(params: ImpactParameters): Promise<ImpactResults> {
    // Use targetLatitude/targetLongitude or fall back to impactLocation
    const lat = params.targetLatitude ?? params.impactLocation.lat;
    const lng = params.targetLongitude ?? params.impactLocation.lng;
    
    // Get terrain data from USGS
    const terrainData = await USGSService.getImpactLocationDetails(lat, lng);

    // Get population density data
    const populationData = await PopulationService.getPopulationDensity(lat, lng);

    // Update parameters with terrain information
    const enhancedParams = {
      ...params,
      isWaterImpact: terrainData.isWater,
    };

    // Calculate base results
    const energy = this.calculateImpactEnergy(enhancedParams);
    
    // Use USGS-enhanced crater calculation
    const crater = await USGSService.calculateEnhancedCrater(
      lat,
      lng,
      energy.megatonsTNT,
      params.angle
    );
    
    const seismic = this.calculateSeismicEffects(enhancedParams);
    const atmospheric = this.calculateAtmosphericEffects(enhancedParams);
    
    // Use USGS-enhanced tsunami calculation if water impact
    let tsunami = null;
    if (terrainData.isWater || terrainData.terrainType === 'coastal') {
      tsunami = await USGSService.calculateEnhancedTsunami(
        lat,
        lng,
        energy.megatonsTNT
      );
    }

    // Calculate casualties using population data
    const casualties = PopulationService.calculateCasualties(
      populationData,
      atmospheric.fireballRadius,
      atmospheric.overpressure,
      atmospheric.thermalRadiation
    );

    return {
      energy,
      crater,
      seismic,
      tsunami: tsunami || undefined,
      atmospheric,
      casualties,
      terrainType: terrainData.terrainType,
      elevation: terrainData.elevation,
      populationDensity: populationData.density,
      nearestCity: populationData.nearestCity,
    };
  }

  /**
   * Estimate casualties based on impact location and effects
   */
  static estimateCasualties(
    results: ImpactResults,
    populationDensity: number = 50
  ): {
    estimated: number;
    affectedPopulation: number;
  } {
    const affectedArea = Math.PI * Math.pow(results.atmospheric.overpressure, 2);
    const affectedPopulation = affectedArea * populationDensity;
    const casualtyRate = 0.5; // 50% casualty rate in affected zone

    return {
      estimated: Math.round(affectedPopulation * casualtyRate),
      affectedPopulation: Math.round(affectedPopulation),
    };
  }
}
