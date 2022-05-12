# Mid Project Progress Report

# Degree Completion Roadmap for Students

## Group members and contact details

* Tully McDonald - tmcdon26@myune.edu.au
* Mark Anderson - mander53@myune.edu.au
* Nelson Pray - npray@myune.edu.au
* Nicola Howard - nhoward7@myune.edu.au

## Summary of the project
 Our project is to develop a working prototype that helps automate the degree completion roadmap process for our client, UNE Student Services. Our prototype will take as input a student’s current course progress in the form of a specifically formatted CSV file and automatically display completed units and allow the student to customise their roadmap with a simple and intuitive drag and drop interface. The completed roadmap will be presented in a visually appealing and easy to understand format. Using our prototype and estimations of time and effort the client can make an informed decision on the feasibility of the project and whether further exploration of the concept is should be pursued.

## Overall progress to date
A statement regarding your overall progress to date	2

###### Marks notes:  
( no idea how to phrase this sorry Nicky )  
The eureka moment for me was realising that as I had to type out the unit data anyway, I could effectively embed the course rules in the data structure.  
Unlike the first in-house experimental prototypes, the current project does not have lists of 'rules' at all. The backend systems compare student data to course data directly, without using 'rules' as filters.  
As with every aspect of this project, (every aspect!), the breakthrough moment hinged on the availability of university data to compare student data to.  


## Main achievements
A listing of main achievements to date	2

###### Marks notes:  
The thing generally works:  
the 'recommendation calendar' key feature is not in yet, the GUI design is not final, and most things are buggy. But overall, it does work.  

## Comparison: Planned vs Actual
Comparison of planned progress to actual progress via a Gantt chart	2

## Review of project scope and risks
Review of project scope and risks, i.e. has the project scope drifted or are there new project risks?	3

###### Marks notes:  
in addressing the topics from our scoping document  

 Availability of group members and the client.  
Since initial client contact, this has not been an issue. We have not had reason to meet with the client until the demo phase which we've only now arrived at.  
( I imagine Nicky might disagree with this,  just offing a suggestion for a different, more positive sounding take on this )  
No issue with availability of group members.  

 Team members keeping very schedules  
Communications have not been a problem thus far, splitting tasks means response delays have little or no impact.
As anticipated, this has been a positive in helping us avoid merge conflicts.  

 Simulation of course handbook rules.  
While the structure of the dummy data can account for the vast majority of course rules, fringe cases that can't be enforced this way have been found.  

For eg. Within the nursing rules there is 1 hardcoded exception for how unit lists are pulled from the dummy data, this is due to the way pre-exsisting qualifications are handled in the student data.  

```js
  if (studentData['COURSE_CD'] == 'BN04' && !variantCodes.includes('NMBA48') &&
    !variantCodes.includes('BACHI42') && !variantCodes.includes('ENURS48')) {
    variantCodes.push('Rule_A_F')
  } // 1 hard-coded rule becuase nursing is structured weird.
```

The unit WRIT101 causes big headaches in the arts degree (writing major/minor), as it can be taken as a BA core unit or major/minor unit, but can only count for one. Rules like that are common, but with BA-writing the unit is also compulsory. The data structure design cannot account for: ``` if ((... || WRIT101 || ...) || (... || WRIT101 || ...)) == 1 {} ``` so for the prototype it is possible to skip the unit.  

There would certainly be many cases like these if this project was extended to every degree at the university. I have found 3 such cases in the 3 degrees I have typed out data for thus far. ( I couldn't even explain the one i found in bcomp ) I anticipate finding more such cases as I work on the 'minors' and BSC.  


 Time constraints  
As the degree 'capstone' unit, team members are under heightened pressure with job seeking and other changes coming with the looming end of the degree.  
The massive time sink of creating dummy data has proven an extreme challenge. -and was not accounted for as an API to access course and unit data was expected ( as mentioned repeatedly elsewhere, and will continue to be repeated. )  
Time constraints will likely continue to be a concern as we approach the notoriously frustrating 'GUI polish' phase

 Further development  
could probably cut this heading - nothing new to say.  

## Challenges encountered  
Challenges encountered, including a statement of how they were overcome, or a plan to address them	3  

###### Marks notes:  
Mark spent many many hours making unit data  
Many  
Many  
Absolutely every aspect of this project has revolved around accessing course data, which without a very powerful 'web-skimmer' AI appears impossible.  
I think what the client really wants from the project is an idea of feasibility. To the question 'can it be done?' I would reply: 'is there an organised database of course rules?'  

## Modifications to project plan  

###### Marks notes:  
There are BSC entries in the student data we've been given??!!  
Besides having to type out unit data instead of using an API, things are going as per the original plan.  
Extending to include the BSC and other degrees in purely an addition of time, not complexity.  

## Feedback from client regarding project progress
Feedback from client regarding project progress	2
- trying to have organise a meeting and hopefully a demo with the client
