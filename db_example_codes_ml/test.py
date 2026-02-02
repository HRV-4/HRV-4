import pandas as pd
from pathlib import Path
import numpy as np
import matplotlib.pyplot as plt

def baevsky_stress_index(rr_ms):
    rr = np.array(rr_ms)
    mo = np.median(rr)
    amo = (np.sum(rr == mo) / len(rr)) * 100
    mx = rr.max()
    mn = rr.min()

    return amo / (2 * mo * (mx - mn))

def windowed_si(rr, window_size):
    si_values = []
    for i in range(0, len(rr) - window_size):
        window = rr[i:i+window_size]
        si_values.append(baevsky_stress_index(window))
    return si_values

def minmax_normalize(si, si_min, si_max):
    return (si - si_min) / (si_max - si_min)


# Load the RawData table
raw_data = pd.read_parquet("dataset/v1.0/tables/RawData.parquet")
processed_data = pd.read_parquet("dataset/v1.0/tables/ProcessedData.parquet")

# Filter for the specific measurementID
measurement_id = "f3ca73fb-4f10-49b5-a537-badf2dcc7d85"
filtered_raw_data = raw_data[raw_data['measurementID'] == measurement_id]
filtered_processed_data = processed_data[processed_data['measurementID'] == measurement_id]

# for i in range(1,1000):
si_values = windowed_si(filtered_raw_data["hrv_data"].values, window_size=100)
si_min = min(si_values)
si_max = max(si_values)

normalized_si = [minmax_normalize(si, si_min, si_max) for si in si_values]
all_day_si = baevsky_stress_index(filtered_raw_data["hrv_data"].values)
print(all_day_si)
normalized_all_day_si = minmax_normalize(all_day_si, si_min, si_max)
print(normalized_all_day_si)

si_mean = np.mean(si_values)
normal = minmax_normalize(si_mean, si_min, si_max)
print(normal)

# # Grafikleri çizdir
# fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))

# # Normalized SI grafiği
# ax1.plot(normalized_si, linewidth=1.5, color='blue')
# ax1.axhline(y=normalized_all_day_si, color='r', linestyle='--', label=f'Normalized All-day SI: {normalized_all_day_si:.4f}')
# ax1.set_xlabel('Window Index')
# ax1.set_ylabel('Normalized Stress Index')
# ax1.set_title(f'Normalized Stress Index - Measurement ID: {measurement_id}')
# ax1.legend()
# ax1.grid(True, alpha=0.3)

# # HRV Data grafiği
# hrv_data = filtered_raw_data["hrv_data"].values
# ax2.plot(hrv_data, linewidth=1, color='green', alpha=0.7)
# ax2.set_xlabel('Sample Index')
# ax2.set_ylabel('HRV Data (ms)')
# ax2.set_title(f'Heart Rate Variability Data - Measurement ID: {measurement_id}')
# ax2.grid(True, alpha=0.3)

# plt.tight_layout()
# plt.show()
