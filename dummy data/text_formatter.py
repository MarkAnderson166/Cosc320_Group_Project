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
outputFile = open("bAminor.txt","w+")

with open('bAminor.csv') as arrayFile:
  for line in arrayFile:
    line = line.replace('"','')
    entry = line.split(',')

    #if(entry[4] in ' 48\n' or entry[4] == ' 60\n' or entry[3] == ' 48' or entry[3] == ' 60'):

    if ("Listed" in entry[0] or "Prescribed" in entry[0] or "Core" in entry[0]):
      outputFile.writelines('],\n"'+entry[0]+'" : [ "'+entry[0]+'", '+entry[4].replace('\n','')+',\n')
    
    elif(len(entry[0]) > 7):
      outputFile.writelines('\n],\n},\n\n\n"'+entry[0]+'" : { //"'+entry[1]+'", '+entry[4].replace('\n','')+',\n')

    else:

      arr = format.replace('$Code',entry[0])
      arr = arr.replace('$CP',entry[1])
      arr = arr.replace('$TriAvail',entry[2])
      arr = arr.replace('$Prereq',entry[3])
      arr = arr.replace('$Name',entry[4])
      arr = (arr.replace('\n',''))+'\n'
      outputFile.writelines(arr)


outputFile.close() 
