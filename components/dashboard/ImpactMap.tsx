'use client';

import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController() {
  const { impactParameters } = useAppStore();
  const map = useMap();

  useEffect(() => {
    map.setView([impactParameters.impactLocation.lat, impactParameters.impactLocation.lng], 6);
  }, [impactParameters.impactLocation, map]);

  return null;
}

export default function ImpactMap() {
  const { simulationResults, impactParameters, showEnvironmentalOverlays } = useAppStore();

  if (typeof window === 'undefined') {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-400">
          <p>Loading map...</p>
        </CardContent>
      </Card>
    );
  }

  const { lat, lng } = impactParameters.impactLocation;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-space-cyan">Impact Zone Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] rounded-lg overflow-hidden">
          <MapContainer
            center={[lat, lng]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController />

            <Marker position={[lat, lng]}>
              <Popup>Impact Point</Popup>
            </Marker>

            {simulationResults && showEnvironmentalOverlays.seismic && (
              <>
                {/* Crater */}
                <Circle
                  center={[lat, lng]}
                  radius={simulationResults.crater.diameter / 2}
                  pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.5 }}
                />

                {/* Fireball */}
                <Circle
                  center={[lat, lng]}
                  radius={simulationResults.atmospheric.fireballRadius * 1000}
                  pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.3 }}
                />

                {/* Thermal Radiation */}
                <Circle
                  center={[lat, lng]}
                  radius={simulationResults.atmospheric.thermalRadiation * 1000}
                  pathOptions={{ color: 'yellow', fillColor: 'yellow', fillOpacity: 0.2 }}
                />

                {/* Seismic Effects */}
                <Circle
                  center={[lat, lng]}
                  radius={simulationResults.seismic.radius * 1000}
                  pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.1 }}
                />
              </>
            )}

            {simulationResults?.tsunami && showEnvironmentalOverlays.tsunami && (
              <Circle
                center={[lat, lng]}
                radius={simulationResults.tsunami.affectedRadius * 1000}
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
              />
            )}
          </MapContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-xs text-gray-400">Crater</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-400">Fireball</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-400">Thermal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500" />
            <span className="text-xs text-gray-400">Seismic</span>
          </div>
          {simulationResults?.tsunami && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-400">Tsunami</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
