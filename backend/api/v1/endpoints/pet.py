from typing import List
from fastapi import APIRouter, status, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.monster_model import PetModel
from schemas.monster_schema import PetSchema
from core.deps import get_session

router = APIRouter()

# CREATE - POST
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PetSchema)
async def post_pet(pet: PetSchema, db: AsyncSession = Depends(get_session)):
    novo_pet = PetModel(
        nome=pet.nome,
        especie=pet.especie,
        descricao=pet.descricao,
        dono_id=pet.dono_id
    )
    db.add(novo_pet)
    await db.commit()
    return novo_pet

# READ (All) - GET
@router.get('/', response_model=List[PetSchema])
async def get_pets(db: AsyncSession = Depends(get_session)):
    async with db as session:
        query = select(PetModel)
        result = await session.execute(query)
        pets: List[PetModel] = result.scalars().all()
        return pets

# READ (by ID) - GET
@router.get("/{pet_id}", response_model=PetSchema, status_code=status.HTTP_200_OK)
async def get_pet(pet_id: int, db: AsyncSession = Depends(get_session)):
    async with db as session:
        query = select(PetModel).filter(PetModel.id_pet == pet_id)
        result = await session.execute(query)
        pet = result.scalar_one_or_none()
        
        if pet:
            return pet
        else:
            raise HTTPException(detail='Pet não encontrado.', status_code=status.HTTP_404_NOT_FOUND)

# UPDATE - PUT
@router.put('/{pet_id}', response_model=PetSchema, status_code=status.HTTP_202_ACCEPTED)
async def put_pet(pet_id: int, pet: PetSchema, db: AsyncSession = Depends(get_session)):
    async with db as session:
        query = select(PetModel).filter(PetModel.id_pet == pet_id)
        result = await session.execute(query)
        pet_up = result.scalar_one_or_none()

        if pet_up:
            pet_up.nome = pet.nome
            pet_up.especie = pet.especie
            pet_up.descricao = pet.descricao
            pet_up.dono_id = pet.dono_id
            
            await session.commit()
            return pet_up
        else:
            raise HTTPException(detail='Pet não encontrado.', status_code=status.HTTP_404_NOT_FOUND)

# DELETE
@router.delete('/{pet_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet(pet_id: int, db: AsyncSession = Depends(get_session)):
    async with db as session:
        query = select(PetModel).filter(PetModel.id_pet == pet_id)
        result = await session.execute(query)
        pet_del = result.scalar_one_or_none()
        
        if pet_del:
            await session.delete(pet_del)
            await session.commit()
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        else:
            raise HTTPException(detail='Pet não encontrado.', status_code=status.HTTP_404_NOT_FOUND)