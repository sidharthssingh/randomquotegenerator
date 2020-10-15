#Random Quote Generator

This program utilizes the free quotes API (https://programming-quotes-api.herokuapp.com/quotes)
to fetch quotes. The program also has a Rating element to rate a specific quote. Based on the rating
the user provides, i.e. if user liked the quote(rating 4 or 5), it fetches similar quotes else it
fetches random quote. It uses Vue-Material for design.

---

###Implementation

1. Fetches a random quote on page load
2. Displays the fetched quote with author and the source of the quote
3. Star Rating component allows you to rate the same quote and POST back to the API. On successful rating submit, A snackbar shows a success message.
4. If the user likes the quote(rating 4 or 5), finds similar quotes using FuseJS.io
5. If the user dislikes the quote (rating 3 or below), finds random quotes.
6. User can get a new quote by clicking on Get a quote
7. Show liked quotes: Shows the quotes the user rated 4 or 5 (with similarity score > 35%)
8. UI uses material design using Vue-Material library.

---

###Similarity approach

1. Used FuseJS.io to find similar quotes.
2. Fuse.js is a powerful, lightweight fuzzy-search library, with zero dependencies.
3. With Fuse.js, there is no need to setup a dedicated backend just to handle search.
4. Uses Fuzzy searching (more formally known as approximate string matching), which is the technique of finding strings that are approximately equal to a given pattern.
5. Can be used for searching string arrays, object arrays, nested search, weighted search, extended search.
6. We have used Object Array Search for our implementation.
7. Scoring Theory: The library also provides a score (of how much the string matches to original string) utilizing three variables: Fuzziness score, Key weight,Field-length norm.
8. The Fuzziness score parameter uses Bitap Algorithm (https://en.wikipedia.org/wiki/Bitap_algorithm) for approx string matching.
9. Currently uses first two words of a quote to find similarity.

---

###Additional implementation

- Show Liked Quotes ( rating 4 or 5)
- Displaying source and author of the code
- Material Design using Vue-Material

---

###Future Scope

- Improve similarity algorithm, to use most relevant words to find similar quotes.
- Increased Data Set, to build a system of smart suggestions.
- Use weighted matching, to create relevant matching.
- Add a view for disliked quotes or a combined view for all quotes.
- Option to share quote to Social Media channels: Instagram, twitter etc.

---

###Access
You can access the deployed project at: https://briq-assignment-sidharth.herokuapp.com/

---

###How to run locally

1. Clone repo to your system or use git clone https://github.com/sidharthssingh/randomquotegenerator.git
2. Traverse to the directory path
3. Once inside the repo, open terminal.
4. Type **npm install** (Must have npm installed already)----This installs the node packages and dependencies
5. Then type **npm run dev** in the terminal.----This starts the program locally at port 8080.
6. Open browser and navigate to https://localhost:8080
