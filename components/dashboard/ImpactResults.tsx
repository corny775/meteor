'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Mountain, Waves, Flame, AlertTriangle } from 'lucide-react';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function ImpactResults() {
  const { simulationResults, isSimulating } = useAppStore();

  if (!simulationResults && !isSimulating) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Run a simulation to see impact results</p>
        </CardContent>
      </Card>
    );
  }

  if (isSimulating) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4 border-4 border-space-cyan border-t-transparent rounded-full"
          />
          <p className="text-gray-400">Calculating impact effects...</p>
        </CardContent>
      </Card>
    );
  }

  const { energy, crater, seismic, tsunami, atmospheric, casualties, terrainType, elevation, populationDensity, nearestCity } = simulationResults!;

  const resultItems = [
    {
      icon: Zap,
      label: 'Impact Energy',
      termKey: 'impact_energy',
      value: `${energy.megatonsTNT.toFixed(2)} MT`,
      subtitle: `${(energy.joules / 1e15).toFixed(2)} PJ`,
      color: 'text-yellow-400',
    },
    {
      icon: Mountain,
      label: 'Crater Size',
      termKey: 'crater_diameter',
      value: `${(crater.diameter / 1000).toFixed(2)} km`,
      subtitle: `Depth: ${(crater.depth / 1000).toFixed(2)} km`,
      color: 'text-orange-400',
    },
    {
      icon: Waves,
      label: 'Seismic Magnitude',
      termKey: 'seismic_magnitude',
      value: seismic.magnitude.toFixed(1),
      subtitle: `Radius: ${seismic.radius.toFixed(0)} km`,
      color: 'text-red-400',
    },
    {
      icon: Flame,
      label: 'Fireball',
      termKey: 'fireball_radius',
      value: `${atmospheric.fireballRadius.toFixed(1)} km`,
      subtitle: `Thermal: ${atmospheric.thermalRadiation.toFixed(1)} km`,
      color: 'text-red-500',
    },
  ];

  if (tsunami) {
    resultItems.push({
      icon: Waves,
      label: 'Tsunami Wave',
      termKey: 'tsunami_wave',
      value: `${tsunami.waveHeight.toFixed(0)} m`,
      subtitle: `Range: ${tsunami.affectedRadius.toFixed(0)} km`,
      color: 'text-blue-400',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-space-neon">Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {resultItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all"
              >
                <Icon className={`w-8 h-8 ${item.color} mb-2`} />
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <InfoTooltip termKey={item.termKey} size="sm" />
                </div>
                <p className="text-xl font-bold text-white">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
              </motion.div>
            );
          })}
        </div>

        {casualties && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <p className="font-semibold text-white">Estimated Casualties</p>
                <p className="text-sm text-gray-300">
                  {casualties.estimated.toLocaleString()} casualties
                </p>
                <p className="text-xs text-gray-400">
                  Affected population: {casualties.affectedPopulation.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {terrainType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 p-4 rounded-lg bg-space-cyan/10 border border-space-cyan/30"
          >
            <div className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-space-cyan" />
              <div className="flex-1">
                <p className="font-semibold text-white">Impact Location Details</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-gray-400">Terrain Type</p>
                    <p className="text-space-cyan capitalize">{terrainType}</p>
                  </div>
                  {elevation !== undefined && (
                    <div>
                      <p className="text-gray-400">Elevation</p>
                      <p className="text-space-cyan">{elevation.toFixed(0)}m</p>
                    </div>
                  )}
                  {populationDensity !== undefined && (
                    <div>
                      <p className="text-gray-400">Population Density</p>
                      <p className="text-space-cyan">{populationDensity.toFixed(0)} /km²</p>
                    </div>
                  )}
                  {nearestCity && (
                    <div>
                      <p className="text-gray-400">Nearest City</p>
                      <p className="text-space-cyan">{nearestCity}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
