##
##    Simple text formater  -  by Mark Anderson
##
##    created for Cosc320 timetable project
##    converts comma delimited csv to js readable arrays
##

#  input:  text file in (per line) format: thing1,t2,t3,t4,t5\n 
#           - easily made in a spreadsheet 
#  output: .txt file in local directory

# bCompSci
# bArts
# bNursing
# bSci

format = '{ "Code" :  "$Code", "CP" : "$CP", "TriAvail" : "$TriAvail", "Prereq" : "$Prereq", "Name" : "$Name"},'
outputFile = open("bCompSci.txt","w+")

with open('bCompSci.csv') as arrayFile:
  for line in arrayFile:
    if (len(line) < 20):
      outputFile.writelines('],\n"'+line[:-5]+'" : [  6,\n')
    else:
      entry = line.split(',')
      arr = format.replace('$Code',entry[0])
      arr = arr.replace('$CP',entry[1])
      arr = arr.replace('$TriAvail',entry[2])
      arr = arr.replace('$Prereq',entry[3])
      arr = arr.replace('$Name',entry[4])
      arr = (arr.replace('\n',''))+'\n'
      outputFile.writelines(arr)


outputFile.close() 
