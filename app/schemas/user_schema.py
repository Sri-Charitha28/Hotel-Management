from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    email: str
    role: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    user_id: int

    class Config:
        from_attributes = True