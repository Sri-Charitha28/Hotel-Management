from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.customer_schema import CustomerCreate
from app.models.customers import Customer
from app.database.db import SessionLocal
from app.models.users import User
from app.auth.hashing import hash_password
from app.auth.hashing import verify_password
from app.auth.token import create_access_token
from app.auth.oauth2 import (
    get_current_admin,
    get_current_customer
)
from app.schemas.customer_schema import (
    ChangePassword,
    ResetPassword
)
from fastapi import Request
import random
from datetime import datetime, timedelta
from app.utils.email_config import send_otp_email


router = APIRouter()


# ---------------- GET ALL CUSTOMERS ----------------

@router.get("/customers")
def get_customers(
    current_user=Depends(get_current_admin)
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
@router.get("/customers/{customer_id}")
def get_customer(
    customer_id: int,
    current_user=Depends(get_current_customer)
):

    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()
    

    if not customer:

        db.close()

        return {
            "message": "Customer Not Found"
        }

    result = {
        "customer_id": customer.customer_id,
        "name": customer.name,
        "phone": customer.phone,
        "email": customer.email
    }

    db.close()

    return result
# ---------------- CREATE CUSTOMER ----------------

# ---------------- CREATE CUSTOMER ----------------

@router.post("/customers")
def create_customer(
    customer: CustomerCreate
):

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
# ---------------- LOGIN ----------------

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:

        db.close()

        return {
            "message": "Invalid Email"
        }

    customer = db.query(Customer).filter(
        Customer.email == user.email
    ).first()

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
        "customer_id": customer.customer_id if customer else None,
        "name": user.name,
        "role": user.role
    }

@router.post("/send-reset-otp")
def send_reset_otp(
    request: Request,
    email: str
):

    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:

        db.close()

        return {
            "message": "Email not registered"
        }

    otp = str(
        random.randint(
            100000,
            999999
        )
    )

    request.session["reset_email"] = email

    request.session["reset_otp"] = otp

    request.session["otp_expiry"] = (
        datetime.now() +
        timedelta(minutes=5)
    ).isoformat()

    send_otp_email(
        email,
        otp
    )

    db.close()

    return {
        "message": "OTP Sent Successfully"
    }
@router.post("/verify-reset-otp")
def verify_reset_otp(
    request: Request,
    otp: str
):

    saved_otp = request.session.get("reset_otp")

    expiry = request.session.get("otp_expiry")

    if not saved_otp or not expiry:

        return {
            "message": "OTP Expired"
        }

    if datetime.now() > datetime.fromisoformat(expiry):

        return {
            "message": "OTP Expired"
        }

    if otp != saved_otp:

        return {
            "message": "Invalid OTP"
        }

    return {
        "message": "OTP Verified"
    }
# ---------------- UPDATE CUSTOMER ----------------
@router.put("/customers/{customer_id}")
def update_customer(
    customer_id: int,
    customer: CustomerCreate,
    current_user=Depends(get_current_admin)
):

    try:

        db = SessionLocal()

        existing_customer = db.query(Customer).filter(
            Customer.customer_id == customer_id
        ).first()

        if not existing_customer:

            db.close()

            return {
                "message": "Customer Not Found"
            }

        existing_customer.name = customer.name
        existing_customer.phone = customer.phone
        existing_customer.email = customer.email
        

        db.commit()

        db.close()

        return {
            "message": "Customer Updated Successfully"
        }

    except Exception as e:

        print("ERROR =", e)

        return {
            "message": str(e)
        }    
# ---------------- DELETE CUSTOMER ----------------

@router.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: int,
    current_user=Depends(get_current_admin)
):

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
@router.put("/customers/change-password/{customer_id}")
def change_password(
    customer_id: int,
    data: ChangePassword,
    current_user=Depends(get_current_customer)
):

    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()

    if not customer:

        db.close()

        return {
            "message": "Customer Not Found"
        }

    user = db.query(User).filter(
        User.email == customer.email
    ).first()

    if not verify_password(
        data.current_password,
        user.password
    ):

        db.close()

        return {
            "message": "Current Password Incorrect"
        }

    new_hash = hash_password(
        data.new_password
    )

    customer.password = new_hash
    user.password = new_hash

    db.commit()

    db.close()

    return {
        "message": "Password Updated Successfully"
    }
@router.get("/test123")
def test123():
    return {
        "message": "Working"
    }
@router.post("/reset-password")
def reset_password(

    request: Request,

    data: ResetPassword

):

    email = request.session.get(
        "reset_email"
    )

    if not email:

        return {

            "message":
            "Session Expired"

        }

    db = SessionLocal()

    user = db.query(User).filter(

        User.email == email

    ).first()

    customer = db.query(Customer).filter(

        Customer.email == email

    ).first()

    if not user:

        db.close()

        return {

            "message":
            "User Not Found"

        }

    new_hash = hash_password(

        data.new_password

    )

    user.password = new_hash

    if customer:

        customer.password = new_hash

    db.commit()

    db.close()

    request.session.clear()

    return {

        "message":
        "Password Updated Successfully"

    }
@router.put("/profile/{customer_id}")
def update_profile(
    customer_id: int,
    customer: CustomerCreate,
    current_user=Depends(get_current_customer)
):

    db = SessionLocal()

    existing_customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()

    if not existing_customer:

        db.close()

        return {
            "message": "Customer Not Found"
        }

    existing_customer.name = customer.name
    existing_customer.phone = customer.phone
    existing_customer.email = customer.email

    user = db.query(User).filter(
        User.email == existing_customer.email
    ).first()

    if user:
        user.name = customer.name
        user.email = customer.email

    db.commit()

    db.close()

    return {
        "message": "Profile Updated Successfully"
    }