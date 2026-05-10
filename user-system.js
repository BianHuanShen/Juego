/* =========================================
   EDIT USER SYSTEM
========================================= */

document
  .getElementById("editUserBtn")
  .onclick = openEditUserModal;

function openEditUserModal(){

  if(!currentUser) return;

  const modal =
    document.getElementById(
      "editUserModal"
    );

  const input =
    document.getElementById(
      "editUsernameInput"
    );

  input.value =
    currentUser.name;

  modal.style.display = "flex";

  input.focus();
}

document
  .getElementById("cancelEditBtn")
  .onclick = () => {

    document
      .getElementById(
        "editUserModal"
      )
      .style.display = "none";
};

document
  .getElementById("confirmEditBtn")
  .onclick = saveEditedUser;

document
  .getElementById(
    "editUsernameInput"
  )
  .addEventListener("keydown", e => {

    if(e.key === "Enter"){
      saveEditedUser();
    }

  });

function saveEditedUser(){

  if(!currentUser) return;

  const input =
    document.getElementById(
      "editUsernameInput"
    );

  const newName =
    input.value.trim();

  if(newName.length < 3){

    input.style.border =
      "2px solid red";

    input.value = "";

    input.placeholder =
      "Mínimo 3 caracteres";

    return;
  }

  const exists = users.some(
    u =>
      u.name.toLowerCase() ===
      newName.toLowerCase() &&
      u !== currentUser
  );

  if(exists){

    input.value = "";

    input.style.border =
      "2px solid red";

    input.placeholder =
      "Ese nombre ya existe";

    return;
  }

  currentUser.name = newName;

  saveUsers();

  renderUsers();

  document
    .getElementById("playerName")
    .textContent = newName;

  document
    .getElementById(
      "editUserModal"
    )
    .style.display = "none";
}

/* =========================================
   DELETE USER SYSTEM
========================================= */

document
  .getElementById("deleteUserBtn")
  .onclick = openDeleteModal;

function openDeleteModal(){

  if(!currentUser) return;

  document
    .getElementById(
      "deleteUserModal"
    )
    .style.display = "flex";
}

document
  .getElementById("cancelDeleteBtn")
  .onclick = () => {

    document
      .getElementById(
        "deleteUserModal"
      )
      .style.display = "none";
};

document
  .getElementById("confirmDeleteBtn")
  .onclick = deleteCurrentUser;

function deleteCurrentUser(){

  if(!currentUser) return;

  const index =
    users.findIndex(
      u => u.name === currentUser.name
    );

  if(index !== -1){

    users.splice(index, 1);

    saveUsers();

    renderUsers();
  }

  currentUser = null;

  score = 0;
  level = 1;
  combo = 1;

  document
    .getElementById(
      "deleteUserModal"
    )
    .style.display = "none";

  showScreen("userScreen");
}
