/**
 * Educational content for tooltips and glossary
 * Explains complex astronomical and impact physics terms
 */

export interface EducationalTerm {
  term: string;
  category: 'orbital' | 'impact' | 'deflection' | 'physics' | 'general';
  shortDescription: string;
  detailedDescription: string;
  formula?: string;
  example?: string;
  unit?: string;
  relatedTerms?: string[];
}

export const EDUCATIONAL_CONTENT: Record<string, EducationalTerm> = {
  // Orbital Mechanics Terms
  eccentricity: {
    term: 'Eccentricity (e)',
    category: 'orbital',
    shortDescription: 'Measures how elliptical an orbit is',
    detailedDescription: 'Eccentricity determines the shape of an orbit. A value of 0 means a perfect circle, while values approaching 1 indicate increasingly elliptical orbits. Most asteroid orbits have eccentricity between 0.1 and 0.3.',
    formula: 'e = √(1 - b²/a²)',
    example: "Earth's orbit: e = 0.017 (nearly circular). Halley's Comet: e = 0.967 (highly elliptical)",
    unit: 'dimensionless (0-1)',
    relatedTerms: ['semi_major_axis', 'perihelion', 'aphelion'],
  },
  
  semi_major_axis: {
    term: 'Semi-Major Axis (a)',
    category: 'orbital',
    shortDescription: 'Half the longest diameter of an elliptical orbit',
    detailedDescription: 'The semi-major axis represents the average distance from the Sun. It determines the orbital period through Kepler\'s Third Law. Measured in Astronomical Units (AU), where 1 AU = Earth-Sun distance.',
    formula: 'a = (rₚ + rₐ) / 2',
    example: 'Earth: a = 1.000 AU. Mars: a = 1.524 AU. Typical NEO: a = 1.5-2.5 AU',
    unit: 'AU (Astronomical Units)',
    relatedTerms: ['eccentricity', 'orbital_period', 'perihelion'],
  },
  
  inclination: {
    term: 'Inclination (i)',
    category: 'orbital',
    shortDescription: 'The tilt of an orbit relative to Earth\'s orbit',
    detailedDescription: 'Inclination measures how tilted an asteroid\'s orbit is compared to Earth\'s orbital plane (the ecliptic). Higher inclination means the orbit is more steeply angled, making encounters with Earth less likely but potentially more energetic.',
    formula: 'i = angle between orbital planes',
    example: 'Earth: i = 0° (by definition). Typical NEO: i = 5-20°. High: i > 30°',
    unit: 'degrees (°)',
    relatedTerms: ['ascending_node', 'ecliptic'],
  },
  
  perihelion: {
    term: 'Perihelion',
    category: 'orbital',
    shortDescription: 'The closest point to the Sun in an orbit',
    detailedDescription: 'Perihelion is where an asteroid moves fastest due to stronger gravitational pull. For Near-Earth Objects, perihelion distance is crucial - if it\'s less than 1.3 AU, the asteroid can potentially cross Earth\'s orbit.',
    formula: 'q = a(1 - e)',
    example: 'Earth: q = 0.983 AU (147 million km). A NEO with q < 1.3 AU can potentially impact Earth',
    unit: 'AU or km',
    relatedTerms: ['aphelion', 'eccentricity', 'orbital_velocity'],
  },
  
  aphelion: {
    term: 'Aphelion',
    category: 'orbital',
    shortDescription: 'The farthest point from the Sun in an orbit',
    detailedDescription: 'Aphelion is where an asteroid moves slowest. The ratio of aphelion to perihelion distance indicates how elliptical the orbit is.',
    formula: 'Q = a(1 + e)',
    example: 'Earth: Q = 1.017 AU. Highly eccentric asteroid: Q might be 3-4 AU or more',
    unit: 'AU or km',
    relatedTerms: ['perihelion', 'eccentricity', 'semi_major_axis'],
  },

  mean_anomaly: {
    term: 'Mean Anomaly (M)',
    category: 'orbital',
    shortDescription: 'Describes where an object is along its orbit over time',
    detailedDescription: 'Mean anomaly is used to calculate the position of an orbiting body at any given time. It increases uniformly with time and resets after each orbit.',
    formula: 'M = n × t (where n = mean motion)',
    example: 'M = 0° at perihelion, M = 180° at aphelion, M = 360° after one complete orbit',
    unit: 'degrees (°) or radians',
    relatedTerms: ['eccentric_anomaly', 'true_anomaly', 'orbital_period'],
  },

  // Impact Physics Terms
  impact_energy: {
    term: 'Impact Energy',
    category: 'impact',
    shortDescription: 'The kinetic energy released during impact',
    detailedDescription: 'Impact energy depends on the asteroid\'s mass and velocity squared. This energy is converted to crater formation, seismic waves, heat, and atmospheric effects. Measured in megatons of TNT equivalent for comparison.',
    formula: 'E = ½mv² (where m = mass, v = velocity)',
    example: 'Chelyabinsk meteor (2013): ~0.5 MT. Tunguska (1908): ~10-15 MT. Chicxulub (dinosaur extinction): ~100 million MT',
    unit: 'Megatons TNT (MT) or Joules',
    relatedTerms: ['kinetic_energy', 'tnt_equivalent', 'velocity'],
  },

  tnt_equivalent: {
    term: 'TNT Equivalent',
    category: 'impact',
    shortDescription: 'Energy measured in tons of TNT explosive',
    detailedDescription: 'TNT equivalent converts impact energy into an understandable reference. 1 ton of TNT = 4.184 gigajoules. Megatons (MT) are used for large impacts, where 1 MT = 1 million tons of TNT.',
    formula: '1 MT = 4.184 × 10¹⁵ J',
    example: 'Hiroshima bomb: ~15 kilotons. Average city-killer asteroid: 10-50 MT. Global catastrophe: 100,000+ MT',
    unit: 'kilotons (kt) or Megatons (MT)',
    relatedTerms: ['impact_energy', 'yield'],
  },

  crater_diameter: {
    term: 'Crater Diameter',
    category: 'impact',
    shortDescription: 'The width of the impact crater',
    detailedDescription: 'Crater diameter is determined by impact energy, velocity, and target material properties. Craters are typically 20-30 times larger than the impacting asteroid. On Earth, erosion and plate tectonics obscure most ancient craters.',
    formula: 'D ≈ K × E^(1/3.4) (Collins scaling law)',
    example: 'Barringer Crater (Arizona): 1.2 km from ~50m asteroid. Chicxulub: 150 km from ~10km asteroid',
    unit: 'meters or kilometers',
    relatedTerms: ['crater_depth', 'impact_energy', 'ejecta'],
  },

  crater_depth: {
    term: 'Crater Depth',
    category: 'impact',
    shortDescription: 'How deep the crater is below the original surface',
    detailedDescription: 'Crater depth is typically 1/3 to 1/2 of the diameter. Larger craters are proportionally shallower due to gravitational slumping and isostatic adjustment.',
    formula: 'd ≈ D / 3 (for simple craters)',
    example: 'Barringer Crater: 170m deep, 1200m wide (d ≈ D/7). Large impacts may be d ≈ D/10',
    unit: 'meters or kilometers',
    relatedTerms: ['crater_diameter', 'excavation_depth'],
  },

  seismic_magnitude: {
    term: 'Seismic Magnitude (Richter Scale)',
    category: 'impact',
    shortDescription: 'Earthquake intensity from impact',
    detailedDescription: 'Impact-generated seismic waves cause ground shaking similar to earthquakes. The Richter magnitude is logarithmic - each increase of 1.0 represents 10× more amplitude and ~32× more energy.',
    formula: 'M = (2/3) × (log₁₀(E) - 4.8)',
    example: 'City-killer (50 MT): M ~6.5. Regional disaster (1000 MT): M ~7.5. Global catastrophe: M ~9+',
    unit: 'Richter Magnitude (dimensionless)',
    relatedTerms: ['seismic_waves', 'ground_motion', 'earthquake'],
  },

  tsunami_wave: {
    term: 'Tsunami Wave Height',
    category: 'impact',
    shortDescription: 'Height of ocean waves caused by water impact',
    detailedDescription: 'Ocean impacts create massive waves that propagate outward. Wave height depends on impact energy and water depth. Tsunamis travel at hundreds of km/h in deep water and slow down/amplify near coasts.',
    formula: 'H ≈ (E/1000)^0.25 × 10 meters',
    example: '100 MT ocean impact: 30-50m initial wave. Can reach 100m+ when hitting shallow coasts',
    unit: 'meters',
    relatedTerms: ['water_impact', 'coastal_flooding', 'wave_propagation'],
  },

  fireball_radius: {
    term: 'Fireball Radius',
    category: 'impact',
    shortDescription: 'Radius of the initial explosion fireball',
    detailedDescription: 'The fireball is a superheated sphere of vaporized asteroid and target material. Everything within this radius is instantly vaporized. Temperature exceeds 10,000°C.',
    formula: 'R ≈ (E^0.4) / 2',
    example: '50 MT impact: ~2 km fireball radius. 1000 MT: ~5 km fireball',
    unit: 'kilometers',
    relatedTerms: ['thermal_radiation', 'vaporization', 'ground_zero'],
  },

  thermal_radiation: {
    term: 'Thermal Radiation Radius',
    category: 'impact',
    shortDescription: 'Distance where heat causes burns',
    detailedDescription: 'Intense thermal radiation extends far beyond the fireball, causing severe burns and igniting fires. Third-degree burns occur within this radius for unprotected individuals.',
    formula: 'R ≈ (E^0.41) × 2',
    example: '50 MT: ~15 km thermal radius. Ignites wood, causes 3rd degree burns',
    unit: 'kilometers',
    relatedTerms: ['fireball_radius', 'infrared_radiation', 'burns'],
  },

  overpressure: {
    term: 'Overpressure Zone',
    category: 'impact',
    shortDescription: 'Shock wave causing structural damage',
    detailedDescription: 'Overpressure from the blast wave damages buildings and injures people. 5 psi (pounds per square inch) destroys most buildings. 1 psi breaks windows and causes injuries.',
    formula: 'r ≈ (E^0.33) × 5',
    example: '50 MT: 5 psi at 15 km (total destruction), 1 psi at 40 km (window breakage)',
    unit: 'kilometers',
    relatedTerms: ['blast_wave', 'shock_wave', 'structural_damage'],
  },

  // Deflection Strategy Terms
  delta_v: {
    term: 'Delta-V (Δv)',
    category: 'deflection',
    shortDescription: 'Change in velocity needed for deflection',
    detailedDescription: 'Delta-v measures the velocity change required to alter an asteroid\'s orbit enough to miss Earth. Even small changes (cm/s) applied years in advance can result in large misses.',
    formula: 'Δv = change in velocity (m/s)',
    example: '1 cm/s delta-v applied 10 years early = 380,000 km miss distance',
    unit: 'meters per second (m/s) or cm/s',
    relatedTerms: ['orbital_perturbation', 'momentum_transfer'],
  },

  kinetic_impactor: {
    term: 'Kinetic Impactor',
    category: 'deflection',
    shortDescription: 'Spacecraft collision to deflect asteroid',
    detailedDescription: 'A kinetic impactor is a spacecraft deliberately crashed into an asteroid at high speed (5-10 km/s). The momentum transfer changes the asteroid\'s velocity. NASA\'s DART mission (2022) successfully demonstrated this technique.',
    formula: 'Δv = (mₛ × vᵢₘₚ × β) / mₐ',
    example: 'DART mission: 500 kg spacecraft at 6 km/s into Dimorphos, changed orbit by 33 minutes',
    unit: 'mission type',
    relatedTerms: ['delta_v', 'momentum_transfer', 'beta_factor'],
  },

  gravity_tractor: {
    term: 'Gravity Tractor',
    category: 'deflection',
    shortDescription: 'Using spacecraft gravity to slowly pull asteroid',
    detailedDescription: 'A gravity tractor is a spacecraft that hovers near an asteroid, using its own gravitational attraction to slowly pull the asteroid off course. Very slow but extremely precise. Requires years of operation.',
    formula: 'Δv ≈ (G × mₛ × t) / (d² × mₐ)',
    example: '20-ton spacecraft at 100m distance for 1 year ≈ 1 cm/s delta-v',
    unit: 'mission type',
    relatedTerms: ['delta_v', 'gravitational_force', 'mission_duration'],
  },

  laser_ablation: {
    term: 'Laser Ablation',
    category: 'deflection',
    shortDescription: 'Using lasers to vaporize asteroid surface',
    detailedDescription: 'Laser ablation uses powerful lasers to vaporize surface material. The ejected gas acts like a rocket, slowly pushing the asteroid. Still experimental but offers precise control.',
    formula: 'Δv = (dM/dt) × vₑₓₕₐᵤₛₜ / mₐ',
    example: 'Multi-megawatt laser array vaporizing 1 kg/s ≈ 1 cm/s per year',
    unit: 'mission type',
    relatedTerms: ['delta_v', 'vaporization', 'reaction_force'],
  },

  // Physics Terms
  velocity: {
    term: 'Velocity',
    category: 'physics',
    shortDescription: 'Speed and direction of motion',
    detailedDescription: 'In orbital mechanics, velocity determines both the trajectory and kinetic energy. Earth encounters typically occur at 10-70 km/s. Higher velocities result in dramatically higher impact energies (E ∝ v²).',
    formula: 'v = distance / time',
    example: 'Slow NEO: 11 km/s. Average: 20 km/s. Fast: 50+ km/s (parabolic orbit)',
    unit: 'kilometers per second (km/s)',
    relatedTerms: ['kinetic_energy', 'orbital_velocity', 'impact_energy'],
  },

  density: {
    term: 'Density',
    category: 'physics',
    shortDescription: 'Mass per unit volume',
    detailedDescription: 'Asteroid density varies by composition. Rocky asteroids (~3000 kg/m³) are most common. Metallic asteroids (~7000 kg/m³) are denser and more dangerous. Rubble piles (~1500 kg/m³) are loosely bound.',
    formula: 'ρ = mass / volume',
    example: 'C-type (carbonaceous): 1500 kg/m³. S-type (stony): 3000 kg/m³. M-type (metallic): 7000 kg/m³',
    unit: 'kg/m³ (kilograms per cubic meter)',
    relatedTerms: ['mass', 'composition', 'asteroid_type'],
  },

  impact_angle: {
    term: 'Impact Angle',
    category: 'physics',
    shortDescription: 'Angle of asteroid entry into atmosphere/surface',
    detailedDescription: 'Impact angle dramatically affects the result. Vertical (90°) impacts are rare but most destructive locally. Grazing (15-30°) impacts are more common and spread energy over larger areas. 45° is the statistical average.',
    formula: 'θ = angle from horizontal plane',
    example: 'Vertical (90°): maximum local damage. 45°: most probable. Grazing (15°): may skip off atmosphere',
    unit: 'degrees (°)',
    relatedTerms: ['trajectory', 'entry_velocity', 'atmospheric_entry'],
  },

  // General Terms
  near_earth_object: {
    term: 'Near-Earth Object (NEO)',
    category: 'general',
    shortDescription: 'Asteroids or comets with orbits close to Earth',
    detailedDescription: 'NEOs are defined as objects with perihelion distance < 1.3 AU. There are over 30,000 known NEOs, with ~2000 classified as Potentially Hazardous Asteroids (PHAs). Most are harmless.',
    example: 'Apollo asteroids (Earth-crossing), Aten asteroids (orbit mostly inside Earth\'s)',
    unit: 'classification',
    relatedTerms: ['potentially_hazardous', 'near_earth_asteroid'],
  },

  potentially_hazardous: {
    term: 'Potentially Hazardous Asteroid (PHA)',
    category: 'general',
    shortDescription: 'Large NEOs that pass close to Earth',
    detailedDescription: 'PHAs are defined as asteroids larger than 140 meters that come within 0.05 AU (7.5 million km) of Earth\'s orbit. Size and proximity make them potential threats, though actual collision probability is typically very low.',
    example: 'Apophis (370m): Once rated highly dangerous, now known to be safe for next 100 years',
    unit: 'classification',
    relatedTerms: ['near_earth_object', 'minimum_orbit_intersection_distance'],
  },

  astronomical_unit: {
    term: 'Astronomical Unit (AU)',
    category: 'general',
    shortDescription: 'Earth-Sun distance (~150 million km)',
    detailedDescription: 'The AU is the primary unit for measuring distances in the solar system. 1 AU = 149,597,870.7 km, the average Earth-Sun distance.',
    example: 'Mercury: 0.39 AU. Mars: 1.52 AU. Jupiter: 5.2 AU. Asteroid belt: 2.2-3.3 AU',
    unit: '1 AU = ~150 million kilometers',
    relatedTerms: ['semi_major_axis', 'perihelion_distance'],
  },
};

/**
 * Get educational content by term
 */
export function getEducationalTerm(termKey: string): EducationalTerm | undefined {
  return EDUCATIONAL_CONTENT[termKey];
}

/**
 * Get all terms in a category
 */
export function getTermsByCategory(category: EducationalTerm['category']): EducationalTerm[] {
  return Object.values(EDUCATIONAL_CONTENT).filter(term => term.category === category);
}

/**
 * Search educational terms
 */
export function searchTerms(query: string): EducationalTerm[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(EDUCATIONAL_CONTENT).filter(
    term =>
      term.term.toLowerCase().includes(lowerQuery) ||
      term.shortDescription.toLowerCase().includes(lowerQuery) ||
      term.detailedDescription.toLowerCase().includes(lowerQuery)
  );
}
