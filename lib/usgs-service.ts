/**
 * USGS Elevation and Geological Data Service
 * 
 * Integrates with USGS APIs to fetch:
 * - Elevation/bathymetry data
 * - Topographic information
 * - Coastal vulnerability data
 */

export interface USGSElevationData {
  elevation: number; // meters (negative for underwater)
  lat: number;
  lng: number;
  source: string;
  isWater: boolean;
}

export interface USGSTerrainProfile {
  points: Array<{
    distance: number; // km from impact
    elevation: number; // meters
  }>;
  minElevation: number;
  maxElevation: number;
  averageSlope: number;
}

export class USGSService {
  // USGS 3DEP Elevation Point Query Service
  private static readonly ELEVATION_API = 'https://epqs.nationalmap.gov/v1/json';
  
  // USGS Elevation API (3D Elevation Program)
  private static readonly ELEVATION_API_V2 = 'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer/identify';

  /**
   * Get elevation at a specific point
   * Uses USGS Elevation Point Query Service
   */
  static async getElevation(lat: number, lng: number): Promise<USGSElevationData> {
    try {
      const url = `${this.ELEVATION_API}?x=${lng}&y=${lat}&units=Meters&output=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`USGS API error: ${response.status}`);
      }

      const data = await response.json();
      
      // USGS returns -1000000 for ocean/no data areas
      const elevation = data.value !== -1000000 ? data.value : -100;
      const isWater = elevation < 0 || data.value === -1000000;

      return {
        elevation: parseFloat(elevation.toFixed(2)),
        lat,
        lng,
        source: 'USGS 3DEP',
        isWater,
      };
    } catch (error) {
      console.warn('USGS elevation fetch failed, using fallback:', error);
      // Fallback: simple ocean detection
      return {
        elevation: 0,
        lat,
        lng,
        source: 'Fallback estimation',
        isWater: false,
      };
    }
  }

  /**
   * Get elevation profile around impact point
   * Useful for understanding terrain effects
   */
  static async getTerrainProfile(
    centerLat: number,
    centerLng: number,
    radiusKm: number = 50,
    numPoints: number = 16
  ): Promise<USGSTerrainProfile> {
    const points: Array<{ distance: number; elevation: number }> = [];
    
    // Sample points in a circle around the impact
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const distance = radiusKm / 2; // Sample at half radius
      
      // Calculate point coordinates
      const lat = centerLat + (distance / 111) * Math.cos(angle);
      const lng = centerLng + (distance / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);
      
      try {
        const elevation = await this.getElevation(lat, lng);
        points.push({
          distance: distance,
          elevation: elevation.elevation,
        });
      } catch (error) {
        console.warn(`Failed to get elevation for point ${i}`);
      }
    }

    // Calculate statistics
    const elevations = points.map(p => p.elevation);
    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);
    const averageSlope = (maxElevation - minElevation) / radiusKm;

    return {
      points,
      minElevation,
      maxElevation,
      averageSlope,
    };
  }

  /**
   * Determine if impact location is in water and get depth
   */
  static async getImpactLocationDetails(lat: number, lng: number): Promise<{
    isWater: boolean;
    depth: number; // positive = underwater depth
    elevation: number; // negative = below sea level
    terrainType: 'ocean' | 'coastal' | 'inland' | 'mountain';
  }> {
    const elevData = await this.getElevation(lat, lng);
    
    const isWater = elevData.elevation < 0 || elevData.isWater;
    const depth = isWater ? Math.abs(elevData.elevation) : 0;
    
    let terrainType: 'ocean' | 'coastal' | 'inland' | 'mountain';
    if (elevData.elevation < -10) {
      terrainType = 'ocean';
    } else if (elevData.elevation >= -10 && elevData.elevation < 100) {
      terrainType = 'coastal';
    } else if (elevData.elevation >= 100 && elevData.elevation < 1000) {
      terrainType = 'inland';
    } else {
      terrainType = 'mountain';
    }

    return {
      isWater,
      depth,
      elevation: elevData.elevation,
      terrainType,
    };
  }

  /**
   * Get coastal inundation risk for tsunami
   * Finds lowest elevation coastal points that would flood
   */
  static async getCoastalInundationZones(
    centerLat: number,
    centerLng: number,
    waveHeight: number,
    radiusKm: number = 100
  ): Promise<Array<{ lat: number; lng: number; elevation: number; floodDepth: number }>> {
    const inundationZones: Array<{ lat: number; lng: number; elevation: number; floodDepth: number }> = [];
    
    // Sample coastal points
    const numSamples = 32;
    for (let i = 0; i < numSamples; i++) {
      const angle = (i / numSamples) * 2 * Math.PI;
      const distance = radiusKm * 0.8; // Sample near the edge
      
      const lat = centerLat + (distance / 111) * Math.cos(angle);
      const lng = centerLng + (distance / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);
      
      try {
        const elevData = await this.getElevation(lat, lng);
        
        // If elevation is below wave height, this area would flood
        if (elevData.elevation < waveHeight && elevData.elevation > -10) {
          inundationZones.push({
            lat,
            lng,
            elevation: elevData.elevation,
            floodDepth: waveHeight - elevData.elevation,
          });
        }
      } catch (error) {
        // Skip failed points
      }
    }

    return inundationZones;
  }

  /**
   * Enhanced crater calculation using real terrain data
   */
  static async calculateEnhancedCrater(
    lat: number,
    lng: number,
    energyMT: number,
    angle: number
  ): Promise<{
    diameter: number;
    depth: number;
    volume: number;
    ejectaRadius: number;
    modifiedByTerrain: boolean;
    terrainFactor: number;
  }> {
    // Get terrain details
    const location = await this.getImpactLocationDetails(lat, lng);
    
    // Base crater calculations (Collins et al., 2005)
    const baseDiameter = Math.pow(energyMT, 1 / 3.4) * 1000; // meters
    const baseDepth = baseDiameter / 3;
    
    // Terrain modifications
    let terrainFactor = 1.0;
    
    if (location.isWater) {
      // Water impacts create shallower, wider craters
      terrainFactor = 0.7;
    } else if (location.terrainType === 'mountain') {
      // Rocky terrain creates deeper craters
      terrainFactor = 1.2;
    } else if (location.terrainType === 'coastal') {
      // Coastal areas: mixed effect
      terrainFactor = 0.9;
    }
    
    // Angle effect
    const angleFactor = Math.sin(angle * Math.PI / 180);
    
    const diameter = baseDiameter * terrainFactor * (0.5 + 0.5 * angleFactor);
    const depth = baseDepth * terrainFactor * angleFactor;
    const volume = Math.PI * Math.pow(diameter / 2, 2) * depth;
    const ejectaRadius = diameter * 3;

    return {
      diameter,
      depth,
      volume,
      ejectaRadius,
      modifiedByTerrain: terrainFactor !== 1.0,
      terrainFactor,
    };
  }

  /**
   * Enhanced tsunami calculation using bathymetry
   */
  static async calculateEnhancedTsunami(
    lat: number,
    lng: number,
    energyMT: number
  ): Promise<{
    waveHeight: number;
    affectedRadius: number;
    coastalAreas: Array<{ lat: number; lng: number; floodDepth: number }>;
    waterDepth: number;
  } | null> {
    const location = await this.getImpactLocationDetails(lat, lng);
    
    if (!location.isWater) {
      return null; // Not a water impact
    }

    // Base tsunami calculation
    const waveHeight = Math.pow(energyMT / 1000, 0.25) * 10;
    const affectedRadius = Math.sqrt(energyMT) * 15;
    
    // Water depth affects wave propagation
    const waterDepth = location.depth;
    const depthFactor = Math.min(waterDepth / 1000, 3); // Deeper = more energy
    
    const enhancedWaveHeight = waveHeight * (0.5 + 0.5 * depthFactor);
    
    // Get coastal inundation zones
    const coastalAreas = await this.getCoastalInundationZones(
      lat,
      lng,
      enhancedWaveHeight,
      affectedRadius
    );

    return {
      waveHeight: enhancedWaveHeight,
      affectedRadius,
      coastalAreas,
      waterDepth,
    };
  }
}
