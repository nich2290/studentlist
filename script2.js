let indhold;
let filter = "alle";
let hus = [];

document.addEventListener("DOMContentLoaded", hentJson);
//Henter JSON fil i asynkron function.

// LOAD
async function hentJson() {
  console.log("Henter json");
  // Fortæller os om async functionen bliver loaded
  const url = "http://petlatkea.dk/2019/students1991.json";

  // Henter data filen
  const myJson = await fetch(url);
  // den hentede data skal tolkes som json
  indhold = await myJson.json();
  //Kalder funktion der viser data i DOM

  visIndhold();

  //Leder async functionen videre til "visIndhold" functionen, hvor indholdet bliver hentet ind.
}
// Show Content
function visIndhold() {
  //Destinationen for hvor vi vil have indholdet hen
  let dest = document.querySelector(".students");
  //Template i destinationen, som danner opbygningen af det aktuelle post, i html.
  let temp = document.querySelector("template");

  //En "For each" funktion, som gør at hvert nyt post bliver sat i hver sin template, altså bliver indholdet loopet. og overskriver dermed ikke hinanden
  indhold.forEach(student => {
    if (filter == "alle" || filter == student.house) {
      //cloneNode skaber en kopi af "template".
      let klon = temp.cloneNode(true).content;
      console.log(student.fullname);
      klon.querySelector("h3").innerHTML = student.fullname;
      klon.querySelector(".house").innerHTML = student.house;

      //Sender klonen retur til vores destination "student" og processen gentages.
      dest.appendChild(klon);
      dest.lastElementChild.addEventListener("click", () => {
        visSingle(student);

        function visSingle(student) {
          document.querySelector("#indhold").innerHTML = `
                    <article class="singlestudent">
                        <h2>${student.fullname}</h2>
                        <p>${student.house}.</p>
                    </article>
                       `;
          document.querySelector("#popup").style.display = "block";
          studentHouse = `${student.house}`;
          stylePopup();
          document
            .querySelector("#popup #luk")
            .addEventListener("click", close);
        }

        function close() {
          document.querySelector("#popup").style.display = "none";
        }
      });
    }
  });
}
function stylePopup() {
  //colors of houses
  const Gryffindor = "#4c0405";
  const gryf2 = "#f3c019";
  const Hufflepuff = "#f3de07";
  const huff2 = "#0c0d08";
  const Slytherin = "#234723";
  const slyth2 = "#9e9996";
  const rave1 = "#725438";
  const Ravenclaw = "#0b304a";
  if (studentHouse == "Gryffindor") {
    document.querySelector("#popup").style.backgroundColor = Gryffindor;
  } else if (studentHouse == "Hufflepuff") {
    document.querySelector("#popup").style.backgroundColor = Hufflepuff;
  } else if (studentHouse == "Ravenclaw") {
    document.querySelector("#popup").style.backgroundColor = Ravenclaw;
  } else if (studentHouse == Slytherin) {
    document.querySelector("#popup").style.backgroundColor = Slytherin;
  }
}
clickSorting();
document.querySelectorAll(".filter").forEach(elm => {
  elm.addEventListener("click", clickFilter);
});

function clickSorting() {
  console.log("Click sorting");

  document
    .querySelector("#firstname")
    .addEventListener("click", sortByFirstName);
  document.querySelector("#lastname").addEventListener("click", sortByLastName);
  document.querySelector("#house").addEventListener("click", sortByHouse);
}

function sortByFirstName() {
  // Sorting works in console, but needs implementation to function in live-preview. I'm unsure about this.
  console.log("sort by first name");
  indhold.sort((a, b) => {
    return a.fullname.localeCompare(b.fullname);
  });

  console.log(indhold);
}

function sortByLastName() {
  // Implementation of this needs to be worked on, it is currently not working at all.
  //   console.log("sort by last name");
  //   let fullName = indhold.fullname;
  //   const searchTerm = " ";
  //   let lastName = indhold.substring(
  //     fullName.indexOf(searchTerm) + 1,
  //     fullName.indexOf(searchTerm, fullName.indexOf(searchTerm) + 1) + 1
  //   );
  //   indhold.sort((a, b) => {
  //     return a.lastName.localeCompare(b.lastName);
  //   });
  //   console.log(indhold);
}

function sortByHouse() {
  // Sorting works in console, but needs implementation to function in live-preview. I'm unsure about this.
  console.log("sort by house");
  indhold.sort((a, b) => {
    return a.house.localeCompare(b.house);
  });

  console.log(indhold);
}

function clickFilter() {
  console.log("filtrering");
  filter = this.getAttribute("data-hus");
  document.querySelector(".students").textContent = this.textContent;
  document.querySelectorAll(".filter").forEach(elm => {
    elm.classList.remove("valgt");
  });
  this.classList.add("valgt");
  visIndhold();
}
//     function sortByFirstName (){
//       console.log)"sort by first name"
//   let newList = ["draco", "harry", "hermione", "ron"];

//   //TODO: Fix this later, implement actual sorting
//
