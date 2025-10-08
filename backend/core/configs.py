from pydantic.v1 import BaseSettings
from sqlalchemy.orm import declarative_base

# todas as configurações do projeto
class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
 
    DB_URL: str = "mysql+asyncmy://root@127.0.0.1:3306/monster"
    BDBaseModel = declarative_base()
 
 
# configurações do python
class Config:
    case_sensitive = False
    env_file = ".venv"
 
 
# atribuindo a class a uma variavel, para chamar apenas a variavel
settings = Settings()