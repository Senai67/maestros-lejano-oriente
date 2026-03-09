import os
import re
import json

def clean_text(text):
    # Normalize line endings
    text = text.replace('\r\n', '\n')
    
    lines = text.split('\n')
    cleaned_lines = []
    
    current_chapter = None
    chapters = []
    
    # regex for chapters
    # Patterns: CAPITULO X, CAPÍTULO X, ## Capítulo X, Capítulo X
    cap_regex = re.compile(r'^(CAPITULO|CAPÍTULO|## Capítulo|Capítulo|##\s*Capítulo)\s+([0-9IVXLCDM]+)', re.IGNORECASE)
    
    current_content = []
    current_title = ""
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            if current_content and current_content[-1] != "":
                current_content.append("")
            continue
            
        match = cap_regex.match(line)
        if match:
            # Save previous chapter
            if current_title or current_content:
                chapters.append({
                    "title": current_title if current_title else "Introducción",
                    "content": "\n".join(current_content).strip()
                })
            
            # New chapter
            current_title = line
            # Check next line for a potential subtitle
            if i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if next_line and not cap_regex.match(next_line) and next_line.isupper() and len(next_line) > 3:
                     current_title += ": " + next_line
                     # Skip the next line in the main loop if we consumed it
                     lines[i+1] = "" 
            
            current_content = []
            continue
            
        current_content.append(line)
        
    # Append last chapter
    if current_title or current_content:
        chapters.append({
            "title": current_title if current_title else "Fin",
            "content": "\n".join(current_content).strip()
        })
        
    return chapters

def process_volumes():
    base_path = r'c:\Users\José Manuel\Desktop\Antigravity_Docs\MAESTROS_LEJANO_ORIENTE\public\textos.txt'
    files = [
        "Vida y Enseñanzas de los Maestros 1.txt",
        "Vida y Enseñanzas de los Maestros 2.txt",
        "Vida y Enseñanza de los Maestros 3.txt",
        "Vida y Eseñanza de los Maestros 4.txt",
        "Vida y Eseñanza de los Maestros 5.txt",
        "LA CONSCIENCIA CRÍSTICA.txt",
        "LA CRISTO-CONSCIENCIA.txt"
    ]
    
    libros = {}
    
    for filename in files:
        path = os.path.join(base_path, filename)
        if os.path.exists(path):
            print(f"Processing {filename}...")
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            vol_name = filename.replace(".txt", "")
            libros[vol_name] = clean_text(content)
        else:
            print(f"File not found: {path}")
            
    # Write to libros.js
    js_content = "export const LIBROS = " + json.dumps(libros, indent=2, ensure_ascii=False) + ";"
    output_path = r'c:\Users\José Manuel\Desktop\Antigravity_Docs\MAESTROS_LEJANO_ORIENTE\src\data\libros.js'
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Successfully created {output_path}")

if __name__ == "__main__":
    process_volumes()
