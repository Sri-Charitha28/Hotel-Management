from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.routes.room_routes import router as room_router
from app.routes.customer_routes import router as customer_router
from app.routes.booking_routes import router as booking_router
from app.routes.user_routes import router as user_router

app = FastAPI()

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- STATIC FILES ----------------

app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static"
)

# ---------------- JINJA2 TEMPLATES ----------------

templates = Jinja2Templates(directory="app/templates")

# ---------------- TEMPLATE PAGES ----------------

@app.get("/", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html"
    )


@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={
            "active_page": "dashboard"
        }
    )


@app.get("/rooms-page", response_class=HTMLResponse)
async def rooms_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="rooms.html",
        context={
            "active_page": "rooms"
        }
    )


@app.get("/customers-page", response_class=HTMLResponse)
async def customers_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="customers.html",
        context={
            "active_page": "customers"
        }
    )


@app.get("/bookings-page", response_class=HTMLResponse)
async def bookings_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="bookings.html",
        context={
            "active_page": "bookings"
        }
    )

# ---------------- API ROUTES ----------------

app.include_router(room_router)
app.include_router(customer_router)
app.include_router(booking_router)
app.include_router(user_router)
@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="register.html"
    )


@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html"
    )
@app.get("/home", response_class=HTMLResponse)
async def home_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="home.html"
    )
@app.get("/customer-rooms", response_class=HTMLResponse)
async def customer_rooms_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="customer_rooms.html"
    )
@app.get("/booking-form", response_class=HTMLResponse)
async def booking_form_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="booking_form.html"
    )