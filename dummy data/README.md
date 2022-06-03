### Dummy Data Formatting

This .md included as part of 'hand-over docs'

The 2 python scripts here were made to help with the creation of the dummy unit data in lieu of access to a UNE database or usable $POST json objects.  
This is part of prototyping only and could be used to add extra degrees, but would play no role in a finished version.

- the files names ___Raw.csv are created 'the hard way' that is; just copy+paste right from the handbook website  
```csv
Core
Core
12
HASS100
6 CP
Foundations of Academic Research
HASS101
6 CP
Controversies: Foundations of Critical Social Analysis
WRIT101
6 CP
```
- text_formatter2.py takes one of these ____Raw.csv files (change file names in code) and produces the correponding __.csv  
```csv
Core, Core, 123, null, 12
HASS100, 6 CP, 123, null, Foundations of Academic Research
HASS101, 6 CP, 123, null, Controversies: Foundations of Critical Social Analysis
```
- unit availabilltys and pre-reqs can now be added to the ___.csv in this format ( the hard-way..  optional )  
- text_formatter.py takes one of these ___.csv files (change file names in code) and produces the correponding __.txt  
```
],
"Core" : [ "Core",  12,
{ "Code" :  "HASS100", "CP" : " 6 CP", "TriAvail" : " 123", "Prereq" : " null", "Name" : " Foundations of Academic Research"},
{ "Code" :  "HASS101", "CP" : " 6 CP", "TriAvail" : " 123", "Prereq" : " null", "Name" : " Controversies: Foundations of Critical Social Analysis"},
{ "Code" :  "WRIT101", "CP" : " 6 CP", "TriAvail" : " 123", "Prereq" : " null", "Name" : " The Craft of Academic Writing"},
```
- contents of ___.txt is then dumped into the data.js and cleaned up (some titles get picked up as units for eg.)  
