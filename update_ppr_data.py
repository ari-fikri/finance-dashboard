import json
import re
import csv

def add_plant_to_ppr_data():
    # Load the CSV data for plant lookup
    plant_lookup = {}
    try:
        with open('src/assets/plants and products.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if 'Material Number' in row and 'Plant' in row:
                    # Clean the material number for lookup
                    lookup_key = row['Material Number'].replace('-', '')
                    plant_lookup[lookup_key] = row['Plant']
    except FileNotFoundError:
        print("Error: 'src/assets/plants and products.csv' not found.")
        return

    # Read the JS data file
    try:
        with open('src/data/pprSampleData.js', 'r') as f:
            js_content = f.read()
    except FileNotFoundError:
        print("Error: 'src/data/pprSampleData.js' not found.")
        return

    # Extract the pprDataByPeriod object string using regex
    data_match = re.search(r'export const pprDataByPeriod = (\{.*?\});', js_content, re.DOTALL)
    if not data_match:
        print("Could not find pprDataByPeriod in the JS file.")
        return
        
    ppr_data_str_original = data_match.group(1)
    
    # Convert the JS object string to a JSON-compatible string
    ppr_data_str_json = re.sub(r'//.*', '', ppr_data_str_original)
    ppr_data_str_json = re.sub(r',\s*([}\]])', r'\1', ppr_data_str_json)
    ppr_data_str_json = re.sub(r'([{\s,])(\w+):', r'\1"\2":', ppr_data_str_json)
    
    try:
        ppr_data = json.loads(ppr_data_str_json)
    except json.JSONDecodeError as e:
        print(f"Failed to parse JS object into JSON: {e}")
        error_pos = e.pos
        context = 40
        start = max(0, error_pos - context)
        end = min(len(ppr_data_str_json), error_pos + context)
        print("Error context:", ppr_data_str_json[start:end])
        return

    # Add 'plant' to each part in the data
    for period in ppr_data:
        for part_item in ppr_data[period]:
            part_no = part_item.get('partNo')
            if part_no:
                lookup_key = part_no.replace('-', '')
                plant = plant_lookup.get(lookup_key, '')
                part_item['plant'] = plant

    # Convert the Python dictionary back to a JS object string
    updated_ppr_data_str = json.dumps(ppr_data, indent=2)
    updated_ppr_data_str = re.sub(r'"(\w+)":', r'\1:', updated_ppr_data_str)

    # Replace the old data object string with the updated one
    updated_js_content = js_content.replace(ppr_data_str_original, updated_ppr_data_str)

    # Write the updated content back to the JS file
    with open('src/data/pprSampleData.js', 'w') as f:
        f.write(updated_js_content)

    print("Successfully updated 'src/data/pprSampleData.js' with plant information from plants and products.csv.")


add_plant_to_ppr_data()