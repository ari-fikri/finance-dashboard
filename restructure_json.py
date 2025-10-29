import json

file_path = '/Users/arifikri/Downloads/TMMIN/price_calculator/finance-dashboard/src/assets/BOM_Usage_Transposed.json'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    new_data = []
    for item in data:
        new_item = {}
        subparts = {}
        
        item_keys = list(item.keys())
        
        try:
            pivot_index = item_keys.index('Dock/IH Routing')
            
            for i in range(pivot_index + 1):
                key = item_keys[i]
                new_item[key] = item[key]
            
            for i in range(pivot_index + 1, len(item_keys)):
                key = item_keys[i]
                subparts[key] = item[key]
            
            new_item['subparts'] = subparts
            new_data.append(new_item)

        except ValueError:
            new_data.append(item)

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, indent=2)

    print(f"Successfully restructured {file_path}")

except FileNotFoundError:
    print(f"Error: The file at {file_path} was not found.")
except json.JSONDecodeError:
    print(f"Error: Could not decode JSON from the file at {file_path}.")
except Exception as e:
    print(f"An error occurred: {e}")