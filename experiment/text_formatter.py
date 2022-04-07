##
##    Simple text formater  -  by Mark Anderson
##
##    created for Cosc320 timetable project
##    converts comma delimited csv to js readable arrays
##

#  input:  text file in (per line) format: thing1,t2,t3,t4,t5\n 
#           - easily made in a spreadsheet 
#  output: output.txt file in local directory

format = '{ "Code" :  "$Code", "Name" : "$Name", "CP" : "$CP", "Prereq" : "$Prereq", "TriAvail" : "$TriAvail"},'
outputFile = open("output.txt","w+")

with open('BCompSciDataMajorListedUnits.csv') as arrayFile:
  for line in arrayFile:
    entry = line.split(',')
    arr = format.replace('$Code',entry[0])
    arr = arr.replace('$Name',entry[1])
    arr = arr.replace('$CP',entry[2])
    arr = arr.replace('$Prereq',entry[3])
    arr = arr.replace('$TriAvail',entry[4])
    arr = (arr.replace('\n',''))+'\n'
    outputFile.writelines(arr)


outputFile.close() 
