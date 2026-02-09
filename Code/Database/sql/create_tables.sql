CREATE TABLE Users (
    userID BIGINT PRIMARY KEY,
    age BIGINT,
    gender TEXT,
    clinical_story TEXT,
    notes TEXT,
);

CREATE TABLE RawData (
    measurementID BIGINT,
    userID BIGINT,
    timestamp TIMESTAMP,
    hrv_data DOUBLE PRECISION,
    doctor_comments TEXT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    PRIMARY KEY (measurementID, userID)
    -- timestamp type might be changed based on connected script later
);

CREATE TABLE ProcessedData (
    measurementID BIGINT,
    userID BIGINT,
    timestamp TIMESTAMP,
    biological_age DOUBLE PRECISION,
    heart_beats DOUBLE PRECISION,
    min_hr DOUBLE PRECISION,
    max_hr DOUBLE PRECISION,
    gvi DOUBLE PRECISION,
    dynamic_a DOUBLE PRECISION,
    dynamic_b DOUBLE PRECISION,
    tp DOUBLE PRECISION,
    ulf DOUBLE PRECISION,
    vlf DOUBLE PRECISION,
    lf DOUBLE PRECISION,
    hf DOUBLE PRECISION,
    pnn_50 DOUBLE PRECISION,
    sdnn DOUBLE PRECISION,
    rmssd DOUBLE PRECISION,
    tp_night DOUBLE PRECISION,
    ulf_night DOUBLE PRECISION,
    vlf_night DOUBLE PRECISION,
    lf_night DOUBLE PRECISION,
    hf_night DOUBLE PRECISION,
    pnn_50_night DOUBLE PRECISION,
    sdnn_night DOUBLE PRECISION,
    rmssd_night DOUBLE PRECISION,
    burnout_resistance DOUBLE PRECISION, --out of 10
    burnout_resistance_percent DOUBLE PRECISION,
    performance_potential DOUBLE PRECISION, --out of 10
    performance_potential_percent DOUBLE PRECISION,
    stress DOUBLE PRECISION, --out of 10
    stress_percent DOUBLE PRECISION,
    health_state DOUBLE PRECISION, --out of 10
    health_state_percent DOUBLE PRECISION,
    start_timestamp TIMESTAMP,
    end_timestamp TIMESTAMP,
    measurement_time TEXT,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    PRIMARY KEY (measurementID, userID)
);