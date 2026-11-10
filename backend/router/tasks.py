from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session

import models
import schemas

from database import get_db
from dependencies import get_current_user

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# CREATE TASK
@router.post("/", response_model=schemas.TaskResponse)
def create_task(
    task_data: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check whether event belongs to current user
    event = db.query(models.Event).filter(
        models.Event.id == task_data.event_id,
        models.Event.user_id == current_user.id
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    new_task = models.Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        deadline=task_data.deadline,
        event_id=task_data.event_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


# GET ALL MY TASKS

@router.get("/", response_model=list[schemas.TaskResponse])
def get_my_tasks(
    status: str | None = Query(default=None),
    priority: str | None = Query(default=None),
    event_id: int | None = Query(default=None),
    search: str | None = Query(default=None),

    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Task).join(models.Event).filter(
        models.Event.user_id == current_user.id
    )

    # Filter by status
    if status:
        query = query.filter(models.Task.status == status)

    # Filter by priority
    if priority:
        query = query.filter(models.Task.priority == priority)

    # Filter by event
    if event_id:
        query = query.filter(models.Task.event_id == event_id)

    # Search by title
    if search:
        query = query.filter(
            models.Task.title.ilike(f"%{search}%")
        )

    return query.all()


# GET TASK BY ID
@router.get("/{task_id}", response_model=schemas.TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).join(models.Event).filter(
        models.Task.id == task_id,
        models.Event.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


# UPDATE TASK
@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    task_data: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).join(models.Event).filter(
        models.Task.id == task_id,
        models.Event.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    update_data = task_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return task


# DELETE TASK
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).join(models.Event).filter(
        models.Task.id == task_id,
        models.Event.user_id == current_user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}
