from sqlalchemy import Column, Integer, String
from app.database.base import Base
from app.database.db import SessionLocal


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), unique=True, nullable=False)
    email = Column(String(100), unique=True)
    password = Column(String(255), nullable=False)
    