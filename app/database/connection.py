import psycopg2  # connects to the PostgreSQL database using the psycopg2 library.

try:
    conn = psycopg2.connect(
        host="localhost",
        database="Hospital_management_System",
        user="postgres",
        password="Ammu@29",
        port="5432"
    )

    print("Database Connected Successfully!")

    conn.close()

except Exception as e:
    print("Database Connection Failed!")
    print("Error:", e)