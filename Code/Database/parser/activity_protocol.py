import pdfplumber
import re
from pathlib import Path
import pandas as pd

#more convenient pathing
base_dir = Path(__file__).resolve().parent
pdfs_dir = base_dir / "pdfs"

pdf_path = pdfs_dir / "Autonom_Health_activity_protocol_Tuerker_Nasli.pdf"

tables = []
with pdfplumber.open(pdf_path) as pdf:
    for page_number, page in enumerate(pdf.pages, start=1):
        page_tables = page.extract_tables()
        
        table = page_tables[0] #there is only one table 

        dics = []

        for row in table[1:]:
            dic = {}
            for column, header in enumerate(table[0]):
                dic[header] = row[column]

            dics.append(dic)

df = pd.DataFrame(dics)
print(df)