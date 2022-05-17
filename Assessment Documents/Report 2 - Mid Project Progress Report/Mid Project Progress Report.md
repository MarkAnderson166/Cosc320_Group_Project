# Mid Project Progress Report

# Project Title: Degree Completion Roadmap for Students

## Group members and contact details

* Tully McDonald - tmcdon26@myune.edu.au
* Mark Anderson - mander53@myune.edu.au
* Nelson Pray - npray@myune.edu.au
* Nicola Howard - nhoward7@myune.edu.au

## Client name and contact details
*	Client: Student Services at UNE
*	Contact: Timothy Bartlett-Taylor - tbartle4@une.edu.au


## Summary of the project
 The client has requested a working prototype to automate the process of determining a student’s degree completion roadmap. The prototype will use the student’s current course progress (in CSV file format) to display the remaining units required to succesfully complete their degree. It will also allow the student to plan out their roadmap in a visually appealing and easy to understand format.

## Overall progress to date
Initial progress on the project was slow due to client availability to discuss the requirements and not receiving the sample data. However, since receiving the data development has progressed well. 

Completed
1. Platform – A solution is available using HTML, CSS and JavaScript, along with the implementation of two frameworks.

2. Processing – Three of the four requested degrees (B.A., B.Comp, and BN04) have been encoded into JavaScript using the information available in the Handbook. The student CSV file that is uploaded is then read, parsed and compared to degree “rules” file. Determinations are made as to what units have been completed, when they were completed, and which units still need to be completed.

2. User Interface – Using a standard web browser the UI allows for a CSV file to be uploaded. After processing, the UI identifies the student, their degree and lists the Advanced Standing units. It also displays the units already completed at UNE in the Trimester calendar.  On the right-hand side is a list of Available units (units to be completed), which allows the student to drag and drop them into place on the calendar to determine a roadmap for themselves.

3. Testing – The sample data supplied has been extracted into 1200 files to simulate individual students.

In Progress
1. User Interface – The UI needs some adjusting to make it easier to use and “prettier”, and there are a few bugs that need to be resolved. In general, it needs to be simplified so that a first time user can understand how they should interact with the platform.

2. Processing – The remaining BSC degree still needs to be encoded and tested against the sample data. This should be straighforward, albeit it timeconsuming to capture the data.

3. Roadmap – The drag and drop features have bugs that need to be addressed. The “recommendation calendar” feature is still being worked on. 



** include a sample screenshot ??
  


## Main achievements

The major area of concern was how to process all the disparate degree information as each one has a different set of rules and requirements. It was only when the sample student data was supplied that we were able to get a better understanding of how this could be coded. 

In the current version, the degree rules are embedded into a simple data structure using a JavaScript file. The backend system then compares the student data to these course data directly, without having to apply complicated “rules” to filter the data.

** don’t really understand this bit about rules filtering the data 
 
Another achievement is the “drag-and-drop” format of the Roadmap. Rather than provide the student with an inflexible, system generated roadmap, the student can use the Trimester calendar to make decisions on what units to complete and in which trimester. For example, the recommended roadmap does not schedule any units in T3, so using this calendar means the student can possibly schedule some units in T3 allowing for a lighter workload.


## Comparison: Planned vs Actual

Our original progress chart has been pushed out to accomodate the client’s availability as well as the delayed start on the project. Specifically, the User Specification was only completed after the intitial client meeting. 

Also, the User Interface Design has and amended start date and is due to finish at the  same time as the UI Development. The UI design was not conceptualised fully, but is a fluid build that is evolving depending on how other aspects of the project are developed.

The development targets have remained the same as we are constrained by the end of the trimester., however they only started in earnest after the initial client meeting. This also applies to the in-house testing, however Outside Beta testing will be unlikely in this scenario so it has been removed.

The delivery dates have been pushed out to as close as possible to the final week.
The attached Gantt chart shows a comparison between the orignal (blue) and the current one (green).


## Review of project scope and risks

In reviewing the stated project goals, there is little movement from what was outlined in the scoping document. A slight deviation is around the rules sets – at present we are only working with the 2022 (should include 2021) rule set and we have been give 4 degrees to work with (instead of 3). It is a manual, time-consuming task to create the data structure for course rules hence we decided to rather focus on the actual development of the platform. However, once the system is fully functional, it will be a simple process to add in other rule sets for comaprison. 

Additional functionality that is being developed is the student roadmap. This was considered an optional goal when the original scope was created as it was time-dependent. As we progressed through the project, we identified that this would be a valuable feature to include. It is not considered “scope creep” as it is simply a feature we are adding as time has allowed.

Addressing the identified project risks:
None of the risks have had an adverse affect on our project development. Having said that it, it would have been preferable to speak with the client earlier on to obtain feedback on the scoping document. It is a concern to demonstrate this prototype so close to the end of the deadline as there is very little time available for reworking the solution.

All group members have been responsive and available on Slack. Working remotely on a development project does make it more difficult however, especially initially when doing the design and architecture. On the positive side, splitting up responsibilities means that there are fewer delays waiting for others, and also helps avoid merge conflicts when sharing a common code base. 

As anticipated from the start of the project, the simulation of the handbook rules has proved to be the biggest challenge. The structure of the data in the JavaScript files accounts for almost all course rules, however we have found a few fringe cases that cannot be enforced using this method. This is discussed in more detail in the “Challenges Encountered” section below.

Time constraints are a pressing issue, as team members are under hightened pressure due to current work commitments, job seeking and internship applications, along with other personal challenges experienced due to the pending completion of their degree.

The vast amount of time invested in creating the course data was unplanned and demanding and was not accounted for initially. This has led to limited time allowed for the client to make amendendments to the UI. This also takes into account that the acceptance and sign-off of the user interface may be difficult to achieve as it is subjective and emotive. As a result it has introduced a potential risk of not completing the user interface to a sufficiently high standard for the client. 


## Challenges encountered  

* Encoding the course data

As mentioned previously, obtaining the course data in a structured format that can be used by a computer system was by far the most difficult aspect of the development. We had initially expected being able to query an API, or even be able to use a “web-scraper” to translate the handbook available on the web.

Having these rules encoded was critical to the project, and the onyl foreseeable way to achieve this was to manually transcribe the handbook rules into a JavaScript file, and absorb the time impact to other areas of the project.


* Fringe cases

The method used to encode the course data has resulted in a few fringe cases. Each case has had to be evaluated individually so that a decision could be made as to how to dealt with it.

For example, the Nursing degree has a hardcoded rule which is not ideal for when future changes are required. Another example is in the BA degree which has a unit (WRIT101) which cannot be factored into the code at this stage.

We anticipate more such cases, and they will be highlighted to the client as potential blockers for when they evaluate this prototype for future development. 


* Time tracking

An accurate assessment of the time spent on the project is a bit difficult. Work on the project is done in an “ad-hoc” manner and it is therefore hard to keep track of. It is often done interspersed between other work and study demands and one forgets to keep a record at the time.

The other aspect to this is that some of the coding and UI development may have been achieved faster by more experienced developers.

That said, the group is keeping track of time spent using an online application called Clockify, which allows us to report back to the client at the end of the trimester, and this should be sufficient for them to guage feasibility of the project.


* Limited feedback

It would have been preferable to receive feedback from the client earlier in the life cycle so that we could ensure we had a good understanding of the brief before investing heavily into the development.
In a similar vein, we would also have liked to show the client the progress earlier on, and discuss some of the issues regarding the fringe cases mentioned above.

Having recently received feedback on the Scoping Document, we are feeling more confident that we are meeting the client’s requirements. We have also arranged for a demonstration and should be able to make amendments where necessar before the due date. 


## Modifications to project plan  

Because of the flexibility in the client requirements, we are not having to modify the original plan much. However, the back-end development phase has required more time due to the manual coding of the course data, which in turn, has resulted in less time for available for UI phase.
