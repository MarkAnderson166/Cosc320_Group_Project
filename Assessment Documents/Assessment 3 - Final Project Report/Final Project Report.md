# Final Project Report

# Project Title: Degree Completion Roadmap for Students

## Group members and contact details

* Tully McDonald - tmcdon26@myune.edu.au
* Mark Anderson - mander53@myune.edu.au
* Nelson Pray - npray@myune.edu.au
* Nicola Howard - nhoward7@myune.edu.au

## Client name and contact details
*	Client: Student Services at UNE
*	Contact: Timothy Bartlett-Taylor - tbartle4@une.edu.au


## A summary of project outcomes

The brief from the client was to create a system that could automate a process that determines a degree completion roadmap for a student.  By developing a prototype system using a few of the simpler course curriculums we are able to show the client that this objective is possible.

Students would be able to use this system directly without any intervention from the client which would allow them to obtain a quick turnaround. Also, this would free up valuable staff resources at the client as they are not having to perform time-consuming manual interpretations of the student’s degree.

Not only can the student see how far they have progressed, the are able to plan their future course enrollment by using the flexible “drag-and-drop” Roadmap Designer functionality. The student can use calendar functionality to decide which units they want to complete in each trimester. This interactive feature makes it very easy for the student to look at various “what-if” scenarios. Alternatively they are able to use a system generated roadmap by using the recommended options


## A description of your application/software


 
## Project diary
(brief format – key events reconciled against Gantt chart planning). 



## Summary of individual contributions by group members. 
- need some info here from everyone

- Nicky: 
  - interaction with client, 
  - (pretty bad) facilitation, 
  - documentation, 
  - 1 x code update 

- Mark:  
    - Unit and rules data structure design, Dummy data creation and tools, Upload function  
    - Filter functions for course variant, year, advanced standing, and completed units to determine student progression  
    - Dragula Library intergration, Building GUI elements (unit lists, calendar boxes)  
    - 'Open-slot' highlighting, List CP counters, Auto-fill function  

- Nelson:
    - Helped develop the front end specifically worked on implementing the materialize css framework
    - Helped ensure that the UI had a modern look
    - Tried to make sure our app would fit into the UNE ecosystem by using UNE Brand Toolkit for inspiration

## List of requirements and deliverables (completed, remaining, additional).

### Completed

Concise project description from initial contact with client:
"What we need is for a student to be able to dump their data into a database, they choose their course and when they started (or it reads the course version) and throws out the units they have left. Then if it can create a plan for them, then that would be great also."
Our current prototype has met this requirement for students completing a bcomp or nursing degree, and to a lesser extent an arts degree.

"We need a solid record of how long it takes to put these together so we can get a cost analysis of how much it would cost to build something like this."
___clockify___ ?

### Remaining 

- prereqisites
  Tha ability to account for prereqisits is not currently in the code. It is not anticipated to be hard to implement, However the volume of data entry required to make it useful inhibited development.
  If this project or one like it gets access to usable unit data in future, adding a function to more intelligently select units accounting for prerequisits would be relativly simple.

- The calendar 'recommender' is not intelligent at all. Some small tweaks would acheive alot, but we've run out of time.
  While it currently favours doing 100 level units early and 300's later, it regually gets some very wrong. for example it almost always puts 320 in the first year, and often recommends students do MTHS130, which is absolute madness.
  A large improvement to anticipate future pre-reqs (to avoid 'locks' that would arise), or recommend majors (for ba/bsc) would require significantly more work.

- Units that stretch over multiple trimesters were not concidered at all in this design.

### Additional

The entire 'drag'n'drop' interactive system is additional to our given requirments.
Originally we were asked to automate the creation of course plans given individual student data, and our system does that.
But the primary functionality we have developed is a user focused interface to visually guide the student or staff member to create their own personalised plan.

Being a user-focused app appropriate for students, additional features were considered but not implemented so to not stray too far from our original mandate.  
Additional features were considered included:
- login and/or Save and load functions for returning students. This could be done with cookies, url extentions, or a basic DB on a webserver.
- The project is currently client-side only, adding some basic server functionality could allow user saving, and usage statistics very easily.
- printable version of created timetable.

A late addition was the 'sample student'. Implemented as a way to use the app without uploading individual student information this feature allows the user to start a plan from scratch.  
Extending this feature with a menu to select between degree's and majors would further aim this app towards students using it to create personalised plans, rather than our mandated requirements of producing a set plan and using it to check completion.


## Bug report (issue log and resolution).
- CSS files are complicated
- rounded edges, general aesthetics
- error messages should appear when it gets a unit that doesn't belong


- rounded edges, general aesthetics
- error messages should appear when it gets a unit that doesn't belong

- The student data from calista has some 'interesting' characteristics.
  Most data extracted from the large .csv we were given requires 'cleaning-up' as it is read. Most arrays our functions are reading are counting white space, dots, dashes and commers as array entries.
  One particular escaped tab character '\r' caused develpoment problems repeatedly. ( on the 'Unit Sets (Non-Completed)\r' field )

- There is a long a standing graphical bug that seems to detatch the triester unit 'containers' from the header. Resulting in them growing when they don't need to. This became much more obvious once the green highlighting was added - that slight gap under the trimester header is not suposed to be there.
- 
- There was a long standing bug with the unit list counters not resetting upon reloading a new .csv ( load the same student twice to reset ). This bug was found and corrected very late in the project. It was related to a work around for units appearing in 2 different lists. - that work-around was already redundant when it was found to be causing this bug.

## Quality testing report. 
- need to do some research about how to do this


## Lessoned learned. 
- nobody got no time for CSS :)

- The 'back-end' .JS should have used an object orientated approach.  
  In the beginning, given our delayed start it was important to get something up and working as soon as possible. With that in mind the first demonstration website was cobbled together parts of previous projects. That demo was repaired and refined as we progressed. It should have been replaced.  
  A 'page 1 re-write' adopting an OOP approach could have occurred at any time after the structure of the unit/rule data had been finalised. Doing so would have simplified the later stages of development and aided any future work.  

- The difficulty in creating the arts and science degree's unit data should have been recognised earlier. And been declared 'out of scope'
  The back end is designed to universally work with any degree if the data is in the data.js file. And with access to usable unit data from UNE, any degree at all. A major component of the design is this universality.  
  If the call had been made early to focus only on bcomp and nursing, the entire development process would have been far simpler. As it stands B.A degrees are only partially working despite a tremendous amount of time being spent just entering unit data, and bsc degrees don't work at all. For a prototype, I consider this a large waste of time.

- Breaking up the code
  Coupled with taking an OOP approach, breaking up large and/or complicated files would have simplified development as the project grew. for eg: taking all of the colouring out of the main .css and taking the GUI-only functions and dragula library API stuff out of the main .js.  More modular code would be easier to maintain over time.

- At least glance at the final assesment before the final week, just in case keeping a diary or records is required.....

- Having weekly meetings helped ensure the project was moving forward and kept everyone together
- Working with a client can lead to unexpected outcomes (we were expecting the data to be given to us in a certain manner based on our initial client meeting but then received something completely different
- Working across different timezones are both a blessing and curse: harder to schedule meetings but less likely to have merge conflicts
- Having different strengths/programming styles can make working on the same code more challenging. This is probably why places like Google and others have code style guides