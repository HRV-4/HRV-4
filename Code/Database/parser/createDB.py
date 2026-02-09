from sqlalchemy import create_engine, Column, BigInteger, Text, Double, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()

# ---------------------
# ORM Table Definitions
# ---------------------

class Users(Base):
    __tablename__ = 'Users'
    userID = Column(BigInteger, primary_key=True)
    age = Column(BigInteger)
    gender = Column(Text)
    clinical_story = Column(Text)
    notes = Column(Text)
    raw_data = relationship("RawData", back_populates="user")
    processed_data = relationship("ProcessedData", back_populates="user")


class RawData(Base):
    __tablename__ = 'RawData'
    measurementID = Column(Text, primary_key=True)
    userID = Column(BigInteger, ForeignKey('Users.userID'))
    timestamp = Column(DateTime, primary_key=True)
    hrv_data = Column(Double)
    activity = Column(Text)
    doctor_comments = Column(Text)

    user = relationship("Users", back_populates="raw_data")


class ProcessedData(Base):
    __tablename__ = 'ProcessedData'
    measurementID = Column(Text, primary_key=True)
    userID = Column(BigInteger, ForeignKey('Users.userID'))
    timestamp = Column(DateTime)

    biological_age = Column(Double)
    biological_age_percent = Column(Double)
    heart_beats = Column(Double)
    min_hr = Column(Double)
    max_hr = Column(Double)
    gvi = Column(Double)
    dynamic_a = Column(Double)
    dynamic_b = Column(Double)
    tp = Column(Double)
    ulf = Column(Double)
    vlf = Column(Double)
    lf = Column(Double)
    hf = Column(Double)
    pnn_50 = Column(Double)
    sdnn = Column(Double)
    rmssd = Column(Double)
    tp_night = Column(Double)
    ulf_night = Column(Double)
    vlf_night = Column(Double)
    lf_night = Column(Double)
    hf_night = Column(Double)
    pnn_50_night = Column(Double)
    sdnn_night = Column(Double)
    rmssd_night = Column(Double)

    burnout_resistance = Column(Double)
    burnout_resistance_percent = Column(Double)
    performance_potential = Column(Double)
    performance_potential_percent = Column(Double)
    stress = Column(Double)
    stress_percent = Column(Double)
    health_state = Column(Double)
    health_state_percent = Column(Double)

    start_timestamp = Column(DateTime)
    end_timestamp = Column(DateTime)
    measurement_time = Column(Text)

    user = relationship("Users", back_populates="processed_data")

# ---------------------
# Database Management
# ---------------------

class CreateDB:
    def __init__(self, connection_string: str):
        """
        connection_string example:
        "postgresql+psycopg2://postgres:password@localhost:5432/mydb"
        """
        self.engine = create_engine(connection_string)
        self.Session = sessionmaker(bind=self.engine)

    def create_users(self):
        Users.__table__.create(self.engine, checkfirst=True)
        print("✅ 'Users' table created (if not exists).")

    def create_raw_data(self):
        RawData.__table__.create(self.engine, checkfirst=True)
        print("✅ 'RawData' table created (if not exists).")

    def create_processed_data(self):
        ProcessedData.__table__.create(self.engine, checkfirst=True)
        print("✅ 'ProcessedData' table created (if not exists).")

    def create_all(self):
        Base.metadata.create_all(self.engine)
        print("✅ All tables created (if not exist).")


# ---------------------
# Example Usage
# ---------------------
if __name__ == "__main__":
    db = CreateDB("postgresql+psycopg2://postgres:1234@localhost:5432/test")

    # Create all tables
    db.create_all()

    # or create individually
    # db.create_users()
    # db.create_raw_data()
    # db.create_processed_data()
