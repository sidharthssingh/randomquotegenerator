import Fuse from "fuse.js";
import VueMaterial from "vue-material";
import StarRating from "vue-star-rating";

Vue.use(VueMaterial);

const quoteGenerator = new Vue({
  el: "#quote-container",
  data: {
    quote: null,
    author: null,
    source: null,
    index: null,
    show: true,
    id: null,
    rating: 0,
    responseData: null,
    previousRating: null,
    dialogShown: false
  },
  methods: {
    getQuote() {
      this.show = false;
      if (this.responseData) {
        this.generateQuote(this.responseData);
      } else {
        fetch("https://programming-quotes-api.herokuapp.com/quotes")
          .then(res => res.json())
          .then(data => {
            this.responseData = data;
            this.generateQuote(this.responseData);
          });
      }
    },

    generateQuote(data) {
      this.index = this.calculateIndex(data);
      this.quote = data[this.index].en;
      this.author = data[this.index].author;
      this.source = data[this.index].source ? data[this.index].source : null;
      this.id = data[this.index].id;
      this.show = true;
      this.rating = null;
    },

    getSimilarQuotes(quote) {
      const options = {
        includeScore: true,
        useExtendedSearch: true,
        keys: ["en"],
        ignoreLocation: true
      };
      if (this.previousRating > 3) {
        // Getting similar quotes
        let words = quote.split(" ");
        const fuse = new Fuse(this.responseData, options);
        let searchString = words[0] + " " + words[1];
        const result = fuse.search(searchString);
        this.filterSearchResults(result);
        console.log("Words " + JSON.stringify(result));
      } else {
        this.responseData = null;
        this.getQuote();
      }
    },

    filterSearchResults(result) {
      let filteredResults = result.filter(this.isSimiliar);
      let newQuotes = [];
      filteredResults.forEach(element => {
        newQuotes.push(element.item);
      });
      this.responseData = newQuotes;
    },

    isSimiliar(value) {
      return value.score >= 0.4; // Similarity parameter, if value match is greater than 40%
    },

    calculateIndex(data) {
      let random = Math.floor(Math.random() * data.length);
      return random;
    },

    setRating(rating) {
      this.rating = rating;
      this.previousRating = rating;
      this.postRating();
    },

    postRating() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: this.id, newVote: this.rating })
      };
      fetch(
        "https://programming-quotes-api.herokuapp.com/quotes/vote",
        requestOptions
      )
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          this.dialogShown = true;
          this.getSimilarQuotes(this.responseData[this.index].en);
        })
        .catch(error => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    }
  },
  components: {
    StarRating
  }
});

quoteGenerator.getQuote();
