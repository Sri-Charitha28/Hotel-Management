from fastapi import APIRouter
from app.schemas.customer_schema import CustomerCreate

router = APIRouter()


@router.get("/customers")
def get_customers():
    return {"message": "All Customers"}


@router.post("/customers")
def create_customer(customer: CustomerCreate):
    return {
        "message": "Customer Created Successfully",
        "data": customer
    }


@router.put("/customers/{customer_id}")
def update_customer(customer_id: int, customer: CustomerCreate):
    return {
        "message": f"Customer {customer_id} Updated Successfully",
        "data": customer
    }


@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: int):
    return {
        "message": f"Customer {customer_id} Deleted Successfully"
    }