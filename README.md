# La Carte API

# La Carte

The Healthy-Meal-Alternative App for the Busy Professional.
       (We didn't say workaholic, you did.)

## [La Carte](https://la-carte.lfuen.vercel.app/)


<p>La Carte is a healthy meal-ordering app, catered figuratively and quite *literally* to the ever-working individual.</p>
<img align="center" src="https://lfuen.github.io/laCarte/images/readme/welcome.png" />


<img align="center" src="https://lfuen.github.io/laCarte/images/readme/choices.png" />
<p>You can browse meals from different areas of the world and even choose which chef you would like to personalize your meal!</p>
<img align="center" src="https://lfuen.github.io/laCarte/images/readme/ingredients.png" />

<p>The Orders page will keep track of your past orders and even let you update an order that's already been placed.</p> 
<img align="center" src="https://lfuen.github.io/laCarte/images/readme/orders.png" />




<br/>
<p>This is the server side of the application which uses Node and Express to build the API. For the database setup I am using PostgreSQL and Knex to make queries.
 I have incorporated full testing for all of the endpoints in a separate test folder.</p>
<br/>
<p>This is the back end of a fullstack app, using Heroku for server hosting and Vercel for client hosting.</p>
<br/>
<br/>
<p>For API calls, the main endpoint is '/api'.</p>
<br/>
<ul>
<li>/meals - Will allow you to GET all meals from the DB</li>
<li>/meals/:id - Will allow you to GET a meals by ID from the DB</li>
<li>/chefs - Will allow you to GET all chefs from the DB</li>
<li>/chefs/:id/ - Will allow you to GET a chef by ID from the DB</li>
<li>/cuisines - Will allow you to GET all cuisines from the DB</li>
<li>/cuisines/:id - Will allow you to GET a cuisine by ID from the DB</li>
<li>/orders - Will allow you to GET all orders from the DB</li>
<li>/orders/:id - Will allow you to GET, PATCH, POST, and DELETE an order by ID from the DB</li>
<li>/users & /users/:id endpoints are not implemented in the current running client side, rather, set in place for future use.</li>
</ul>


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).