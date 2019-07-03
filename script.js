const list = document.querySelector("ul");
const form = document.querySelector("form");
const btn = document.querySelector("button");

const addRecipe = (recipe, id) => {
  let time = recipe.created_on.toDate();
  let html = `
        <li data-id="${id}">
            <div>${recipe.title}</div>
            <div>${time}</div>
            <button class="btn btn-danger btn-sm my-2">Delete</button>
        </li>
   `;

  list.innerHTML += html;
};

// deleting ui

const deleteRecipe = id => {
  const recipes = document.querySelectorAll("li");
  recipes.forEach(recipe => {
    if (recipe.getAttribute("data-id") === id) {
      recipe.remove();
    }
  });
};

// get elements
const unsub = db.collection("Recipe").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if (change.type === "added") {
      addRecipe(doc.data(), doc.id);
    } else if (change.type == "removed") {
      deleteRecipe(doc.id);
    }
  });
});

// add Element
form.addEventListener("submit", e => {
  e.preventDefault();

  const now = new Date();
  const recipe = {
    title: form.recipe.value,
    created_on: firebase.firestore.Timestamp.fromDate(now)
  };

  db.collection("Recipe")
    .add(recipe)
    .then(() => {
      console.log(`Recipe added`);
    })
    .catch(err => {
      console.log(err);
    });
});

// deleting elements

list.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.parentElement.getAttribute("data-id");

    db.collection("Recipe")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Recipe deleted");
      })
      .catch(err => {
        console.log(err);
      });
  }
});

// unsubscribe from changes

btn.addEventListener("click", () => {
  unsub();
  console.log(`Unsubscribe from changes`);
});
