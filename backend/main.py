from fastapi import FastAPI, HTTPException
from sqlalchemy import create_engine, MetaData, text, inspect
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

app = FastAPI()

# ✅ Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow any origin (can be restricted)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# ✅ Logging setup for debugging (Enhanced)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ✅ Correct Database URL for Render (NO PASSWORD)
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+mysqlconnector://root@archery-database.onrender.com:3306/archery_ER_based")
logger.info(f"✅ Using DATABASE_URL: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    metadata = MetaData()
    # ✅ Test the connection immediately for clear logs
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    logger.info("✅ Successfully connected to the database.")
except Exception as e:
    logger.error(f"❌ Failed to connect to the database: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Archery Database API"}

@app.get("/tables")
async def list_tables():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result.fetchall()]
            logger.info(f"✅ Retrieved tables: {tables}")
        return {"tables": tables}
    except Exception as e:
        logger.error(f"❌ Error fetching tables: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching tables: {str(e)}")

@app.get("/table/{table_name}")
async def get_table_columns(table_name: str):
    try:
        inspector = inspect(engine)
        columns = inspector.get_columns(table_name)
        column_names = [column['name'] for column in columns]

        with engine.connect() as connection:
            result = connection.execute(text(f"SELECT * FROM {table_name} LIMIT 10"))
            data = [dict(zip(result.keys(), row)) for row in result.fetchall()]

        logger.info(f"✅ Retrieved data from {table_name}: {data}")
        return {
            "table_name": table_name,
            "columns": column_names,
            "data": data
        }
    except Exception as e:
        logger.error(f"❌ Error fetching table data for {table_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching table data: {str(e)}")
