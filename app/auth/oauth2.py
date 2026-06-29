from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError

from app.auth.token import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/login"
)


# ---------------- VERIFY TOKEN ----------------

def verify_token(
    token: str = Depends(oauth2_scheme)
):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token"
        )


# ---------------- CURRENT USER ----------------

def get_current_user(
    payload: dict = Depends(verify_token)
):

    return payload


# ---------------- ADMIN ONLY ----------------

def get_current_admin(
    payload: dict = Depends(get_current_user)
):

    if payload.get("role") != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin Access Only"
        )

    return payload


# ---------------- CUSTOMER ONLY ----------------

def get_current_customer(
    payload: dict = Depends(get_current_user)
):

    if payload.get("role") != "customer":

        raise HTTPException(
            status_code=403,
            detail="Customer Access Only"
        )

    return payload