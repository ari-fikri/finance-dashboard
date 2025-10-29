import csv
import json

csv_file_path = '/Users/arifikri/Downloads/TMMIN/price_calculator/finance-dashboard/src/assets/Parent as Row.csv'
json_file_path = '/Users/arifikri/Downloads/TMMIN/price_calculator/finance-dashboard/src/assets/Parent_as_Row.json'

try:
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file)
        
        headers = next(csv_reader)
        parent_parts = headers[1:]
        
        json_data = []
        for part in parent_parts:
            json_data.append({"part_no": part, "sub_parts": []})
            
        for row in csv_reader:
            sub_part_no = row[0]
            quantities = row[1:]
            
            for i, qty in enumerate(quantities):
                # Try to convert qty to a number to check if it's non-zero
                try:
                    is_zero = float(qty) == 0
                except (ValueError, TypeError):
                    is_zero = True # Treat non-numeric or null as zero/empty

                if qty and not is_zero:
                    json_data[i]["sub_parts"].append({"part_no": sub_part_no, "Qty": qty})

    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(json_data, json_file, indent=2)

    print(f"Successfully converted {csv_file_path} to {json_file_path} with updated keys.")

except FileNotFoundError:
    print(f"Error: The file at {csv_file_path} was not found.")
except Exception as e:
    print(f"An error occurred: {e}")