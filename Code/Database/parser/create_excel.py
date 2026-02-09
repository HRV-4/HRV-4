import pdfplumber
import re
import json
import sys
import os
import pandas as pd


class CreateExcel():
    def __init__(self, processed_excel_path, txt_path, HRVvital_analysis, HRVvital_analysis_overview, activity_protocol, HRVmed_analysis):
        self.processed_excel_path = processed_excel_path
        self.txt_path = txt_path
        self.F = re.IGNORECASE | re.DOTALL | re.MULTILINE
        self.HRVvital_analysis = HRVvital_analysis
        self.HRVvital_analysis_overview = HRVvital_analysis_overview
        self.activity_protocol = activity_protocol
        self.HRVmed_analysis = HRVmed_analysis

    def grab_score_and_percent(self, text_block, header, window=2000):
        m_head = re.search(re.escape(header), text_block, self.F)
        if not m_head:
            return None, None, None
        seg = text_block[m_head.end(): m_head.end() + window]

        m_score = re.search(r"([\d.]+)\s*out of 10", seg, self.F)
        score = float(m_score.group(1)) if m_score else None

        m_pct = re.search(r"(\d+)\s*%\s*(above|below)\s*average", seg, self.F)
        if not m_pct:
            m_pct = re.search(r"(\d+)%\s*(above|below)\s*average", seg, self.F)
        percent = int(m_pct.group(1)) if m_pct else None
        direction = m_pct.group(2).lower() if m_pct else None

        return score, percent, direction

    def parse_vital_analysis(self):
        extracted = {}
        pdf_path = self.HRVvital_analysis

        if not os.path.exists(pdf_path):
            raise FileNotFoundError(pdf_path)

        with pdfplumber.open(pdf_path) as pdf:
            text_all = "\n".join(
                (page.extract_text() or "")
                for page in pdf.pages
            )

        # 1) State of Health
        s, p, d = self.grab_score_and_percent(text_all, "state of health")
        if s is not None:
            extracted["state_of_health_score"] = s
        if p is not None:
            extracted["state_of_health_percent_value"] = p
        if d is not None:
            extracted["state_of_health_percent_direction"] = d

        # 2) Performance Potential
        s, p, d = self.grab_score_and_percent(text_all, "performance potential")
        if s is not None:
            extracted["performance_potential_score"] = s
        if p is not None:
            extracted["performance_potential_percent_value"] = p
        if d is not None:
            extracted["performance_potential_percent_direction"] = d

        # 3) Processing of Stress
        s, p, d = self.grab_score_and_percent(text_all, "processing of stress")
        if s is not None:
            extracted["processing_of_stress_score"] = s
        if p is not None:
            extracted["processing_of_stress_percent_value"] = p
        if d is not None:
            extracted["processing_of_stress_percent_direction"] = d

        # 4) Burnout Resistance
        s, p, d = self.grab_score_and_percent(text_all, "burnout resistance")
        if s is not None:
            extracted["burnout_resistance_score"] = s
        if p is not None:
            extracted["burnout_resistance_percent_value"] = p
        if d is not None:
            extracted["burnout_resistance_percent_direction"] = d

        # 5) Dynamic A / B
        m = re.search(r"Dynamic A\s+(-?[\d.,]+)\s*BpM", text_all, self.F)
        if m:
            extracted["dynamic_A_bpm"] = float(m.group(1))

        m = re.search(r"Dynamic B\s+(-?[\d.,]+)\s*BpM", text_all, self.F)
        if m:
            extracted["dynamic_B_bpm"] = float(m.group(1))

        # 6) Biological age
        m = re.search(r"Your\s+current\s+biological\s+age\s+is\s*(\d+)\s*years", text_all, self.F)
        if m:
            extracted["biological_age_years"] = int(m.group(1))

        m = re.search(r"\s*(\d+)\s*%\s*(older|younger)\s*than", text_all, self.F)
        if m:
            extracted["biological_age_percent_value"] = int(m.group(1))
            extracted["biological_age_percent_direction"] = m.group(2).lower()

        return extracted

    def parse_vital_analysis_overview(self):
        pdf_path = self.HRVvital_analysis_overview

        if not os.path.exists(pdf_path):
            raise FileNotFoundError(pdf_path)

        out = {}
        with pdfplumber.open(pdf_path) as pdf:
            text = (pdf.pages[0].extract_text() or "")

        m = re.search(r"General vitality index\s*([\d.]+)", text, self.F)
        if m:
            out["general_vitality_index"] = float(m.group(1))

        m = re.search(r"Minimum heart rate\s*([\d.]+)\s*BpM", text, self.F)
        if m:
            out["min_heart_rate_bpm"] = float(m.group(1))

        m = re.search(r"Maximum heart rate\s*([\d.]+)\s*BpM", text, self.F)
        if m:
            out["max_heart_rate_bpm"] = float(m.group(1))

        return out
    
    def parse_med_analysis(self):
        extracted = {}
        pdf_path = self.HRVmed_analysis

        if not os.path.exists(pdf_path):
            raise FileNotFoundError(pdf_path)

        with pdfplumber.open(pdf_path) as pdf:
            text_p1 = (pdf.pages[0].extract_text() or "")
            text_p2 = (pdf.pages[1].extract_text() or "")

        lines1 = text_p1.splitlines()
        extracted["patient_name"] = re.sub(r"\b\d{4}-\d{2}-\d{2}\b", "", lines1[1]).strip()

        m = re.findall(r"\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}", lines1[3])
        if m:
            extracted["measurement_date"] = m[0]
        
        lines2 = text_p2.splitlines()
        
        m = re.findall(r"\d+,\d+", lines2[3])
        if m:
            extracted["heart_beats"] = int(m[0].replace(",", ""))
        
        m = re.findall(r"\d+,\d+.\d+|\d+\.\d+", lines2[7])
        if m:
            extracted["total_power"] = float(m[0].replace(",", ""))
            extracted["total_power_sleep"] = float(m[1].replace(",", ""))

        m = re.findall(r"\d+,\d+.\d+|\d+\.\d+", lines2[8])
        if m:
            extracted["ulf"] = float(m[0].replace(",", ""))
            extracted["ulf_sleep"] = float(m[2].replace(",", ""))

        m = re.findall(r"\d+,\d+.\d+|\d+\.\d+", lines2[9])
        if m:
            extracted["vlf"] = float(m[0].replace(",", ""))
            extracted["vlf_sleep"] = float(m[2].replace(",", ""))
        
        m = re.findall(r"\d+,\d+.\d+|\d+\.\d+", lines2[10])
        if m:
            extracted["lf"] = float(m[0].replace(",", ""))
            extracted["lf_sleep"] = float(m[2].replace(",", ""))

        m = re.findall(r"\d+,\d+.\d+|\d+\.\d+", lines2[11])
        if m:
            extracted["hf"] = float(m[0].replace(",", ""))
            extracted["hf_sleep"] = float(m[2].replace(",", ""))

        m = re.findall(r"\d+,\d+.\d+|\d+\.\d+", lines2[12])
        if m:
            extracted["pnn50"] = float(m[0])
            extracted["pnn50_sleep"] = float(m[1])

        m = re.findall(r"\d+,\d+.\d+|\d+\.\d+", lines2[13])
        if m:
            extracted["sdnn"] = float(m[0].replace(",", ""))
            extracted["sdnn_sleep"] = float(m[1].replace(",", ""))

        m = re.findall(r"\d+,\d+.\d+|\d+\.\d+", lines2[14])
        if m:
            extracted["rmssd"] = float(m[0].replace(",", ""))
            extracted["rmssd_sleep"] = float(m[1].replace(",", ""))
        
        return extracted
    
    def parse_activity_protocol(self):
        pdf_path = self.activity_protocol

        if not os.path.exists(pdf_path):
            raise FileNotFoundError(pdf_path)
        
        out = []
        with pdfplumber.open(pdf_path) as pdf:
            table = (pdf.pages[0].extract_tables()[0] or [])
            
        for row in table[1:]:
            activity = {
                "#": None,
                "Type": None,
                "Start": None,
                "End": None,
                "Length": None,
                "Grade": None,
                "Note": None,
            }

            for col_index, header in enumerate(table[0]):
                if header in activity and col_index < len(row):
                    activity[header] = row[col_index]

            out.append(activity)
        return out

    def compare_with_excel(self, pdf_values: dict, column_map: dict, row_index: int = None, update_excel: bool = False, sign_percents_by_direction: bool = True):
        excel_path = self.processed_excel_path

        if not os.path.exists(excel_path):
            raise FileNotFoundError(excel_path)

        df = pd.read_excel(excel_path, dtype=object)
        updated_df = df.copy() if update_excel else df

        if update_excel:
            if len(updated_df) == 0:
                row_index = 0 if row_index is None else row_index
                updated_df.loc[row_index] = None
            else:
                if row_index is None:
                    row_index = len(updated_df)
                if row_index >= len(updated_df):
                    updated_df.loc[row_index] = None
        else:
            if row_index is None or row_index >= len(updated_df):
                raise IndexError(
                    f"Excel has only {len(updated_df)} rows, requested row_index={row_index}"
                )

        directions = {
            k.replace("_percent_direction", ""): v
            for k, v in pdf_values.items()
            if k.endswith("_percent_direction") and isinstance(v, str)
        }

        for key, pdf_val in pdf_values.items():
            col = column_map.get(key)
            if not col or col not in updated_df.columns:
                continue

            if sign_percents_by_direction and key.endswith("_percent_value"):
                base = key.replace("_percent_value", "")
                dir_val = directions.get(base, None)

                if isinstance(pdf_val, (int, float)) and dir_val == "below":
                    pdf_val = -float(pdf_val)
                if isinstance(pdf_val, (int, float)) and dir_val == "older":
                    pdf_val = -float(pdf_val)

            if update_excel and updated_df[col].dtype != object:
                updated_df[col] = updated_df[col].astype(object)

            updated_df.at[row_index, col] = pdf_val

        if update_excel:
            name, ext = os.path.splitext(os.path.basename(self.txt_path))
            directory = os.path.dirname(self.txt_path)
            updated_df.to_excel(f"{directory}/processed_excels/{name}.xlsx", index=False)

if __name__ == "__main__":
    lines = [line.strip() for line in sys.stdin.readlines()]
    if len(lines) < 6:
        print("Provide exactly 6 arguments")
        sys.exit(1)

    processed_excel, txt, vital, vital_overview, activity, med = lines[:6]

    create = CreateExcel(
        processed_excel_path=processed_excel,
        txt_path=txt,
        HRVvital_analysis=vital,
        HRVvital_analysis_overview=vital_overview,
        activity_protocol=activity,
        HRVmed_analysis=med,
    )

    med_analysis = create.parse_med_analysis()
    vital_analysis = create.parse_vital_analysis()
    vital_analysis_overview = create.parse_vital_analysis_overview()

    pdf_values = {**med_analysis, **vital_analysis, **vital_analysis_overview}

    column_map = {
        "patient_name": "hasta adı",
        "measurement_date": "ÖLÇÜM TARİHİ",
        "heart_beats": "Heart Beats",
        "total_power": "TP",
        "total_power_sleep": "TP(Gece)",
        "ulf": "ULF",
        "ulf_sleep": "ULF (Gece)",
        "vlf": "VLF",
        "vlf_sleep": "VLF (Gece)",
        "lf": "LF",
        "lf_sleep": "LF (gece)",
        "hf": "HF",
        "hf_sleep": "HF (Gece)",
        "pnn50": "pNN50",
        "pnn50_sleep": "pNN50 (Gece)",
        "sdnn": "SDNN",
        "sdnn_sleep": "SDNN (Gece)",
        "rmssd": "RMSSD ",
        "rmssd_sleep": "RMSSD (Gece)",
        "state_of_health_score": "State of Health (?/10)",
        "state_of_health_percent_value": "State of Health (%)",
        "performance_potential_score": "Performance Potential (?/10)",
        "performance_potential_percent_value": "Performance Potential (%)",
        "processing_of_stress_score": "Processing of Stress (?/10)",
        "processing_of_stress_percent_value": "Processing of Stress (%)",
        "burnout_resistance_score": "Burnout Resistance (?/10)",
        "burnout_resistance_percent_value": "Burnout Resistance (%)",
        "biological_age_years": "Biyolojik Yaş",
        "biological_age_percent_value": "Biyolojik Yaş (%)",
        "dynamic_A_bpm": "Dynamic A",
        "dynamic_B_bpm": "Dynamic B",
        "general_vitality_index": "GVI",
        "min_heart_rate_bpm": "Min HR",
        "max_heart_rate_bpm": "Mx HR"
    }

    create.compare_with_excel(
        pdf_values,
        column_map,
        update_excel=True,
        sign_percents_by_direction=True
    )

    activities = create.parse_activity_protocol()
