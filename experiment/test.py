import json
import re


get_digits = '\\b(\d+)'


with open("test.json", "r", encoding='latin-1') as read_file:
    data = json.load(read_file)

course_structure = data['result']['data']['coursesJson']['course_structure']

# print(course_structure[0]['container'][0].keys())
# print(len(course_structure[0]['container']))

# for key, value in course_structure[0]['container'][0].items():
#     print(key, value)

main_str = course_structure[0]['container']


for i in range(len(main_str)):
    print(f"\nCategory: {main_str[i]['title']}")
    print(f"\t\tDescription: {main_str[i]['description']}")

    required_cp = list(map(int, re.findall(get_digits, main_str[i]["description"])))
    if len(required_cp) == 1:
        print(f"\t\tMinimum Credit Points: {required_cp[0]}; Maximum Credit Points: {required_cp[0]}")
    elif len(required_cp) == 2:
        if required_cp[0] < required_cp[1]:
            print(f"\t\tMinimum Credit Points: {required_cp[0]}; Maximum Credit Points: {required_cp[1]}")
    elif len(required_cp) > 2:
        if required_cp[0] > required_cp[1]:
            print(f"\t\tMinimum Credit Points: {required_cp[0]}; Maximum Credit Points: {required_cp[0]}")
            for j in range(1, len(required_cp)):
                if len(str(required_cp[j])) < 3:
                    print(f"\t\tThere is a special requirement of at least {required_cp[j]} credit points of the following:")
                else:
                    print(f"\t\t\tLevel {required_cp[j]} Units")
        


