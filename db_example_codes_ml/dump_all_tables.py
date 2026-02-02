from sqlalchemy import create_engine, inspect
import pandas as pd
from pathlib import Path

DB_URL = "postgresql://postgres:postgres@localhost:5432/v1"

engine = create_engine(DB_URL)
inspector = inspect(engine)

out = Path("dataset/v1.0/tables")
out.mkdir(parents=True, exist_ok=True)

tables = inspector.get_table_names()

print(f"{len(tables)} tables found:")

for table in tables:
    print(f"{table}")
    df = pd.read_sql_table(table, engine)
    df.to_parquet(
        out / f"{table}.parquet",
        engine="pyarrow",
        compression="snappy"
    )

print("All tables dumped successfully")
