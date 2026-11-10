from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from security import verify_password, create_access_token
import models
import schemas
from database import get_db
from security import hash_password
from dependencies import get_current_user
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    # 1. Check existing email
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # 2. Hash password
    hashed_password = hash_password(user.password)

    # 3. Create user object
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    # 4. Save in database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 5. Return user
    return new_user

@router.post("/login", response_model=schemas.TokenResponse)
def login(
    data: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    # Find user
    user = db.query(models.User).filter(
        models.User.email == data.email
    ).first()

    # Check user and password
    if not user or not verify_password(
        data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Generate token
    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_my_profile(
    current_user = Depends(get_current_user)
):
    return current_user
