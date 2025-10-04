'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Trophy, Play, RotateCcw } from 'lucide-react';
import { SimulationScenario } from '@/types';

const SAMPLE_SCENARIO: SimulationScenario = {
  id: 'impactor-2025',
  name: 'Impactor-2025',
  description: 'A 500-meter asteroid is on collision course with Earth. You have 30 days to prevent catastrophe.',
  asteroid: {
    id: 'custom-2025',
    name: 'Impactor-2025',
    size: 500,
    velocity: 25,
    composition: 'Nickel-Iron',
    isCustom: true,
  },
  impactParameters: {
    size: 500,
    density: 7800,
    velocity: 25,
    angle: 45,
    impactLocation: { lat: 35.6762, lng: 139.6503 }, // Tokyo
    isWaterImpact: false,
  },
  daysUntilImpact: 30,
  successRate: 0,
};

export default function DefendEarthMode() {
  const {
    scenario,
    timeRemaining,
    score,
    isComplete,
    outcome,
    startGame,
    updateTime,
    setInterventionTime,
    endGame,
    resetGame,
  } = useGameStore();

  useEffect(() => {
    if (scenario && !isComplete && timeRemaining > 0) {
      const interval = setInterval(() => {
        updateTime(1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [scenario, isComplete, timeRemaining, updateTime]);

  const handleStart = () => {
    startGame(SAMPLE_SCENARIO);
  };

  const handleDeflect = (strategy: string) => {
    const currentTime = timeRemaining;
    setInterventionTime(currentTime);
    
    // Simulate deflection success
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      endGame(success ? 'success' : 'partial');
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  if (!scenario) {
    return (
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-space-neon flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Defend Earth Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <AlertTriangle className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4">Planetary Defense Simulation</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              An asteroid is approaching Earth. Your mission: Choose the right deflection strategy 
              and save humanity from extinction. Time is running out!
            </p>
            <Button variant="neon" size="lg" onClick={handleStart}>
              <Play className="w-5 h-5 mr-2" />
              Start Mission
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Mission Complete</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              {outcome === 'success' ? (
                <Trophy className="w-32 h-32 mx-auto mb-6 text-space-neon" />
              ) : (
                <AlertTriangle className="w-32 h-32 mx-auto mb-6 text-red-400" />
              )}
            </motion.div>
            
            <h3 className="text-3xl font-bold mb-4">
              {outcome === 'success' ? 'Mission Successful!' : 'Partial Success'}
            </h3>
            
            <p className="text-gray-400 mb-6">
              {outcome === 'success' 
                ? 'You successfully deflected the asteroid! Earth is safe.'
                : 'The asteroid was partially deflected, but some damage occurred.'}
            </p>

            <div className="bg-gradient-to-r from-space-cyan/20 to-space-neon/20 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <p className="text-4xl font-bold text-space-neon mb-2">{score.toLocaleString()}</p>
              <p className="text-gray-400">Final Score</p>
            </div>

            <Button variant="neon" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const deflectionStrategies = [
    {
      id: 'kinetic',
      name: 'Kinetic Impactor',
      description: 'Ram the asteroid with a spacecraft to change its velocity',
      timeRequired: 15,
      effectiveness: 0.8,
    },
    {
      id: 'gravity',
      name: 'Gravity Tractor',
      description: 'Use gravitational pull to slowly alter the orbit',
      timeRequired: 25,
      effectiveness: 0.9,
    },
    {
      id: 'nuclear',
      name: 'Nuclear Device',
      description: 'Detonate a nuclear device to fragment or deflect',
      timeRequired: 10,
      effectiveness: 0.7,
    },
  ];

  const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60));
  const urgencyLevel = daysRemaining < 10 ? 'critical' : daysRemaining < 20 ? 'warning' : 'normal';

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Countdown & Status */}
        <div className="lg:col-span-3">
          <Card className={`border-2 ${
            urgencyLevel === 'critical' ? 'border-red-500 animate-pulse-glow' :
            urgencyLevel === 'warning' ? 'border-yellow-500' :
            'border-space-cyan'
          }`}>
            <CardContent className="py-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">TIME UNTIL IMPACT</p>
                <h2 className={`text-5xl font-bold mb-4 ${
                  urgencyLevel === 'critical' ? 'text-red-400' : 'text-space-cyan'
                }`}>
                  {formatTime(timeRemaining)}
                </h2>
                <p className="text-gray-400">{scenario.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deflection Strategies */}
        {deflectionStrategies.map((strategy) => (
          <Card key={strategy.id}>
            <CardHeader>
              <CardTitle className="text-lg">{strategy.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">{strategy.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Time Required:</span>
                  <span className="text-space-cyan">{strategy.timeRequired} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Effectiveness:</span>
                  <span className="text-space-neon">{(strategy.effectiveness * 100).toFixed(0)}%</span>
                </div>
              </div>
              <Button
                variant="neon"
                className="w-full"
                onClick={() => handleDeflect(strategy.id)}
                disabled={daysRemaining < strategy.timeRequired}
              >
                Deploy Strategy
              </Button>
              {daysRemaining < strategy.timeRequired && (
                <p className="text-xs text-red-400 mt-2 text-center">
                  Not enough time!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
