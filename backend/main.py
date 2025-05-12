from fastapi import FastAPI
from sqlalchemy import create_engine, MetaData, text, inspect
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow any frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MySQL connection setup
DATABASE_URL = "mysql+mysqlconnector://root:@localhost/archery_ER_based"

try:
    engine = create_engine(DATABASE_URL)
    metadata = MetaData()
    logger.info("✅ Connected to the database.")
except Exception as e:
    logger.error(f"❌ Failed to connect to the database: {str(e)}")

@app.get("/tables")
async def list_tables():
    try:
        connection = engine.connect()
        result = connection.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result.fetchall()]
        connection.close()
        logger.info(f"✅ Retrieved tables: {tables}")
        return {"tables": tables}
    except Exception as e:
        logger.error(f"❌ Error fetching tables: {str(e)}")
        return {"error": str(e)}

@app.get("/table/{table_name}")
async def get_table_columns(table_name: str):
    try:
        inspector = inspect(engine)
        columns = inspector.get_columns(table_name)
        column_names = [column['name'] for column in columns]

        # Even if the table is empty, show column names
        connection = engine.connect()
        result = connection.execute(text(f"SELECT * FROM {table_name} LIMIT 10"))
        data = [dict(zip(result.keys(), row)) for row in result.fetchall()]
        connection.close()

        logger.info(f"✅ Retrieved data from {table_name}: {data}")
        return {
            "table_name": table_name,
            "columns": column_names,
            "data": data  # This might be empty
        }
    except Exception as e:
        logger.error(f"❌ Error fetching table data for {table_name}: {str(e)}")
        return {"error": str(e)}
