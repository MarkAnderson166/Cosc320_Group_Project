##
##    Simple text formater 2 -  by Mark Anderson
##
##    created for Cosc320 timetable project
##    converts une handbook tables to comma delimited csv
##

#  input:  text file in (per line) format: thing1\nt2\nt3\nt4\nt5\n 
#           - easily copied into in a spreadsheet from une handbook
#  output: .txt file in local directory

# bCompSci
# bArts
# bNursing
# bSci

format = '$1, $2, 123, null, $3\n'
outputFile = open("bAminor.csv","w+")

with open('bAminorRaw.csv') as arrayFile:
  testsite_array = []
  for line in arrayFile:
    testsite_array.append(line.replace('\n',''))

  for i in range(0,len(testsite_array), 3):
    arr = format.replace('$1',testsite_array[i])
    arr = arr.replace('$2',testsite_array[i+1])
    arr = arr.replace('$3',testsite_array[i+2])
    outputFile.writelines(arr)

outputFile.close() 
