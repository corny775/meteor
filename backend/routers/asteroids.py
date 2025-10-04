from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import requests
from datetime import datetime, timedelta

router = APIRouter()

NASA_API_KEY = "DEMO_KEY"  # Replace with actual API key
NASA_BASE_URL = "https://api.nasa.gov/neo/rest/v1"

@router.get("/neo/feed")
async def get_neo_feed(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Fetch Near-Earth Objects from NASA API.
    """
    try:
        if not start_date:
            start_date = datetime.now().strftime("%Y-%m-%d")
        if not end_date:
            end_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        
        url = f"{NASA_BASE_URL}/feed"
        params = {
            "start_date": start_date,
            "end_date": end_date,
            "api_key": NASA_API_KEY
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"NASA API error: {str(e)}")

@router.get("/neo/{asteroid_id}")
async def get_asteroid_details(asteroid_id: str):
    """
    Get detailed information about a specific asteroid.
    """
    try:
        url = f"{NASA_BASE_URL}/neo/{asteroid_id}"
        params = {"api_key": NASA_API_KEY}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=404, detail=f"Asteroid not found: {str(e)}")

@router.get("/neo/browse")
async def browse_asteroids(
    page: int = Query(0, ge=0),
    size: int = Query(20, ge=1, le=100)
):
    """
    Browse all known Near-Earth Objects.
    """
    try:
        url = f"{NASA_BASE_URL}/neo/browse"
        params = {
            "page": page,
            "size": size,
            "api_key": NASA_API_KEY
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"NASA API error: {str(e)}")

@router.get("/statistics")
async def get_neo_statistics():
    """
    Get NEO statistics from NASA.
    """
    try:
        url = f"{NASA_BASE_URL}/stats"
        params = {"api_key": NASA_API_KEY}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        return response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"NASA API error: {str(e)}")
