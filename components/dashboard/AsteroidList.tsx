'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { useState } from 'react';

export default function AsteroidList() {
  const { asteroidList, selectedAsteroid, setSelectedAsteroid } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAsteroids = asteroidList.filter((asteroid) =>
    asteroid.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAsteroids = filteredAsteroids.sort((a, b) => {
    const sizeA = a.estimated_diameter.kilometers.estimated_diameter_max;
    const sizeB = b.estimated_diameter.kilometers.estimated_diameter_max;
    return sizeB - sizeA;
  });

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-space-cyan" />
          Near-Earth Objects
        </CardTitle>
        <CardDescription>
          {asteroidList.length} asteroids detected
        </CardDescription>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search asteroids..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-2">
        {sortedAsteroids.map((asteroid, index) => {
          const size = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
          const velocity = asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || '0';
          const isHazardous = asteroid.is_potentially_hazardous_asteroid;
          const isSelected = selectedAsteroid?.id === asteroid.id;

          return (
            <motion.div
              key={asteroid.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAsteroid(asteroid)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-space-cyan/20 to-space-neon/20 neon-border'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white truncate">{asteroid.name}</h3>
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="text-gray-400 flex items-center">
                      Size: <span className="text-space-cyan ml-1">{(size * 1000).toFixed(0)}m</span>
                      <InfoTooltip 
                        title="Asteroid Diameter"
                        description="Larger asteroids cause exponentially more damage. A 100m asteroid destroys a city, while a 10km asteroid causes mass extinction."
                        size="sm"
                      />
                    </p>
                    <p className="text-gray-400 flex items-center">
                      Velocity: <span className="text-space-cyan ml-1">{parseFloat(velocity).toFixed(1)} km/s</span>
                      <InfoTooltip 
                        termKey="velocity"
                        size="sm"
                      />
                    </p>
                  </div>
                </div>
                {isHazardous && (
                  <div className="ml-2 px-2 py-1 rounded bg-red-500/20 border border-red-500/50">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {sortedAsteroids.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No asteroids found</p>
            <p className="text-sm mt-2">Try adjusting your search</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
