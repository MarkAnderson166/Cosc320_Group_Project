# Handover Documentation

## Project Description
 A working prototype to automate the process of determining a student’s degree completion roadmap. The prototype will use the student’s current course progress (in CSV file format) to display the remaining units required to succesfully complete their degree. It will also allow the student to plan out their roadmap in a visually appealing and easy to understand format.

## Deploy Locally
Inside the `code` folder double click the `index.html` file to have it open in default web browser to obseve and interact with the web app.

## Deploy to Production
Use any form of website deployment that is familiar

## Code Structure
-   `Code`
    - `/css`
        - `style.css` - stylises the front end UI
    - `/js`
        - `js.js` - Backend code that converts the converts the `csv` file into the roadmap and creates frontend elements when mapping out the degree.
    - `data.js` - hard coded form of the units that were tested
    - `index.html` -  The html foundation of the web app
-   `Doc`
    - `/student_data` - contains hand encoded examples of the student data used to develop the project

## External Code Used

- [Materialize CSS](https://materializecss.com/) -  Frontend CSS Framework based on Material Design 
- [Dragula and Vanilla JS](https://github.com/bevacqua/dragula) - Used to implement the drag and drop feature
