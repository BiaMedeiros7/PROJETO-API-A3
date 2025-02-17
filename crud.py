from sqlalchemy.orm import Session
from models import Tarefa
from schemas import TarefaUpdate  
from fastapi import HTTPException


def obter_tarefas_por_box(db: Session, box_id: int):
    
    return db.query(Tarefa).filter(Tarefa.box_id == box_id).all()



def criar_tarefa(db: Session, nome_tarefa: str, status_tarefa: int, box_id: int):
   
    if not nome_tarefa or status_tarefa is None or box_id is None:
        raise ValueError("Os campos nome_tarefa, status_tarefa e box_id são obrigatórios.")
    nova_tarefa = Tarefa(nome_tarefa=nome_tarefa, status_tarefa=status_tarefa, box_id=box_id)
    db.add(nova_tarefa)
    db.commit()
    db.refresh(nova_tarefa)
    return nova_tarefa



def atualizar_tarefa(db: Session, id: int, tarefa_update: TarefaUpdate):
    db_tarefa = db.query(Tarefa).filter(Tarefa.idtarefas_api == id).first()  
    if db_tarefa is None:
        return None 
    
    
    db_tarefa.nome_tarefa = tarefa_update.nome_tarefa
    db_tarefa.status_tarefa = tarefa_update.status_tarefa
    db_tarefa.box_id = tarefa_update.box_id  
    
    db.commit()  
    db.refresh(db_tarefa)  
    return db_tarefa



def deletar_tarefa(db: Session, tarefa_id: int):
    
    tarefa = db.query(Tarefa).filter(Tarefa.idtarefas_api == tarefa_id).first()
    if not tarefa:
        raise HTTPException(status_code=404, detail=f"Tarefa com ID {tarefa_id} não encontrada.")
    db.delete(tarefa)
    db.commit()
    return tarefa
