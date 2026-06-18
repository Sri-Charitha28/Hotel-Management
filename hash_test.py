from app.auth.hashing import hash_password
from app.database.db import SessionLocal
from app.models.customers import Customer
from app.auth.hashing import hash_password

print(hash_password("admin123"))

db = SessionLocal()

customers = db.query(Customer).filter(
    Customer.password == None
).all()

for customer in customers:
    customer.password = hash_password("default123")

db.commit()
db.close()

print("Passwords Updated Successfully")