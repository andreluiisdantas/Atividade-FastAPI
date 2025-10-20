from core.configs import settings
from sqlalchemy import Column, Integer, String, ForeignKey

class MonsterModel(settings.BDBaseModel):
    __tablename__ = 'monstros'

    id_monster: int = Column(Integer(), primary_key=True, autoincrement=True)
    nome: str = Column(String(255))
    tipo_monstro: str = Column(String(255))
    pai_famoso: str = Column(String(255))
    cor_favorita: str = Column(String(255))

class PetModel(settings.BDBaseModel):
    __tablename__ = 'pets'

    id_pet: int = Column(Integer(), primary_key=True, autoincrement=True)
    nome: str = Column(String(255))
    especie: str = Column(String(255))
    descricao: str = Column(String(255))
    dono_id: int = Column(Integer(), ForeignKey('monstros.id_monster'))