import json
import random
import os

file_path = "/Users/arifikri/Downloads/TMMIN/price_calculator/finance-dashboard/public/msp.json"

if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
else:
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            if not content:
                data = {"items": []}
            else:
                data = json.loads(content)
    except (json.JSONDecodeError, IOError) as e:
        print(f"Error reading or parsing JSON file: {e}")
        data = None

    if data is not None:
        importers = ["KUO", "TDR", "TDM", "TMT", "TAR", "TMV", "TASA"]
        categories = ["H2V", "ICE"]

        if "items" in data and isinstance(data["items"], list):
            for item in data["items"]:
                if isinstance(item, dict):
                    item["importer"] = random.choice(importers)
                    item["category"] = random.choice(categories)

        try:
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"Successfully updated {file_path}")
        except IOError as e:
            print(f"Error writing to file: {e}")
