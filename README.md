# FanTool

## Overview

FanTool is a Fantasy Football resource helping you understand player trends to win your league. FanTool enables football fans to make more insightful and informed decisions when drafting players and selecting who to play. Statistics and data are displayed using Chart.js to better visualize team and player performance. User-friendly interface makes it easy to search for players and view the stats that matter. Users enter their league scoring settings and stats are calculated accordingly, showing a distribution of a players fantasy points.

__Scoring Settings__

><img src="/client/images/readme-ss1.png" width="500">

__All Players Totals__

><img src="/client/images/readme-ss2.png" width="500">

__Individual Player Page__

><img src="/client/images/readme-ss3.png" width="500">

## Technologies

The technologies implemented in the development of FanTool include:

* Express Framework
* PostgreSQL
* Knex.js
* Python (BeautifulSoup for scraping)
* Javascript
* Angular
* Chart.js

## Challenges

One of the biggest challenges was scraping and cleaning all the necessary data. Some HTML/CSS on the site I was scraping hid the content/data I needed (the `<table>` was commented out) so I wasn't able to target the HTML element with BeautifulSoup. I tried two methods to get by this. The first was to search through the entire html document and find all the comments using RegEx. After some research, RegEx isn't the most stable way for a task like this, it's more of a quick fix. The second method I used was to strip all the comment tags (`<-- -->`), re-encode into UTF-8, and then target the HTML element I needed.

After scraping the data I needed, there were a lot of edge cases that kept arising when migrating into PostgreSQL. Since all I wanted were the `<td>`'s, the `<th>` tags produced empty strings. Bye weeks and and players on multiple teams were also another hurdle in cleaning the data so I ended up having `Bye Week` and `Multiple Teams` records in my `teams table`.
