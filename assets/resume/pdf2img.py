from pdf2image import convert_from_path

# Convert the first page of the PDF to an image
pages = convert_from_path('CV_Adam_20231218.pdf', dpi=150)
pages[0].save('resume_preview_US.png', 'PNG')