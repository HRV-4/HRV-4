import pdfplumber
import re

pdf_path = "HRVmed_analysis_Tuerker_Nasli.pdf"

with pdfplumber.open(pdf_path) as pdf:
    first_page = pdf.pages[0]
    text = first_page.extract_text()
    first_lines = text.split('\n')
    
    i = 0
    while i < 4:
        print(first_lines[i])
        i += 1

    second_page = pdf.pages[1]
    text = second_page.extract_text()

    second_lines = text.split('\n')

    print(second_lines[1])
    
    print(re.findall(r"\d+", second_lines[2]))

    print(re.findall(r"\d+\,\d+|\d+", second_lines[3]))

    print(re.findall(r"\d+\s+\d+\,\d+", second_lines[4]))

    print(re.findall(r"\d+\.\d+", second_lines[6]))

    print(re.findall(r"\d+\,\d+\.\d+", second_lines[7]))

    print(re.findall(r"\d+\.\d+\s\%|\d+\.\d+", second_lines[8]))

    print(re.findall(r"\d+\.\d+\s\%|\d+\,\d+\.\d+", second_lines[9]))

    print(re.findall(r"\d+\.\d+\s\%|\d+\,\d+\.\d+|\d+\.\d+", second_lines[10]))

    print(re.findall(r"\d+\.\d+\s\%|\d+\,\d+\.\d+|\d+\.\d+", second_lines[11]))

    print(re.findall(r"\d+\.\d+", second_lines[12]))

    print(re.findall(r"\d+\.\d+", second_lines[13]))

    print(re.findall(r"\d+\.\d+", second_lines[14]))
