let leftMovie;
let rightMovie;

// fetchs movies details
async function fetchItem(option, summary, side) {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "3df693c8",
      i: option.imdbID,
    },
  });
  // saves data from api
  const movieDetails = response.data;
  // clears summary if another movie was looked up on this side before
  summary.innerHTML = "";
  // creates movie html with data
  createMovieDetails(movieDetails, summary);
  // sets var to compair
  if (side === "right") {
    rightMovie = true;
  } else {
    leftMovie = true;
  }
  // if both sides are set compairs details
  if (leftMovie && rightMovie) {
    movieCompare();
  }
}

//movie compair function
function movieCompare() {
  // selects all left side movie data
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  // selects all right side movie data
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  // loops over and compairs right and left stat
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftValue = parseInt(leftStat.getAttribute("data-value"));
    const rightValue = parseInt(rightStat.getAttribute("data-value"));
    // if left is greater sets html background to red and rights to blue
    if (leftValue > rightValue) {
      leftStat.classList.add("is-danger");
      leftStat.classList.remove("is-primary");
      rightStat.classList.add("is-primary");
      rightStat.classList.remove("is-danger");
    }
    // if right is greater sets html background to red and lefts to blue
    else {
      rightStat.classList.add("is-danger");
      rightStat.classList.remove("is-primary");
      leftStat.classList.add("is-primary");
      leftStat.classList.remove("is-danger");
    }
  });
}

// sets all movies html as well as data values
async function createMovieDetails(movieDetails, summary) {
  // selects data information from api and converts to a number
  const dollar = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metaScore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));
  const awards = movieDetails.Awards.split(" ").reduce((prev, word) => {
    const number = parseInt(word);
    if (isNaN(number)) {
      return prev;
    } else {
      return prev + number;
    }
  }, 0);
  // creates html for one movie
  const div = document.createElement("div");
  div.innerHTML = `
  <article class="media">
  <figure class="media-left">
  <p class="image">
  <img src="${movieDetails.Poster}"/>
  </p>
  </figure>
  <div class="media-content">
  <div class="content">
  <h1>${movieDetails.Title}</h1>
  <h4>${movieDetails.Genre}</h4>
  <pp>${movieDetails.Plot}</pp>
  </div>
  </div>
  </article>
  <article data-value=${awards} class="notification is-primary">
  <p class="title">${movieDetails.Awards}</p>
  <p class="subtitle">Awards</p>
  </article>
   <article data-value=${dollar} class="notification is-primary"> 
   <p class="title">${movieDetails.BoxOffice}</p>
  <p class="subtitle">BoxOffice</p>
  </article>
  <article data-value=${metaScore} class="notification is-primary">
  <p class="title">${movieDetails.Metascore}</p>
  <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
  <p class="title">${movieDetails.imdbRating}</p>
  <p class="subtitle">imdbRating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetails.imdbVotes}</p>
  <p class="subtitle">imdbVotes</p>
  </article>
  `;
  // appends html to page
  summary.appendChild(div);
}

// auto complete config set up
const autoCompleteConfig = {
  // render options determines how the items retrived are displayed
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}"/>
    ${movie.Title}
    `;
  },
  // when option is selected determins what is displayed in text box
  inputValue(movie) {
    return movie.Title;
  },
  // how auto complete data is fetched
  fetchData: async (search) => {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "3df693c8",
        s: search,
      },
    });
    if (response.data.Error) {
      return [];
    } else {
      return response.data.Search;
    }
  },
};

// addition autocomplete configs search bar one
createAutoComplete({
  //spread auto config
  ...autoCompleteConfig,
  // where auto complete is created on page
  root: document.querySelector("#left-autocomplete"),
  // when option is selected hides tutorial and displays on left side
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    fetchItem(movie, document.querySelector("#left-summary"), "left");
  },
});
// addition autocomplete configs search bar one
createAutoComplete({
  // spreads auto config
  ...autoCompleteConfig,
  // where auto complete is created on page
  root: document.querySelector("#right-autocomplete"),
  // when option is selected hides tutorial and displays on right side
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    fetchItem(movie, document.querySelector("#right-summary"), "right");
  },
});
