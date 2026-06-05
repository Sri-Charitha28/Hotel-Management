from fastapi import APIRouter
from app.schemas.customer_schema import CustomerCreate
from app.models.customers import Customer
from app.database.db import SessionLocal

router = APIRouter()


# ---------------- GET ALL CUSTOMERS ----------------

@router.get("/customers")
def get_customers():

    db = SessionLocal()

    #customers = db.query(Customer).all()
    customers = db.query(Customer).order_by(Customer.customer_id).all()
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

@router.post("/customers")
def create_customer(customer: CustomerCreate):

    db = SessionLocal()

    new_customer = Customer(
        name=customer.name,
        phone=customer.phone,
        email=customer.email
    )

    db.add(new_customer)
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