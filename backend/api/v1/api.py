from fastapi import APIRouter
from api.v1.endpoints import monster, pet 

api_router = APIRouter()
api_router.include_router(monster.router, prefix='/monsters', tags=["monsters"])
api_router.include_router(pet.router, prefix='/pets', tags=["pets"])