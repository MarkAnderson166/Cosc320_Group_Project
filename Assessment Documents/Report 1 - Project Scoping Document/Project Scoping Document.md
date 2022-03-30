# Degree Completion Roadmap for Students

## Group members and contact details

* Tully McDonald - tmcdon26@myune.edu.au
* Mark Anderson - mander53@myune.edu.au
* Nelson Pray - npray@myune.edu.au
* Nicola Howard - nhoward7@myune.edu.au

## Client name and contact details

Client: Student Services at UNE.  
Contact: Timothy Bartlett-Taylor - tbartle4@une.edu.au  

## A short one paragraph summary of the project

The client requires a working prototype to enable students to complete a self-check to see where they are up to within their degree.
Currently this is a manual process and the client would like this automated. The platform should allow for students to input the units 
they have passed, along with any advanced standing credits, and after selecting a course version, the tool would output the remaining
units required to fulfill their degree. 

## Specification of client requirements (e.g. in terms of software deliverables, functionality).
###### INPUT
Ability for student to enter their current progress
ie, the units they have already passed along with any advanced standing credits applied
Also, enter the units that they are planning to do
This will be done via  web front end, possible a mobile app if there is time

###### PROCESSING
The student will also select their course version, from a list of those available for processing
The processing engine will determine how the inputs from the student match the rules as defined by the handbook.
This is the difficult part - how to turn the rules from the handbook into something that can be processed.

###### OUTPUT
The platform will advise the student what additional units are required.
A roadmap of how to achieve this is a nice to have

## Statement of Project Scope (as specified by the student group and agreed by the client). 
(project goals, deadlines and tasks
(guide on all facets of project, from tasks to be completed to resources required
(1. Define goals
Deliverables
1. Develop an HTML/web based platform that allows a student to capture their current course progress and advanced standing credits.
The student must also select a course that they are comparing to.
This state will not be stored - it is only for the life of the session
2. A backend process to generate the rules for this course --- how?
3. A processing engine to compare the student inputs with the course rules
4. The web platform will display the results of the comparison

The prototype will concentrate on processing the B.A degree
If there is time further work around B.Comp and more complicated degrees can be reviewed. 

Measurements
UNE SS will provde dummy data to compare our processing with their manual process. They will also test against invalid data to ensure
the platform picks up discrepencies


2. Potential obstacles
Timeous feedback from the client to ask for potential 





Out of scope
Roadmap of how to achieve completion of the degree
checking prerequisites
Complicated courses



## Feasibility Statement (identify technologies required, group skill set, time constraints, resource constraints etc.). 



## Assignment of Team Member Responsibilities. 

* Nicola - Coordinator, Documentation, Project design and architecture
* Nelson - 
* Tully - 
* Mark  - 

## Project timeline specified using a Gantt chart. 

<img src="Gantt.png" alt="Gantt Chat" width="1000"/>
`(Example of an embedded picture in .md lifted from my 310 group project)`

## Identification of project risks (add brief comments on how they might be addressed if encountered). 

| Risks                 | Probability | Impact   |
|-----------------------|-------------|----------|
| Scope Creep           | 20%         | Marginal |
| Scheduling  Errors    | 25%         | Critical |
| Budgeting Errors      | 20%         | Critical |
| Training Requirement  | 10%         | Marginal |
| Personnel Absence     | 5%          | Minor    |
| Data Security Issues  | 5%          | Minor    |
| Integration Issues    | 5%          | Critical |

