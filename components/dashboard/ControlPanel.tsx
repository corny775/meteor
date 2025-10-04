'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { ImpactSimulator } from '@/lib/impact-simulator';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function ControlPanel() {
  const {
    impactParameters,
    setImpactParameters,
    setSimulationResults,
    setIsSimulating,
    selectedAsteroid,
  } = useAppStore();

  // Auto-populate parameters when asteroid is selected
  useEffect(() => {
    if (selectedAsteroid) {
      // Get asteroid's actual data
      const diameterKm = selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max;
      const diameterMeters = Math.round(diameterKm * 1000); // Convert to meters
      
      // Get velocity from close approach data
      const velocityKmS = selectedAsteroid.close_approach_data[0]
        ? parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second)
        : 20;

      // Estimate density based on asteroid type (we'll use a reasonable default)
      // Rocky asteroids: ~2500-3500 kg/m³, Metallic: ~7000-8000 kg/m³
      // We'll use 3000 as a reasonable middle ground for unknown types
      const density = 3000;

      // Most asteroids impact at shallow angles (45° is statistically common)
      const angle = 45;

      setImpactParameters({
        asteroidId: selectedAsteroid.id,
        size: Math.max(10, Math.min(10000, diameterMeters)), // Clamp to slider range
        density: density,
        velocity: Math.max(5, Math.min(72, Math.round(velocityKmS))), // Clamp to slider range
        angle: angle,
        impactLocation: impactParameters.impactLocation, // Keep existing location
        isWaterImpact: impactParameters.isWaterImpact,
      });
    }
  }, [selectedAsteroid?.id]); // Only trigger when asteroid ID changes

  const handleSimulate = async () => {
    setIsSimulating(true);
    
    try {
      // Add targetLatitude and targetLongitude from impactLocation
      const paramsWithCoords = {
        ...impactParameters,
        targetLatitude: impactParameters.impactLocation.lat,
        targetLongitude: impactParameters.impactLocation.lng,
      };
      
      const results = await ImpactSimulator.simulate(paramsWithCoords);
      setSimulationResults(results);
    } catch (error) {
      console.error('Simulation error:', error);
      // Fallback to basic simulation if USGS fails
      const results = await ImpactSimulator.simulate({
        ...impactParameters,
        targetLatitude: impactParameters.impactLocation.lat,
        targetLongitude: impactParameters.impactLocation.lng,
      });
      setSimulationResults(results);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setImpactParameters({
      size: 500,
      density: 3000,
      velocity: 20,
      angle: 45,
      impactLocation: { lat: 40.7128, lng: -74.006 },
      isWaterImpact: false,
    });
    setSimulationResults(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-space-cyan">Impact Parameters</CardTitle>
        {selectedAsteroid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 p-3 rounded-lg bg-space-cyan/10 border border-space-cyan/30"
          >
            <AlertTriangle className="w-4 h-4 text-space-cyan" />
            <p className="text-sm text-gray-300">
              Parameters auto-loaded from <strong className="text-white">{selectedAsteroid.name}</strong>
            </p>
          </motion.div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Size Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium flex items-center">
              Asteroid Size (meters)
              <InfoTooltip 
                termKey="crater_diameter"
                size="sm"
              />
            </label>
            <span className="text-sm text-space-cyan font-bold">{impactParameters.size.toLocaleString()}m</span>
          </div>
          <Slider
            value={[impactParameters.size]}
            onValueChange={(value: any[]) => setImpactParameters({ size: value[0] })}
            min={10}
            max={10000}
            step={10}
          />
          {selectedAsteroid && (
            <p className="text-xs text-gray-400">
              Real diameter: {(selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max * 1000).toFixed(0)}m
            </p>
          )}
          <p className="text-xs text-gray-500">
            &lt; 100m: Local damage • 100-1000m: City threat • &gt; 1000m: Regional catastrophe
          </p>
        </div>

        {/* Density Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium flex items-center">
              Density (kg/m³)
              <InfoTooltip 
                termKey="density"
                size="sm"
              />
            </label>
            <span className="text-sm text-space-cyan font-bold">{impactParameters.density.toLocaleString()}</span>
          </div>
          <Slider
            value={[impactParameters.density]}
            onValueChange={(value: any[]) => setImpactParameters({ density: value[0] })}
            min={1000}
            max={8000}
            step={100}
          />
          <p className="text-xs text-gray-500">
            C-type (carbonaceous): 1500 • S-type (stony): 3000 • M-type (metallic): 7000
          </p>
        </div>

        {/* Velocity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium flex items-center">
              Velocity (km/s)
              <InfoTooltip 
                termKey="velocity"
                size="sm"
              />
            </label>
            <span className="text-sm text-space-cyan font-bold">{impactParameters.velocity}</span>
          </div>
          <Slider
            value={[impactParameters.velocity]}
            onValueChange={(value: any[]) => setImpactParameters({ velocity: value[0] })}
            min={5}
            max={72}
            step={1}
          />
          {selectedAsteroid && selectedAsteroid.close_approach_data[0] && (
            <p className="text-xs text-gray-400">
              Real velocity: {parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(1)} km/s
            </p>
          )}
          <p className="text-xs text-gray-500">
            Slow: 10-20 • Average: 20-40 • Fast: 40-70 km/s
          </p>
        </div>

        {/* Entry Angle Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium flex items-center">
              Entry Angle (degrees)
              <InfoTooltip 
                termKey="impact_angle"
                size="sm"
              />
            </label>
            <span className="text-sm text-space-cyan font-bold">{impactParameters.angle}°</span>
          </div>
          <Slider
            value={[impactParameters.angle]}
            onValueChange={(value: any[]) => setImpactParameters({ angle: value[0] })}
            min={0}
            max={90}
            step={1}
          />
          <p className="text-xs text-gray-500">
            Shallow (15-30°): Maximum destruction • Steep (60-90°): Smaller crater, deeper penetration
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="neon"
            className="flex-1"
            onClick={handleSimulate}
          >
            <Play className="w-4 h-4 mr-2" />
            Run Simulation
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
