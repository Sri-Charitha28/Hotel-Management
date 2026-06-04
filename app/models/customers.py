from sqlalchemy import Column, Integer, String
from app.database.base import Base
from app.database.db import SessionLocal


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    email = Column(String(100), unique=True)


# ---------------- CREATE ----------------

def create_customer(name, phone, email):
    db = SessionLocal()

    new_customer = Customer(
        name=name,
        phone=phone,
        email=email
    )

    db.add(new_customer)
    db.commit()

    print("Customer Added Successfully!")

    db.close()


# ---------------- READ ----------------

def read_customers():
    db = SessionLocal()

    customers = db.query(Customer).all()

    for customer in customers:
        print(
            customer.customer_id,
            customer.name,
            customer.phone,
            customer.email
        )

    db.close()


# ---------------- UPDATE ----------------

def update_customer(customer_id, new_email):
    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()

    if customer:
        customer.email = new_email
        db.commit()
        print("Customer Updated Successfully!")
    else:
        print("Customer Not Found!")

    db.close()


# ---------------- DELETE ----------------

def delete_customer(customer_id):
    db = SessionLocal()

    customer = db.query(Customer).filter(
        Customer.customer_id == customer_id
    ).first()

    if customer:
        db.delete(customer)
        db.commit()
        print("Customer Deleted Successfully!")
    else:
        print("Customer Not Found!")

    db.close()