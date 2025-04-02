from sqlalchemy import create_engine

DATABASE_URL = "mysql+pymysql://username:password@localhost/dbname"
engine = create_engine(DATABASE_URL)