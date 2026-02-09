import pdfplumber
import re
import sys #to get the filename as argument

# Check if a filename was provided
if len(sys.argv) < 2:
    print("Error: You must provide a PDF filename.")
    print("Usage: python3 HRVsport_parser.py <filename.pdf>")
    sys.exit(1)  # Exit the script with an error code

# If the check passes, get the filename
pdf_path = sys.argv[1]

#pdf_path = "HRVsport_analysis_örnek_1011.pdf"

with pdfplumber.open(pdf_path) as pdf:
    first_page = pdf.pages[0]
    text = first_page.extract_text()
    first_lines = text.split('\n')
    
    i = 0
    while i < 4:
        print(first_lines[i])
        i += 1

    print(first_lines[7])

    print(first_lines[9])
    
    print(re.findall(r"\d+\,\d+", first_lines[10]))

    print(re.findall(r"\d+\.\d+", first_lines[11]))

    print(re.findall(r"\d+\.\d+", first_lines[12]))

    print(re.findall(r"\d+\.\d+", first_lines[13]))

    print(re.findall(r"\d+\.\d+", first_lines[14]))

    print(re.findall(r"\d+\.\d+", first_lines[15]))

    print(re.findall(r"\d+\.\d+", first_lines[16]))

    print(re.findall(r"\d+\.\d+", first_lines[17]))

    print(first_lines[18])

    print(re.findall(r"\d+\,\d+\.\d+|\d+\.\d+", first_lines[19]))

    print(re.findall(r"\d+\,\d+\.\d+|\d+\.\d+", first_lines[20]))

    print(re.findall(r"\d+\,\d+\.\d+|\d+\.\d+", first_lines[21]))

    print(re.findall(r"\d+\,\d+\.\d+|\d+\.\d+", first_lines[22]))
