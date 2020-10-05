
const createAutoComplete = ({
  // destruct in variables
  root,
  renderOption,
  onOptionSelect,
  fetchData,
  inputValue,
}) => {
  // sets base html for input on selected target
  root.innerHTML = `
<lable><b>Search</b></lable>
<input class="input"/>
<div class="dropdown">
<div class="dropdown-menu">
<div class="dropdown-content results">
</div>
</div>
</div>
`;
// selects results 
  const dropdownWrapper = root.querySelector(".results");
  // selects drop down
  const dropdown = root.querySelector(".dropdown");
  // selects input
  const input = root.querySelector("input");
  // adds event listener to document if selected item is not in the auto complete closes auto complete
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      dropdownWrapper.innerHTML = "";
      dropdown.classList.remove("is-active");
    }
  });
  // fetches data user inputs
  const onInput = async (e) => {
    const options = await fetchData(e.target.value);
    // if input is empty closes auto complete
    if (!options.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    // if not empty opens autocomplete 
    dropdown.classList.add("is-active");
    // clears old data if auto complete was used before
    dropdownWrapper.innerHTML = "";
    // creates new list with input
    createList(options);
  };

  // adds event listener and adds a delay on listener
  input.addEventListener("input", debounce(onInput, 500));

  // creates auto complete list
  function createList(options) {
    // loops data
    for (let option of options) {
      // creates link
      const details = document.createElement("a");
      // sets html of item
      details.innerHTML = renderOption(option);
      // add drop down class
      details.classList.add("dropdown-item");
      // adds listener to link
      details.addEventListener("click", async () => {
        // when selected closes drop down
        dropdown.classList.remove("is-active");
        // changes input to item selected
        input.value = inputValue(option);
        // displays selected option
        onOptionSelect(option);
      });
      // adds item to auto complete list
      dropdownWrapper.appendChild(details);
    }
  }
};
