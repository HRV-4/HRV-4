import pdfplumber
import re
import json
import sys

def parse_vital_analysis(pdf_path):

    extracted_data = {}
    try:
        with pdfplumber.open(pdf_path) as pdf:
            first_page = pdf.pages[0]
            text = first_page.extract_text()

            patterns = {
        "start_time": (r"start:\s*[\d\.]+\s*([\d:]+)", 1),
        "start_date": (r"start:\s*([\d\.]+)", 1),
        "end_time": (r"end:\s*[\d\.]+\s*([\d:]+)", 1),
        "end_date": (r"end:\s*([\d\.]+)", 1),
        "measurement_time_hours": (r"measurement time\s*([\d:]+)\s*Hours", 1),
        "general_vitality_index": (r"General vitality index\s*([\d,]+)", 1),
        "min_heart_rate_bpm": (r"Minimum heart rate\s*([\d,]+)\s*BpM", 1),
        "max_heart_rate_bpm": (r"Maximum heart rate\s*([\d,]+)\s*BpM", 1),
        "total_heartbeats_24h": (r"Number of heartbeats in 24hs\s*([\d,]+)", 1),
        "total_power_msec2": (r"Total power\s*([\d,]+)\s*msec²", 1),
        "avg_heart_rate_bpm": (r"Overall average heart rate\s*([\d,]+)\s*BpM", 1),
        "sdnn_msec": (r"SDNN\s*([\d,]+)\s*msec", 1),
        "rmssd_msec": (r"RMSSD\s*([\d,]+)\s*msec", 1),
        "pnn50_percent": (r"pNN50\s*([\d,]+)\s*%", 1),
        "biological_age": (r"Current biological age\s*([\d,]+)\s*Years", 1),
        "vlf_msec2": (r"VLF\s*([\d,]+)\s*msec²", 1),
        "vlf_percent":  (r"VLF.*?([\d\.]+)%", 1),
        "lf_msec2": (r"\bLF\s*([\d,]+)\s*msec²", 1),
        "lf_percent": (r"\bLF.*?([\d\.]+)%", 1),
        "hf_msec2": (r"HF\s*([\d,]+)\s*msec²", 1),
        "hf_percent":  (r"HF.*?([\d\.]+)%", 1),
        "ulf_msec2": (r"ULF\s*([\d,]+)\s*msec²", 1),
        "ulf_percent": (r"ULF.*?([\d\.]+)%", 1)
            }

            for key, (pattern, group_index) in patterns.items():
                match = re.search(pattern, text)
                if match:
                    value = match.group(group_index)
                    extracted_data[key] = value
                else:
                    print(f"Warning: No match found for '{key}'", file=sys.stderr)

        json_output = json.dumps(extracted_data, indent=4)
        print(json_output)

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Please provide a PDF file path as an argument", file=sys.stderr)
    else:
        pdf_file_path = sys.argv[1]
        parse_vital_analysis(pdf_file_path)


