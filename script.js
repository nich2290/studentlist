"use strict";

window.addEventListener("DOMContentLoaded", start);
// Global variables
const allStudents = [];
let currentList = [];
let sortButton;
let studentHouse;
let Filter;
let expellArray = [];
let bloodStatus = [];

// Our prototype Student object properties.
const Student = {
  firstName: "-firstName-",
  middleName: "",
  lastName: "",
  imageName: "",
  gender: "-gender-",
  house: "-house-",
  id: "-id",
  bloodStatus: "",
  prefect: false,
  squad: ""
};
const Nicklas = {
  firstname: "-firstname-",
  lastname: "-lastname-",
  middleName: "-middlename-",
  house: "-house-",
  uuid: "1337"
};
// This function  starts the "Program" with EventListeners and by calling key functions.
function start() {
  console.log("ready");
  document.querySelector("#hacking").classList.add("hide");
  // EventListeners for Expelling, Sorting and Filtering.
  document.querySelector(".students").addEventListener("click", expellAndPrefect);

  document.querySelectorAll(".sort").forEach(elm => {
    elm.addEventListener("click", setSort);
  });

  document.querySelectorAll(".filter").forEach(elm => {
    elm.addEventListener("click", setFilter);
  });
  const nicklas = Object.create(Nicklas);
  nicklas.firstName = "Nicklas";
  nicklas.lastName = "Potter";
  nicklas.house = "Gryffindor";
  nicklas.middleName = "Weasley";
  nicklas.id = "1337";
  allStudents.push(nicklas);
  loadJSON();
  loadJsonBlood();
}
// Expelling students from the list.
function expellAndPrefect(event) {
  console.log("something clicked");
  let element = event.target;
  const id = element.dataset.id;
  let indexCur = findByIdCur(id);
  let indexAll = findByIdAll(id);
  let clickedStudent = allStudents[indexAll];
  if (element.dataset.action === "remove" && id === "1337") {
    console.log("Remove button clicked");

    document.querySelector("#hacking").classList.add("deploy");
    document.querySelector(".students").classList.add("blur");
    document.querySelector("header").classList.add("blur");
    document.querySelector("#hacking").classList.add("shake");
    setTimeout(function() {
      document.querySelector("#hacking").classList.remove("deploy");
      document.querySelector(".students").classList.remove("blur");
      document.querySelector("header").classList.remove("blur");
    }, 3000);
  } else if (element.dataset.action === "remove") {
    element.parentElement.remove();
    currentList.splice(indexCur, 1);
    allStudents.splice(indexAll, 1);
    console.table(currentList);
  } else if (element.dataset.action === "add_prefect") {
    clickedStudent.prefect = true;
    console.log(clickedStudent.prefect);
    addingPrefectEvent(clickedStudent, element);
  }
  document.querySelector(".studentcount").innerHTML = `Number of students in current selection: ${currentList.length}`;
}

function findByIdCur(id) {
  return currentList.findIndex(obj => obj.id == id);
}
function findByIdAll(id) {
  return allStudents.findIndex(obj => obj.id == id);
}

function loadJSON() {
  fetch("http://petlatkea.dk/2019/hogwartsdata/students.json")
    .then(response => response.json())
    .then(jsonData => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

// Cleanup Json DATA.
function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    // Create new object with cleaned data
    const student = Object.create(Student);

    const fullName = jsonObject.fullname.trim().split(" ");
    console.log(fullName);
    const house = jsonObject.house.trim();

    student.gender = jsonObject.gender;

    student.house = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase();

    student.firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1).toLowerCase();

    if (fullName.length === 2) {
      console.log("studerende har intet mellemnavn");
      student.lastName = fullName[1].charAt(0).toUpperCase() + fullName[1].slice(1).toLowerCase();
    } else if (fullName.length === 3) {
      console.log("studerende har et mellemnavn");
      student.middleName = fullName[1].charAt(0).toUpperCase() + fullName[1].slice(1).toLowerCase();
      student.lastName = fullName[2].charAt(0).toUpperCase() + fullName[2].slice(1).toLowerCase();
    }

    student.id = uuidv4();
    // Add pictures to the respective student.
    if (student.lastName == "Patil") {
      student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
    } else {
      student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
    }
    if (student.bloodStatus == "") {
      student.bloodStatus = "Muggleborn";
    }
    student.squad = false;
    allStudents.push(student);
  });

  rebuildList();
}
//UUID generator from: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
// Used to give every student on the list a unique ID.
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
// This function rebuilds the list after being restructured in ObjectsPreparing.
function rebuildList() {
  filterListBy("all");
  displayList(currentList);
}
// This function will highlight the selected Sort button.
function setSort() {
  sortButton = this.getAttribute("data-sort");
  document.querySelectorAll(".sort").forEach(elm => {
    elm.classList.remove("valgt");
  });
  this.classList.add("valgt");
  sortCurrentStudents(sortButton);
}
// Sort the student list from A-Z Based on the current selection. (First name, Last name and House.)
function sortCurrentStudents(sortButton) {
  currentList.sort((a, b) => {
    let comp;
    if (sortButton == "first_name") {
      comp = a.firstName.localeCompare(b.firstName);
    } else if (sortButton == "last_name") {
      comp = a.lastName.localeCompare(b.lastName);
    } else if (sortButton == "house") {
      comp = a.house.localeCompare(b.house);
    }
    return comp;
  });

  displayList(currentList);
}

// Display all students as default, before applying any filters.
function filterListBy(filterBy) {
  currentList = allStudents.filter(student => {
    return true; // right now, just don't filter anything
  });
}
// This function will highlight the selected Filter button, and forward it to the actual filter function.
function setFilter() {
  Filter = this.dataset.hus;
  document.querySelectorAll(".filter").forEach(elm => {
    elm.classList.remove("valgt");
  });
  this.classList.add("valgt");
  console.log(Filter);
  currentList = filtering(Filter);
  displayList(currentList);
}
// This function filters the content based on which house button is clicked on, and only shows students from the selected house.
function filtering(house) {
  let filterlist = allStudents.filter(filterHouse);
  function filterHouse(student) {
    if (student.house == house || house == "alle") {
      return true;
    } else {
      return false;
    }
  }
  return filterlist;
}

function displayList(students) {
  // clear the list
  document.querySelector(".students").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}
// Display content in a list.
function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template").content.cloneNode(true);

  // set clone data
  clone.querySelector("img").innerHTML = `<img src="img/${student.imageName}" alt="" </img>`;
  clone.querySelector(".names").innerHTML = `${student.firstName} ${student.middleName} ${student.lastName}`;

  clone.querySelector(".house").innerHTML = student.house;

  //store the index on the button
  clone.querySelector("[data-action=remove]").dataset.id = student.id;
  clone.querySelector("[data-action=add_prefect]").dataset.id = student.id;

  clone.querySelector(".names").addEventListener("click", visSingle);

  // Show number of students:
  document.querySelector(".studentcount").innerHTML = `Number of students in current selection: ${currentList.length}`;
  // append clone to list
  document.querySelector(".students").appendChild(clone);

  // Popup window for each student, with a more detailed description.
  function visSingle() {
    console.log(student);
    document.querySelector("#indhold").innerHTML = `
                <article class="singlestudent">
                <img src="img/${student.imageName}" alt ="" </img>
                    <h2>${student.firstName} ${student.middleName} ${student.lastName}</h2>
                    <p>${student.house}.</p>
                    <p>${student.bloodStatus}.</p>
                    <button class="squad" data-id=${student.id}>Squad</button>
                    
                    
                </article>
                   `;

    document.querySelector("#popup").style.display = "block";
    document.querySelector(".squad").addEventListener("click", squadStudents);
    document.querySelector("#popup #luk").addEventListener("click", close);
    stylePopop();
  }
  // Close Popup window and go back to the initial interface.
  function close() {
    document.querySelector("#popup").style.display = "none";
  }

  studentHouse = `${student.house}`;
  stylePopop();

  // Styling of the Popup window, with different colors, based on the house that the student belongs to.
  function stylePopop() {
    const Gryffindor = "#4c0405";
    const Hufflepuff = "#f3de07";
    const Ravenclaw = "#0b304a";
    const Slytherin = "#234723";

    if (studentHouse == "Gryffindor") {
      document.querySelector("#popup").style.backgroundColor = Gryffindor;
    } else if (studentHouse == "Hufflepuff") {
      document.querySelector("#popup").style.backgroundColor = Hufflepuff;
    } else if (studentHouse == "Ravenclaw") {
      document.querySelector("#popup").style.backgroundColor = Ravenclaw;
    } else if (studentHouse == "Slytherin") {
      document.querySelector("#popup").style.backgroundColor = Slytherin;
    }
  }
}

// Load second JSON file with family information
async function loadJsonBlood() {
  let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/families.json");

  bloodStatus = await jsonData.json();

  const halfBloodStatus = bloodStatus.half;
  const pureBloodStatus = bloodStatus.pure;

  findHalfBlood(halfBloodStatus);
  findPureBlood(pureBloodStatus);
}
//This function will find students with pureblood by pairing with lastname
function findPureBlood(pureBloodStatus) {
  let pure;

  pureBloodStatus.forEach(student => {
    pure = student;

    allStudents.forEach(student => {
      if (student.lastName == pure) {
        student.bloodStatus = "Pureblood";
      }
    });
  });
}
// This function will find students with halfblood by pairing with lastname
function findHalfBlood(halfBloodStatus) {
  let half;

  halfBloodStatus.forEach(student => {
    half = student;

    allStudents.forEach(student => {
      if (student.lastName == half) {
        // console.log("The student is halfblood");
        student.bloodStatus = "Halfblood";
      }
    });
  });
}
// Function for making students part of inquisitorial team - This function is not working completely as intended, and im unsure about how i can carry on with it.
function squadStudents() {
  const id = this.dataset.id;

  allStudents.forEach(student => {
    if (student.bloodStatus == "Pureblood" || student.house == "Slytherin") {
      if (student.id == id && student.squad == false) {
        document.querySelector(".squad").textContent = "Remove";
        student.squad = true;
        setTimeout(function() {
          removeSquadStudent(id);
        }, 4000);
        console.log(student.squad);
      } else if (student.id == id && student.squad == true) {
        document.querySelector(".squad").textContent = "Add";
        student.squad = false;
        console.log(student.squad);
      }
    }
  });
}
// This  function removes a student from the squad by checking student ID:
function removeSquadStudent(id) {
  console.log("Removed from squad");
  allStudents.forEach(student => {
    if (student.id == id && student.squad == true) {
      student.squad = false;
      document.querySelector(".squad").textContent = "Add";
      console.log(student.squad);
    }
  });
}
// Add prefects with a maximum of 2 from each house.

function addingPrefectEvent(clickedStudent, element) {
  //console.log("addingPrefectEvent");
  let house = clickedStudent.house;
  //console.log(house);
  console.log(clickedStudent);
  let prefectsInHouse = getPrefectsInHouse(house);
  console.log(prefectsInHouse);
  if (prefectsInHouse.length < 3) {
    addPrefect(clickedStudent, element);
  } else {
    showAlert(house, prefectsInHouse, element);
  }
}

function getPrefectsInHouse(house) {
  return allStudents.filter(student => {
    if (student.house === house) {
      if (student.prefect === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
}
function showAlert(house, prefectsInHouse) {
  // Display alert popup if trying to select more than 2 prefects from a given house.  Give the opportunity to revoke a student, to go back to the front page.
  document.querySelector("#alert").style.display = "block";
  document.querySelector("#alert .p_top").textContent = "There are already 2 prefects from " + house + ", you have to revoke atleast one, to add a new from that house.:";

  document.querySelector("#stud_0").textContent = prefectsInHouse[0].firstName;
  document.querySelector("#stud_0").addEventListener("click", function() {
    document.querySelector("#stud_0").textContent = prefectsInHouse[0].firstName + " prefect status revoked!";
    prefectsInHouse[0].prefect = false;
    document.querySelectorAll(".prefect").forEach(prefectButton => {
      if (prefectButton.dataset.id == prefectsInHouse[0].id) {
        prefectButton.style.color = "black";
      }
    });
    setTimeout(function() {
      document.querySelector("#alert").style.display = "none";
    }, 3000);
  });

  document.querySelector("#stud_1").textContent = prefectsInHouse[1].firstName;
  document.querySelector("#stud_1").addEventListener("click", function() {
    document.querySelector("#stud_1").textContent = prefectsInHouse[1].firstName + " prefect status revoked!";
    prefectsInHouse[1].prefect = false;
    document.querySelectorAll(".prefect").forEach(prefectButton => {
      if (prefectButton.dataset.id == prefectsInHouse[1].id) {
        prefectButton.style.color = "black";
      }
    });
    setTimeout(function() {
      document.querySelector("#alert").style.display = "none";
    }, 3000);
  });
}
// Adds prefect and applies styling.
function addPrefect(clickedStudent, element) {
  clickedStudent.prefect = true;

  element.style.color = "red";
}

function removePrefect(clickedStudent, element) {
  clickedStudent.prefect = false;
  element.nextElementSibling.style.color = "black";
}
