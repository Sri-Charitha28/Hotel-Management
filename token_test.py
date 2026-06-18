from app.auth.token import create_access_token

token = create_access_token(
    {"sub": "sri@gmail.com"}
)

print(token)