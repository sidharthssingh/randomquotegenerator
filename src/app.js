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
    dialogShown: false,
    ratedQuotes: [],
    position: "center",
    duration: 2000,
    showRatedQuotes: false,
    ratedQuotesBtnTxt: "Show Liked Quotes"
  },
  methods: {
    getQuote() {
      this.show = false;
      const fetchUrl = "https://programming-quotes-api.herokuapp.com/quotes";
      if (this.responseData && this.responseData.length > 5) {
        this.generateQuote(this.responseData);
      } else {
        fetch(fetchUrl)
          .then(res => res.json())
          .then(data => {
            this.responseData = data;
            this.generateQuote(this.responseData);
          });
      }
    },
    showQuotes() {
      this.showRatedQuotes = !this.showRatedQuotes;
      this.changeRatedQuotesBtnTxt();
    },

    changeRatedQuotesBtnTxt() {
      this.showRatedQuotes
        ? (this.ratedQuotesBtnTxt = "Hide Liked Quotes")
        : (this.ratedQuotesBtnTxt = "Show Liked Quotes");
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
        let searchString = words[0] + words[1];
        const result = fuse.search(searchString);
        this.filterSearchResults(result);
        console.log("Words " + JSON.stringify(result));
      } else {
        this.responseData = null;
      }
      this.getQuote();
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
      return value.score >= 0.35; // Similarity parameter, if value match is greater than 35%
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
      const postUrl =
        "https://programming-quotes-api.herokuapp.com/quotes/vote";
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: this.id, newVote: this.rating })
      };
      fetch(postUrl, requestOptions)
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          this.dialogShown = true;
          if (this.rating > 3) this.ratedQuotes.push(this.quote);
          this.getSimilarQuotes(this.quote);
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
