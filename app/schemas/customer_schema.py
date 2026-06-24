from pydantic import BaseModel


class CustomerBase(BaseModel):
    name: str
    phone: str
    email: str


class CustomerCreate(CustomerBase):
    password: str


class CustomerResponse(CustomerBase):
    customer_id: int

    class Config:
        from_attributes = True
class ChangePassword(BaseModel):
    current_password: str
    new_password: str