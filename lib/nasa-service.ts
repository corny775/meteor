import axios from 'axios';
import { NASAAsteroid } from '@/types';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export class NASAService {
  static async fetchNearEarthObjects(
    startDate: string,
    endDate: string
  ): Promise<NASAAsteroid[]> {
    try {
      const response = await axios.get(`${NASA_BASE_URL}/feed`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          api_key: NASA_API_KEY,
        },
      });

      const asteroids: NASAAsteroid[] = [];
      const neoData = response.data.near_earth_objects;

      Object.keys(neoData).forEach((date) => {
        asteroids.push(...neoData[date]);
      });

      return asteroids;
    } catch (error) {
      console.error('Error fetching NEO data:', error);
      return [];
    }
  }

  static async fetchAsteroidById(asteroidId: string): Promise<NASAAsteroid | null> {
    try {
      const response = await axios.get(`${NASA_BASE_URL}/neo/${asteroidId}`, {
        params: {
          api_key: NASA_API_KEY,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching asteroid:', error);
      return null;
    }
  }

  static async searchAsteroids(): Promise<NASAAsteroid[]> {
    try {
      const response = await axios.get(`${NASA_BASE_URL}/neo/browse`, {
        params: {
          api_key: NASA_API_KEY,
        },
      });

      return response.data.near_earth_objects || [];
    } catch (error) {
      console.error('Error searching asteroids:', error);
      return [];
    }
  }

  static async fetchNearEarthAsteroids(days: number = 7): Promise<NASAAsteroid[]> {
    try {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      return await this.fetchNearEarthObjects(startDate, endDate);
    } catch (error) {
      console.error('Error fetching near-earth asteroids:', error);
      return [];
    }
  }

  static filterHazardousAsteroids(asteroids: NASAAsteroid[]): NASAAsteroid[] {
    return asteroids.filter((asteroid) => asteroid.is_potentially_hazardous_asteroid);
  }

  static sortBySize(asteroids: NASAAsteroid[]): NASAAsteroid[] {
    return asteroids.sort((a, b) => {
      const sizeA = a.estimated_diameter.kilometers.estimated_diameter_max;
      const sizeB = b.estimated_diameter.kilometers.estimated_diameter_max;
      return sizeB - sizeA;
    });
  }

  static sortByVelocity(asteroids: NASAAsteroid[]): NASAAsteroid[] {
    return asteroids.sort((a, b) => {
      const velA = parseFloat(
        a.close_approach_data[0]?.relative_velocity.kilometers_per_second || '0'
      );
      const velB = parseFloat(
        b.close_approach_data[0]?.relative_velocity.kilometers_per_second || '0'
      );
      return velB - velA;
    });
  }
}
