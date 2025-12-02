import json

msp_file_path = '/Users/arifikri/Downloads/TMMIN/price_calculator/finance-dashboard/public/msp.json'

with open(msp_file_path, 'r') as f:
    data = json.load(f)

for item in data['items']:
    for month, month_data in item['months'].items():
        month_data['sales_volume'] = 0
        month_data['prod_volume'] = 0

with open(msp_file_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Successfully updated {msp_file_path}")