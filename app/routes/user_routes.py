from fastapi import APIRouter
from app.database.db import SessionLocal
from app.models.users import User
from app.schemas.user_schema import UserCreate
from app.auth.hashing import hash_password

router = APIRouter()


# ---------------- GET USERS ----------------

@router.get("/users")
def get_users():

    db = SessionLocal()

    users = db.query(User).order_by(
        User.user_id
    ).all()

    result = []

    for user in users:
        result.append(
            {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        )

    db.close()

    return result


# ---------------- CREATE USER ----------------

@router.post("/users")
def create_user(user: UserCreate):

    db = SessionLocal()

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    db.close()

    return {
        "message": "User Created Successfully",
        "user_id": new_user.user_id
    }