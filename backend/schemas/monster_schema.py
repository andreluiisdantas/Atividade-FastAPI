from typing import Optional
from pydantic import BaseModel as SCBaseModel

class MonsterSchema(SCBaseModel):
    id_monster: Optional[int] = None
    nome: str
    tipo_monstro: str
    pai_famoso: str
    cor_favorita: str
    
    class Config:
        orm_mode = True

class PetSchema(SCBaseModel):
    id_pet: Optional[int] = None
    nome: str
    especie: str
    descricao: str
    dono_id: int
    
    class Config:
        orm_mode = True