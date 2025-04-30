import json

# with open('db_test.json', 'r', encoding='utf-16') as file:
#     data = json.load(file)


# with open('db_test_fixed.json', 'w', encoding='utf-8') as file:
#     json.dump(data, file, indent=4)


with open('a.json', 'r', encoding='utf-16', errors='ignore') as file:
    content = file.read()

try:
    data = json.loads(content)
    with open('b.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)
except json.JSONDecodeError as e:
    print("Не удалось декодировать JSON:", e)