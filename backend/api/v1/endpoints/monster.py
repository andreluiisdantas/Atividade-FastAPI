from typing import List
from fastapi import APIRouter, status, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from models.monster_model import *
from schemas.monster_schema import MonsterSchema
from core.deps import get_session

router = APIRouter()

# CREATE - POST
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=MonsterSchema)
async def post_monster(monster: MonsterSchema, db: AsyncSession = Depends(get_session)):
    novo_monster = MonsterModel(
        nome=monster.nome,
        tipo_monstro=monster.tipo_monstro,
        pai_famoso=monster.pai_famoso,
        cor_favorita=monster.cor_favorita
    )
    db.add(novo_monster)
    await db.commit()
    return novo_monster

# READ (All) - GET
@router.get('/', response_model=List[MonsterSchema])
async def get_monsters(db: AsyncSession = Depends(get_session)):
    async with db as session:
        query = select(MonsterModel)
        result = await session.execute(query)
        monsters: List[MonsterModel] = result.scalars().all()
        return monsters

# READ (by ID) - GET
@router.get("/{monster_id}", response_model=MonsterSchema, status_code=status.HTTP_200_OK)
async def get_monster(monster_id: int, db: AsyncSession = Depends(get_session)):
    async with db as session:
        query = select(MonsterModel).filter(MonsterModel.id_monster == monster_id)
        result = await session.execute(query)
        monster = result.scalar_one_or_none()
        
        if monster:
            return monster
        else:
            raise HTTPException(detail='Monstro não encontrado.', status_code=status.HTTP_404_NOT_FOUND)

# UPDATE - PUT
@router.put('/{monster_id}', response_model=MonsterSchema, status_code=status.HTTP_202_ACCEPTED)
async def put_monster(monster_id: int, monster: MonsterSchema, db: AsyncSession = Depends(get_session)):
    async with db as session:
        query = select(MonsterModel).filter(MonsterModel.id_monster == monster_id)
        result = await session.execute(query)
        monster_up = result.scalar_one_or_none()

        if monster_up:
            monster_up.nome = monster.nome
            monster_up.tipo_monstro = monster.tipo_monstro
            monster_up.pai_famoso = monster.pai_famoso
            monster_up.cor_favorita = monster.cor_favorita
            
            await session.commit()
            return monster_up
        else:
            raise HTTPException(detail='Monstro não encontrado.', status_code=status.HTTP_404_NOT_FOUND)

# DELETE
@router.delete('/{monster_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_monster(monster_id: int, db: AsyncSession = Depends(get_session)):
    from sqlalchemy import delete

    async with db as session:
        query_monster = select(MonsterModel).filter(MonsterModel.id_monster == monster_id)
        result_monster = await session.execute(query_monster)
        monster_del = result_monster.scalar_one_or_none()
        
        if monster_del:
            delete_pets_stmt = delete(PetModel).where(PetModel.dono_id == monster_id)
            await session.execute(delete_pets_stmt)
            
            await session.delete(monster_del)
            await session.commit()
            
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        else:
            raise HTTPException(detail='Monstro não encontrado.', status_code=status.HTTP_404_NOT_FOUND)