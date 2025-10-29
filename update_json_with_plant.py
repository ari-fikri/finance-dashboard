import json
import csv

def update_json_with_plant():
    # Load the JSON data
    try:
        with open('src/assets/Parent_as_Row.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: 'src/assets/Parent_as_Row.json' not found.")
        return
    except json.JSONDecodeError:
        print("Error: Could not decode JSON from 'src/assets/Parent_as_Row.json'.")
        return

    # Create a dictionary to store plant data
    plant_data = {}
    try:
        with open('src/assets/plants and products.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if 'Material Number' in row and 'Plant' in row:
                    # Remove hyphens from Material Number for matching
                    material_no = row['Material Number'].replace('-', '')
                    plant_data[material_no] = row['Plant']
    except FileNotFoundError:
        print("Error: 'src/assets/plants and products.csv' not found.")
        return

    # Iterate through the parts in the JSON data
    for part in data:
        part_no = part.get('part_no')
        if part_no:
            # Clean part_no to match the format in the CSV
            # Take part before space, and remove hyphens
            cleaned_part_no = part_no.split(' ')[0].replace('-', '')
            if cleaned_part_no in plant_data:
                part['plant'] = plant_data[cleaned_part_no]

    # Write the updated data back to the JSON file
    with open('src/assets/Parent_as_Row.json', 'w') as f:
        json.dump(data, f, indent=4)

    print("JSON file updated successfully with plant information, matching without hyphens.")

update_json_with_plant()


def update_json_with_product_info():
    # Load the JSON data
    try:
        with open('src/assets/Parent_as_Row.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: 'src/assets/Parent_as_Row.json' not found.")
        return
    except json.JSONDecodeError:
        print("Error: Could not decode JSON from 'src/assets/Parent_as_Row.json'.")
        return

    # Create a dictionary to store product data (plant and part name)
    product_data = {}
    try:
        with open('src/assets/plants and products.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if 'Material Number' in row and 'Plant' in row and 'Material Description' in row:
                    # Remove hyphens from Material Number for matching
                    material_no = row['Material Number'].replace('-', '')
                    product_data[material_no] = {
                        'plant': row['Plant'],
                        'part_name': row['Material Description']
                    }
    except FileNotFoundError:
        print("Error: 'src/assets/plants and products.csv' not found.")
        return

    # Iterate through the parts in the JSON data
    for part in data:
        part_no = part.get('part_no')
        if part_no:
            # Clean part_no to match the format in the CSV
            # Take part before space, and remove hyphens
            cleaned_part_no = part_no.split(' ')[0].replace('-', '')
            if cleaned_part_no in product_data:
                part['plant'] = product_data[cleaned_part_no]['plant']
                part['part_name'] = product_data[cleaned_part_no]['part_name']

    # Write the updated data back to the JSON file
    with open('src/assets/Parent_as_Row.json', 'w') as f:
        json.dump(data, f, indent=4)

    print("JSON file updated successfully with plant and part name information.")

update_json_with_product_info()