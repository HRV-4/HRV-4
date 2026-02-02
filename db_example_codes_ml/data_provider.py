import pandas as pd
from pathlib import Path

# Load the RawData table
raw_data = pd.read_parquet("dataset/v1.0/tables/RawData.parquet")
processed_data = pd.read_parquet("dataset/v1.0/tables/ProcessedData.parquet")

print(processed_data[processed_data['userID'] == 'örnek1013'])