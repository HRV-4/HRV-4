from datetime import datetime, timedelta 
from sqlalchemy import create_engine, inspect 
import pandas as pd 
import numpy as np 
import uuid 
import os 
import unicodedata 
import traceback 
from createDB import CreateDB
from create_excel import CreateExcel
from sqlalchemy.exc import IntegrityError
import psycopg2


class InsertDatabase:
    """
    Class to handle database insertions for users, raw HRV data, and processed HRV data.
    Also handles creating timestamped HRV Excel files from txt RR intervals.
    """

    def __init__(self, db_user_name, db_user_password, db_port, db_name, HRVvital_analysis, HRVvital_analysis_overview, activity_protocol, HRVmed_analysis, raw_excel_path="", processed_excel_path="", txt_path=""):
        """
        Initialize the database engine and store file paths.
        """
        self.raw_excel_path = raw_excel_path
        self.processed_excel_path = processed_excel_path
        self.txt_path = txt_path
        self.db_user_name = db_user_name
        self.db_user_password = db_user_password
        self.db_port = db_port
        self.db_name = db_name
        self.HRVvital_analysis = HRVvital_analysis
        self.HRVvital_analysis_overview = HRVvital_analysis_overview
        self.activity_protocol = activity_protocol
        self.HRVmed_analysis = HRVmed_analysis

        # Create Processed and Raw directories inside of all data folders
        processed_dir = os.path.dirname(self.processed_excel_path)
        if not os.path.exists(processed_dir):
            os.makedirs(processed_dir)

        raw_dir = os.path.dirname(self.raw_excel_path)
        if not os.path.exists(raw_dir):
            os.makedirs(raw_dir)

        try:
            # Create SQLAlchemy engine for PostgreSQL
            self.connection_string = f"postgresql+psycopg2://{self.db_user_name}:{self.db_user_password}@localhost:{self.db_port}/{self.db_name}"
            self.engine = create_engine(self.connection_string)
            print("Database connection ready.")
        except Exception as e:
            # Connection failed, print error and traceback
            print(f"Database connection failed: {e}")
            traceback.print_exc()

    def insert_user(self):
        """
        Insert user info into the Users table.
        Steps:
        1. Read the raw Excel file.
        2. Extract user info from first 4 rows.
        3. Extract userID from filename.
        4. Convert age to int or None.
        5. Ensure Users table exists.
        6. Create a pandas DataFrame and insert it into DB.
        """
        if not os.path.exists(self.raw_excel_path):
            print(f"Raw Excel not found: {self.raw_excel_path}")
            return

        try:
            raw_df = pd.read_excel(self.raw_excel_path)

            # Extract user info from specific rows
            age = str(raw_df.loc[0, "Katılımcının:"]).split(":")[-1].strip()
            gender = str(raw_df.loc[1, "Katılımcının:"]).split(":")[-1].capitalize().strip()
            clinical_story = str(raw_df.loc[2, "Katılımcının:"]).split(":")[-1].strip()
            notes = str(raw_df.loc[3, "Katılımcının:"]).split(":")[-1].strip()

            # Extract userID from filename (assumes format: örnek_XXXX_date.xlsx)
            raw_file_name = os.path.basename(self.raw_excel_path)
            raw_file_name = unicodedata.normalize('NFC',raw_file_name)  # normalize Turkish characters
            user_id = int(raw_file_name[5:9])  # adjust according to your filename pattern

            # Convert age to integer if valid
            age = None if age.lower() in ["", "nan"] else int(age)

            # Create user DataFrame
            user_data = {
                "userID": [user_id],
                "age": [age],
                "gender": [gender],
                "clinical_story": [clinical_story],
                "notes": [notes]
            }
            user_df = pd.DataFrame(user_data)
            user_df['age'] = user_df['age'].astype("Int64")  # Allow NaN integers

            # Check if user table is exist -> if not create
            inspector = inspect(self.engine)
            tables = inspector.get_table_names()

            if 'Users' not in tables:
                print("Users table doesn't exists.")
                DBCreator = CreateDB(self.connection_string)
                DBCreator.create_users()

            existing_ids = pd.read_sql('SELECT "userID" FROM "Users"', self.engine)
            if user_id in existing_ids["userID"].values:
                return

            # Insert into database with transaction, if IntegrityError skip.
            with self.engine.begin() as conn:
                try:
                    user_df.to_sql('Users', conn, if_exists='append', index=False)
                except IntegrityError as e:
                    if isinstance(e.orig, psycopg2.errors.UniqueViolation):
                        print("Duplicate UserID in Users. Skipping insert.")
                    else:
                        raise
            print(f"User inserted: {user_id}")

        except Exception as e:
            print(f"User insert failed: {e}")
            traceback.print_exc()

    def insert_raw_data(self):
        """
        Insert raw HRV data into RawData table.
        Steps:
        1. Read raw Excel file.
        2. Ensure Users table exists and user exists in Users table.
        3. Select relevant columns and forward-fill missing values.
        4. Convert HRV data column to float.
        5. Rename columns to match DB schema.
        6. Ensure RawData table exists.
        7. Insert into database.
        """
        if not os.path.exists(self.raw_excel_path):
            print(f"Raw Excel not found: {self.raw_excel_path}")
            return

        try:
            raw_data_df = pd.read_excel(self.raw_excel_path)
            raw_file_name = os.path.basename(self.raw_excel_path)
            raw_file_name = unicodedata.normalize('NFC', raw_file_name)
            user_id = int(raw_file_name[5:9])

            # Check if user table exist -> if not create
            inspector = inspect(self.engine)
            tables = inspector.get_table_names()

            if 'Users' not in tables:
                print("Users table exists.")
                DBCreator = CreateDB(self.connection_string)
                DBCreator.create_users()

            # Check if user exists
            existing_ids = pd.read_sql('SELECT "userID" FROM "Users"', self.engine)
            if user_id not in existing_ids["userID"].values:
                self.insert_user()

            # Select columns for raw data
            raw_data_df = raw_data_df[["Timestamp", "Raw Data Sütunları", "Aktivite Protokolü",
                                    "Doktor Yorumları", "MeasurementID"]]

            # Add userID column
            raw_data_df["userID"] = user_id

            # Forward-fill protocol, doctor comments, measurementID
            raw_data_df["Aktivite Protokolü"] = raw_data_df["Aktivite Protokolü"].ffill()
            raw_data_df["Doktor Yorumları"] = raw_data_df["Doktor Yorumları"].ffill()
            raw_data_df["MeasurementID"] = raw_data_df["MeasurementID"].ffill()
            raw_data_df["Raw Data Sütunları"] = raw_data_df["Raw Data Sütunları"].astype("float64")

            # Rename columns to DB schema
            raw_data_df.rename(columns={
                "MeasurementID": "measurementID",
                "Timestamp": "timestamp",
                "Raw Data Sütunları": "hrv_data",
                "Aktivite Protokolü": "activity",
                "Doktor Yorumları": "doctor_comments"
            }, inplace=True)

            # Check if RawData table exist -> if not create
            if 'RawData' not in tables:
                print("RawData table doesn't exists.")
                DBCreator = CreateDB(self.connection_string)
                DBCreator.create_raw_data()

            # Insert into database with transaction, if IntegrityError skip.
            with self.engine.begin() as conn:
                try:
                    raw_data_df.to_sql('RawData', conn, if_exists='append', index=False)
                except IntegrityError as e:
                    if isinstance(e.orig, psycopg2.errors.UniqueViolation):
                        print("Duplicate measurementID in RawData. Skipping insert.")
                    else:
                        raise

            print(f"Raw data inserted for user: {user_id}")

        except Exception as e:
            print(f"Raw data insert failed: {e}")
            traceback.print_exc()


    def insert_processed_data(self):
        """
        Insert processed HRV data into ProcessedData table.
        Steps:
        1. Read processed Excel file.
        2. Ensure Users table and user exists.
        3. Clean object columns using clean_and_float.
        4. Add userID column.
        5. Rename columns to lowercase and underscores.
        6. Ensure ProcessedData table exists.
        7. Insert into database.
        """
        if not os.path.exists(self.processed_excel_path):
            print(f"Processed Excel not found: {self.processed_excel_path}")
            return

        try:
            processed_data_df = pd.read_excel(self.processed_excel_path)
            processed_file_name = os.path.basename(self.processed_excel_path)
            processed_file_name = unicodedata.normalize('NFC', processed_file_name)
            user_id = int(processed_file_name[5:9])

            # Check if user table is exist -> if not create
            inspector = inspect(self.engine)
            tables = inspector.get_table_names()

            if 'Users' not in tables:
                print("Users table doesn't exists.")
                DBCreator = CreateDB(self.connection_string)
                DBCreator.create_users()

            # Ensure user exists
            existing_ids = pd.read_sql('SELECT "userID" FROM "Users"', self.engine)
            if user_id not in existing_ids["userID"].values:
                self.insert_user()

            # Clean all object/string columns
            processed_data_df = processed_data_df[['ÖLÇÜM TARİHİ', 'Biyolojik Yaş', 'Biyolojik Yaş (%)', 'Heart Beats', 'Min HR', 'Mx HR',
                        'GVI', 'Dynamic A', 'Dynamic B', 'TP', 'ULF', 'VLF', 'LF', 'HF', 'pNN50', 'SDNN', 'RMSSD ',
                        'TP(Gece)', 'ULF (Gece)', 'VLF (Gece)', 'LF (gece)', 'HF (Gece)', 'pNN50 (Gece)', 'SDNN (Gece)', 'RMSSD (Gece)',
                        'Burnout Resistance (?/10)', 'Burnout Resistance (%)', 'Performance Potential (?/10)', 'Performance Potential (%)',
                        'Processing of Stress (?/10)', 'Processing of Stress (%)', 'State of Health (?/10)', 'State of Health (%)', 'Start', 'End', 'Measurement_Time', 'MeasurementID']]

            cols = ['Biyolojik Yaş', 'Biyolojik Yaş (%)', 'Heart Beats', 'Min HR', 'Mx HR',
                    'GVI', 'Dynamic A', 'Dynamic B', 'TP', 'ULF', 'VLF', 'LF', 'HF', 'pNN50', 'SDNN', 'RMSSD ',
                    'TP(Gece)', 'ULF (Gece)', 'VLF (Gece)', 'LF (gece)', 'HF (Gece)', 'pNN50 (Gece)', 'SDNN (Gece)', 'RMSSD (Gece)',
                    'Burnout Resistance (?/10)', 'Burnout Resistance (%)', 'Performance Potential (?/10)', 'Performance Potential (%)',
                    'Processing of Stress (?/10)', 'Processing of Stress (%)', 'State of Health (?/10)', 'State of Health (%)']

            processed_data_df[cols] = processed_data_df[cols].apply(lambda col: col.map(self.clean_and_float))
            processed_data_df[cols] = processed_data_df[cols].astype("float64")

            # Add userID column
            processed_data_df["userID"] = user_id

            # Rename columns for DB
            processed_data_df.rename(columns={
                "ÖLÇÜM TARİHİ": "timestamp",
                "Biyolojik Yaş": "biological_age",
                "Biyolojik Yaş (%)": "biological_age_percent",
                "Heart Beats": "heart_beats",
                "Min HR": "min_hr",
                "Mx HR": "max_hr",
                "GVI": "gvi",
                "Dynamic A": "dynamic_a",
                "Dynamic B": "dynamic_b",
                "TP": "tp",
                "ULF": "ulf",
                "VLF": "vlf",
                "LF": "lf",
                "HF": "hf",
                "pNN50": "pnn_50",
                "SDNN": "sdnn",
                "RMSSD ": "rmssd",
                "TP(Gece)": "tp_night",
                "ULF (Gece)": "ulf_night",
                "VLF (Gece)": "vlf_night",
                "LF (gece)": "lf_night",
                "HF (Gece)": "hf_night",
                "pNN50 (Gece)": "pnn_50_night",
                "SDNN (Gece)": "sdnn_night",
                "RMSSD (Gece)": "rmssd_night",
                "Burnout Resistance (?/10)": "burnout_resistance",
                "Burnout Resistance (%)": "burnout_resistance_percent",
                "Performance Potential (?/10)": "performance_potential",
                "Performance Potential (%)": "performance_potential_percent",
                "Processing of Stress (?/10)": "stress",
                "Processing of Stress (%)": "stress_percent",
                "State of Health (?/10)": "health_state",
                "State of Health (%)": "health_state_percent",
                "Start": "start_timestamp",
                "End": "end_timestamp",
                "Measurement_Time": "measurement_time",
                "MeasurementID": "measurementID"
            }, inplace=True)

            if 'ProcessedData' not in tables:
                print("ProcessedData table doesn't exists.")
                DBCreator = CreateDB(self.connection_string)
                DBCreator.create_processed_data()

            # Insert into DB with transaction, if IntegrityError skip.
            with self.engine.begin() as conn:
                try:
                    processed_data_df.to_sql('ProcessedData', conn, if_exists='append', index=False)
                except IntegrityError as e:
                    if isinstance(e.orig, psycopg2.errors.UniqueViolation):
                        print("Duplicate measurementID in ProcessedData. Skipping insert.")
                    else:
                        raise

            print(f"Processed data inserted for user: {user_id}")

        except Exception as e:
            print(f"Processed data insert failed: {e}")
            traceback.print_exc()

    def createRawExcel(self):
        """
        Convert a txt file of RR intervals into timestamped HRV Excel files.
        Steps:
        1. Read the start date from first line.
        2. Read RR intervals from remaining lines.
        3. Validate RR intervals are reasonable (0-3000ms).
        4. Generate timestamps by cumulatively adding RR intervals.
        5. Update raw Excel template with timestamps and measurementID.
        6. Update processed Excel with start/end time, duration, and measurementID.
        """
        # If already created, return
        if os.path.exists(self.raw_excel_path):
            print("Raw Excel already exists.")
            return

        if not os.path.exists(self.txt_path):
            print(f"TXT file not found: {self.txt_path}")
            return

        try:
            ms_times = []
            with open(self.txt_path, "r", encoding="utf-8") as file:
                date = file.readline().strip()  # first line is start date
                for line in file:
                    line = line.strip()
                    if line:
                        ms_times.append(int(line))

            date_obj = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")

            # Generate timestamps
            timestamps = []
            for ms in ms_times:
                timestamps.append(date_obj.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3])
                date_obj += timedelta(milliseconds=ms)

            start_timestamp = datetime.strptime(timestamps[0], "%Y-%m-%d %H:%M:%S.%f")
            end_timestamp = datetime.strptime(timestamps[-1], "%Y-%m-%d %H:%M:%S.%f")
            measurement_time = timedelta(seconds=end_timestamp.timestamp() - start_timestamp.timestamp())
            measurement_id = str(uuid.uuid4())

            # Update raw Excel template
            raw_df = pd.read_excel("raw_template.xlsx")
            raw_df = raw_df.reindex(range(len(timestamps)))  # extend rows
            raw_df['Timestamp'] = timestamps
            raw_df['Raw Data Sütunları'] = ms_times
            raw_df.iloc[:, 2:4] = np.nan  # placeholder for unused columns
            raw_df.loc[0, 'MeasurementID'] = measurement_id
            filename = os.path.splitext(os.path.basename(self.txt_path))[0]
            raw_df.to_excel(self.raw_excel_path, index=False)

            # Update processed Excel file
            processed_df = pd.read_excel(self.processed_excel_path)
            processed_df.loc[0, 'Start'] = start_timestamp
            processed_df.loc[0, 'End'] = end_timestamp
            processed_df.loc[0, 'Measurement_Time'] = str(measurement_time)
            processed_df.loc[0, 'MeasurementID'] = measurement_id
            processed_df.to_excel(self.processed_excel_path, index=False)

            print(f"RawData file processed: {filename}")

        except Exception as e:
            print(f"RawData File creation failed: {e}")
            traceback.print_exc()


    def updateActivities(self):
        """
        Insert Activity Data into RawData Excel
        """
        create = CreateExcel(
            processed_excel_path="processed_template.xlsx",
            txt_path=self.txt_path,
            HRVvital_analysis=self.HRVvital_analysis,
            HRVvital_analysis_overview=self.HRVvital_analysis_overview,
            activity_protocol=self.activity_protocol,
            HRVmed_analysis=self.HRVmed_analysis
        )
        
        activities = create.parse_activity_protocol()

        # Load the RawData Excel for Timestamp obtaining and Activity entering
        df = pd.read_excel(self.raw_excel_path)
        copy_df = pd.read_excel(self.raw_excel_path)

        # Convert Timestamp Column into datetime object
        copy_df['Timestamp'] = pd.to_datetime(copy_df['Timestamp'])

        # Obtain the date
        main_date = copy_df['Timestamp'].min().date()

        # Processing activities according to their start and end times
        processed_activities = []
        for activity in activities:
            start_time_str = activity['Start']
            end_time_str = activity['End']
            activity_type = activity['Type']

            # Combining the date with the time
            start_dt = pd.to_datetime(f"{main_date} {start_time_str}")
            end_dt = pd.to_datetime(f"{main_date} {end_time_str}")

            # If start time > end_time -> tomorrow
            if end_dt <= start_dt:
                end_dt += timedelta(days=1)
                
            # If activity starts before the end of the previous activity -> tomorrow
            if processed_activities and start_dt < processed_activities[-1]['End_DT']:
                start_dt += timedelta(days=1)
                end_dt += timedelta(days=1)
                
            processed_activities.append({
                'Type': activity_type,
                'Start_DT': start_dt,
                'End_DT': end_dt
            })


        def get_activity_type(timestamp):
            """ Maps the activity with the timestamp """
            for activity in processed_activities:
                # Check interval
                if activity['Start_DT'] <= timestamp < activity['End_DT']:
                    return activity['Type']
            return None

        # Fill the activity column
        df['Aktivite Protokolü'] = copy_df['Timestamp'].apply(get_activity_type)

        # Save
        df.to_excel(self.raw_excel_path, index=False)

        print("Activities added.")


    def clean_and_float(self, s):
        """
        Safely convert a string to a float.

        Steps:
        1. Convert input to string in case it's numeric.
        2. Remove non-breaking spaces (\xa0) and normal spaces.
        3. Replace commas with dots for decimal handling.
        4. Handle thousand separators intelligently:
        - If the last dot is in a position indicating a thousand separator, remove it.
        - Otherwise, keep it as a decimal point.
        5. If conversion fails, return np.nan and print the error.

        This ensures numbers like '1.234,56' or '1 234.56' convert correctly.
        """
        try:
            s = str(s).replace('\xa0', '').replace(' ', '')  # Remove spaces and non-breaking spaces
            s_dot = s.replace(',', '.')  # Replace comma with dot for decimal

            last_dot_index = s_dot.rfind('.')  # Find the last dot
            if last_dot_index == -1:
                # No dot, just convert directly
                return s_dot

            # Check if last dot is thousand separator
            pos_from_end = len(s_dot) - 1 - last_dot_index
            if (pos_from_end) % 3 == 0:
                # It is a thousand separator -> remove all dots
                s_cleaned = s_dot.replace('.', '')
            else:
                # It is decimal -> remove all other dots
                s_cleaned = s_dot[:last_dot_index].replace('.', '') + s_dot[last_dot_index:]

            return s_cleaned

        except Exception as e:
            # Conversion failed, return NaN and print error
            print(f"Failed to convert '{s}' to float: {e}")
            return np.nan


    def createProcessedExcel(self):
        """
        Obtain the ProcessedEcel values from the createExcel class using pdf parsers
        """
        # If already created, return
        if os.path.exists(self.processed_excel_path):
            print("Processed Excel already exists.")
            return

        create = CreateExcel(
            processed_excel_path="processed_template.xlsx",
            txt_path=self.txt_path,
            HRVvital_analysis=self.HRVvital_analysis,
            HRVvital_analysis_overview=self.HRVvital_analysis_overview,
            activity_protocol=self.activity_protocol,
            HRVmed_analysis=self.HRVmed_analysis
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


# ---- RUN PIPELINE ----
"""
1. Move your data files into a single folder including this file
2. Your data files should be in the format like: 1013 -> 01.12.2023 -> All PDFs and TXT
                                                      -> 10.12.2023 -> All PDFs and TXT
                                                 1014 -> 03.10.2024 -> All PDFs and TXT
                                                      -> 15.11.2024 -> All PDFs and TXT
3. Move CreateDB, CreateExcels into same file
4. Run this file
5. Before running check the database connection settings
"""

if __name__ == "__main__":
    # User folders like "1013"
    for user_folder in os.listdir("."):
        user_path = os.path.join(".", user_folder)
        if os.path.isdir(user_path):
            # Date folders inside the user folders
            for user_date_folder in os.listdir(user_path):
                user_date_path = os.path.join(user_path, user_date_folder)

                txt_path = ""
                HRVvital_analysis = "" 
                HRVvital_analysis_overview = "" 
                activity_protocol = "" 
                HRVmed_analysis = ""

                if os.path.isdir(user_date_path):
                    # Analysis files inside the date folders
                    for user_file in os.listdir(user_date_path):
                        if user_file.endswith(".txt"):
                            txt_path = os.path.join(user_date_path, user_file)
                            filename, ext = os.path.splitext(os.path.basename(txt_path))

                            directory = os.path.dirname(txt_path)
                            processed_folder_path = f"{directory}/processed_excels"
                            raw_folder_path = f"{directory}/raw_excels"
                        
                        if user_file.endswith(".pdf"):
                            path = os.path.join(user_date_path, user_file)
                            if "overview" in user_file.lower() and "vital" in user_file.lower():
                                HRVvital_analysis_overview = path
                            elif "vital" in user_file.lower():
                                HRVvital_analysis = path
                            elif "activity" in user_file.lower():
                                activity_protocol = path
                            elif "med" in user_file.lower():
                                HRVmed_analysis = path
                            
                if txt_path != "" and HRVvital_analysis != "" and HRVvital_analysis_overview != "" and activity_protocol != "" and HRVmed_analysis != "":
                    print(f"\nProcessing: {filename}")

                    db = InsertDatabase("postgres", "postgres", "5432", "test", txt_path=txt_path, raw_excel_path=f"{raw_folder_path}/{filename}_raw.xlsx", processed_excel_path=f"{processed_folder_path}/{filename}.xlsx", 
                        HRVvital_analysis=HRVvital_analysis,
                        HRVvital_analysis_overview=HRVvital_analysis_overview,
                        activity_protocol=activity_protocol,
                        HRVmed_analysis=HRVmed_analysis)
                    

                    # Run each step separately with error handling
                    try:
                        db.createProcessedExcel()
                    except Exception as e:
                        print(f"Create failed for {filename}: {e} ")

                    try:
                        db.createRawExcel()
                    except Exception as e:
                        print(f"Create failed for {filename}: {e} "),

                    try:
                        db.updateActivities()
                    except:
                        print(f"Activities cannot updated for {filename}: {e}")

                    try:
                        db.insert_user()
                    except Exception as e:
                        print(f"Create failed for {filename}: {e} ")

                    try:
                        db.insert_raw_data()
                    except Exception as e:
                        print(f"Create failed for {filename}: {e} ")

                    try:
                        db.insert_processed_data()
                    except Exception as e:
                        print(f"Create failed for {filename}: {e} ")

