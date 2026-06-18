from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.customer_schema import CustomerCreate
from app.models.customers import Customer
from app.database.db import SessionLocal
from app.models.users import User
from app.auth.hashing import hash_password
from app.auth.hashing import verify_password
from app.auth.token import create_access_token
from app.auth.oauth2 import verify_token


router = APIRouter()


# ---------------- GET ALL CUSTOMERS ----------------

@router.get("/customers")
def get_customers(
    payload = Depends(verify_token)
):

    db = SessionLocal()

    customers = db.query(Customer).order_by(
        Customer.customer_id
    ).all()

    result = []

    for customer in customers:
        result.append(
            {
                "customer_id": customer.customer_id,
                "name": customer.name,
                "phone": customer.phone,
                "email": customer.email
            }
        )

    db.close()

    return result
# ---------------- CREATE CUSTOMER ----------------

# ---------------- CREATE CUSTOMER ----------------

@router.post("/customers")
def create_customer(customer: CustomerCreate):

    db = SessionLocal()

    hashed_password = hash_password(customer.password)

    # Create Customer Record

    new_customer = Customer(
        name=customer.name,
        phone=customer.phone,
        email=customer.email,
        password=hashed_password
    )

    db.add(new_customer)

    # Create User Record for Login

    new_user = User(
        name=customer.name,
        email=customer.email,
        password=hashed_password,
        role="customer"
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_customer)

    result = {
        "customer_id": new_customer.customer_id,
        "name": new_customer.name,
        "phone": new_customer.phone,
        "email": new_customer.email
    }

    db.close()

    return {
        "message": "Customer Created Successfully",
        "data": result
    }


# ---------------- LOGIN ----------------

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == form_data.username
    ).first()
    
    customer = db.query(Customer).filter(
    Customer.email == user.email
    ).first()

    if not user:
        db.close()
        return {
            "message": "Invalid Email"
        }

    if not verify_password(
        form_data.password,
        user.password
    ):
        db.close()
        return {
            "message": "Invalid Password"
        }

    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    db.close()

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.user_id,
        "customer_id": customer.customer_id,
        "name": user.name,
        "role": user.role
    }


# ---------------- UPDATE CUSTOMER ----------------

@router.put("/customers/{customer_id}")
def update_customer(customer_id: int, customer: CustomerCreate):

    db = SessionLocal()

    existing_customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()

    if not existing_customer:
        db.close()
        return {"message": "Customer Not Found"}

    existing_customer.name = customer.name
    existing_customer.phone = customer.phone
    existing_customer.email = customer.email
    existing_customer.password = hash_password(customer.password)

    db.commit()

    result = {
        "customer_id": existing_customer.customer_id,
        "name": existing_customer.name,
        "phone": existing_customer.phone,
        "email": existing_customer.email
    }

    db.close()

    return {
        "message": "Customer Updated Successfully",
        "data": result
    }


# ---------------- DELETE CUSTOMER ----------------

@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: int):

    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()

    if not customer:
        db.close()
        return {"message": "Customer Not Found"}

    db.delete(customer)
    db.commit()

    db.close()

    return {
        "message": "Customer Deleted Successfully"
    }