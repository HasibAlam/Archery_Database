from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, MetaData, text, inspect
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()

# ✅ Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ✅ Local MySQL connection (no password, adjust if needed)
DATABASE_URL = "mysql+mysqlconnector://root@localhost:3306/try"

logger.info(f"✅ Using DATABASE_URL: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    metadata = MetaData()
    # Test connection
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    logger.info("✅ Connected to the local MySQL database.")
except Exception as e:
    logger.error(f"❌ Failed to connect to database: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Archery Database API"}

@app.get("/tables")
async def list_tables():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result.fetchall()]
        return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/table/{table_name}")
async def get_table_data(table_name: str):
    try:
        inspector = inspect(engine)
        columns = inspector.get_columns(table_name)
        column_names = [col['name'] for col in columns]

        with engine.connect() as connection:
            result = connection.execute(text(f"SELECT * FROM {table_name} LIMIT 10"))
            data = [dict(zip(result.keys(), row)) for row in result.fetchall()]

        return {
            "table_name": table_name,
            "columns": column_names,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
