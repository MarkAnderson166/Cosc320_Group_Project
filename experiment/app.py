import json
import re
from dash import Dash, html, dcc

# set up the regex expression
get_digits = '\\b(\d+)'

# import the JSON
with open("test.json", "r", encoding='latin-1') as read_file:
    data = json.load(read_file)

course_structure = data['result']['data']['coursesJson']['course_structure']

main_str = course_structure[0]['container']

def generate_info(category):
    required_cp = list(map(int, re.findall(get_digits, category["description"])))

    if len(required_cp) == 1:
       return html.Div(children=[
        html.H2(category['title']),
        html.P(category['description']),
        html.P("Minimum Credit Points: " + str(required_cp[0])),
        html.P("Maximum Credit Points: " + str(required_cp[0]))
    ])
    elif len(required_cp) == 0:
      return html.Div(children=[
        html.H2(category['title']),
        html.P(category['description']),
        html.P("Must work on this case, essentially need to filter in majors minors"),
    ])  
    elif len(required_cp) == 2:
        return html.Div(children=[
        html.H2(category['title']),
        html.P(category['description']),
        html.P("Minimum Credit Points: " + str(required_cp[0])),
        html.P("Maximum Credit Points: " + str(required_cp[1]))
    ])
    elif len(required_cp) > 2:
        if required_cp[0] > required_cp[1]:
            return html.Div(children=[
            html.H2(category['title']),
            html.P(category['description']),
            html.P("Minimum Credit Points: " + str(required_cp[0])),
            html.P("Maximum Credit Points: " + str(required_cp[0])),
            html.P(["There is a special requirement of at least " + str(required_cp[j]) + " credit points of the following:" for j in range(1, len(required_cp)) if len(str(required_cp[j])) < 3]),
            html.P(["Level " + str(required_cp[j]) + " units" for j in range(1, len(required_cp)) if len(str(required_cp[j])) == 3])
        ])



app = Dash(__name__)

app.layout = html.Div(children=[ 
    html.H1("Course Progression"),
    html.Div([generate_info(main_str[i]) for i in range(len(main_str))]),
    
])

if __name__ == '__main__':
    app.run_server(debug=True)