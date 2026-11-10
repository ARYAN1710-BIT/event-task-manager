
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models

from database import get_db
from dependencies import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    # Total events
    total_events = db.query(models.Event).filter(
        models.Event.user_id == current_user.id
    ).count()

    # Base task query for current user
    task_query = db.query(models.Task).join(models.Event).filter(
        models.Event.user_id == current_user.id
    )

    # Total tasks
    total_tasks = task_query.count()

    # Pending tasks
    pending_tasks = task_query.filter(
        models.Task.status == "pending"
    ).count()

    # In-progress tasks
    in_progress_tasks = task_query.filter(
        models.Task.status == "in_progress"
    ).count()

    # Completed tasks
    completed_tasks = task_query.filter(
        models.Task.status == "completed"
    ).count()

    # High-priority tasks
    high_priority_tasks = task_query.filter(
        models.Task.priority == "high"
    ).count()

    # Completion percentage
    completion_percentage = (
        round((completed_tasks / total_tasks) * 100, 2)
        if total_tasks > 0
        else 0
    )

    return {
        "total_events": total_events,
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "in_progress_tasks": in_progress_tasks,
        "completed_tasks": completed_tasks,
        "high_priority_tasks": high_priority_tasks,
        "completion_percentage": completion_percentage
    }
