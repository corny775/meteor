import { OrbitData, Vector3D } from '@/types';

export class OrbitalMechanics {
  private static readonly AU = 149597870.7; // km
  private static readonly G = 6.67430e-11; // gravitational constant
  private static readonly SOLAR_MASS = 1.989e30; // kg

  /**
   * Convert orbital elements to Cartesian coordinates
   * Using Keplerian orbital elements
   */
  static orbitalToCartesian(orbit: OrbitData, time: number = 0): Vector3D {
    const { a, e, i, omega, Omega, M } = orbit;

    // Convert to radians
    const iRad = (i * Math.PI) / 180;
    const omegaRad = (omega * Math.PI) / 180;
    const OmegaRad = (Omega * Math.PI) / 180;
    const MRad = (M * Math.PI) / 180;

    // Solve Kepler's equation for eccentric anomaly
    const E = this.solveKeplerEquation(MRad, e);

    // True anomaly
    const nu = 2 * Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    );

    // Distance
    const r = a * (1 - e * Math.cos(E));

    // Position in orbital plane
    const x_orb = r * Math.cos(nu);
    const y_orb = r * Math.sin(nu);

    // Rotate to ecliptic coordinates
    const x =
      (Math.cos(OmegaRad) * Math.cos(omegaRad) -
        Math.sin(OmegaRad) * Math.sin(omegaRad) * Math.cos(iRad)) *
        x_orb +
      (-Math.cos(OmegaRad) * Math.sin(omegaRad) -
        Math.sin(OmegaRad) * Math.cos(omegaRad) * Math.cos(iRad)) *
        y_orb;

    const y =
      (Math.sin(OmegaRad) * Math.cos(omegaRad) +
        Math.cos(OmegaRad) * Math.sin(omegaRad) * Math.cos(iRad)) *
        x_orb +
      (-Math.sin(OmegaRad) * Math.sin(omegaRad) +
        Math.cos(OmegaRad) * Math.cos(omegaRad) * Math.cos(iRad)) *
        y_orb;

    const z = Math.sin(iRad) * Math.sin(omegaRad) * x_orb + Math.sin(iRad) * Math.cos(omegaRad) * y_orb;

    return { x, y, z };
  }

  /**
   * Solve Kepler's equation using Newton-Raphson method
   */
  private static solveKeplerEquation(M: number, e: number, tolerance: number = 1e-6): number {
    let E = M; // Initial guess
    let delta = 1;

    while (Math.abs(delta) > tolerance) {
      delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= delta;
    }

    return E;
  }

  /**
   * Generate orbital path points
   */
  static generateOrbitPath(orbit: OrbitData, numPoints: number = 100): Vector3D[] {
    const points: Vector3D[] = [];

    for (let i = 0; i <= numPoints; i++) {
      const meanAnomaly = (360 * i) / numPoints;
      const orbitAtTime = { ...orbit, M: meanAnomaly };
      points.push(this.orbitalToCartesian(orbitAtTime));
    }

    return points;
  }

  /**
   * Calculate deflection delta-v required
   */
  static calculateDeflectionDeltaV(
    asteroidMass: number,
    impactorMass: number,
    impactorVelocity: number,
    beta: number = 1.0 // momentum enhancement factor
  ): number {
    // Delta-v = (beta * m_impactor * v_impactor) / m_asteroid
    return (beta * impactorMass * impactorVelocity) / asteroidMass;
  }

  /**
   * Apply velocity change to orbit
   */
  static applyDeltaV(orbit: OrbitData, deltaV: number, direction: 'prograde' | 'retrograde'): OrbitData {
    // Simplified orbital change calculation
    const factor = direction === 'prograde' ? 1 : -1;
    const deltaA = orbit.a * (deltaV / 1000) * factor * 0.001;

    return {
      ...orbit,
      a: orbit.a + deltaA,
      e: Math.min(0.99, orbit.e + deltaV * 0.0001),
    };
  }

  /**
   * Calculate time until Earth impact
   */
  static calculateTimeToImpact(orbit: OrbitData, earthOrbit: OrbitData): number {
    // Simplified calculation based on orbital period
    const period = Math.sqrt(Math.pow(orbit.a, 3)); // Years
    return period * 365.25; // Days
  }

  /**
   * Check if orbit intersects Earth's orbit
   */
  static checkEarthIntersection(orbit: OrbitData): boolean {
    const perihelion = orbit.a * (1 - orbit.e);
    const aphelion = orbit.a * (1 + orbit.e);
    const earthOrbit = 1.0; // AU

    return perihelion <= earthOrbit && aphelion >= earthOrbit;
  }
}
