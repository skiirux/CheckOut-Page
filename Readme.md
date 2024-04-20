#So In this project We had a API and we need to make the checkout page and all the contents in the #Page are coming from the API and make the checkout page accordingly.

So, coming to script.js file 
Since the image link in the API is giving 404 Error.
we first fetch the API and if the response is ok we await for the response.
Now, According to the figma design I called all the option which is required for the checkout page.

so we have used inbuit js to calculate the percentage from the actual price and the discounted price

So, In this API was not working so I have added the static images so if in case API works It will dynamically add the API images Links otherwise use the static images

CHeck if image URL is working or not and on that condition Static images are used

Color Selector Option we basically fetch the color options from the API Styled using CSS but It was coming in RGB format we need the color in string so i have created a map color function and according to that selected color gets return in string.

Size Selector We have fetched the size from the api and create one label with radio button and appended it into the container.

Quantity Selector added a decreasing and increasing quantity button and a input text so added a function on clicking + will increase the count and - will decrease the count.

Add to cart Functionality 
1> i have made a check that before adding to cart you must select the color and the size before proceeding further and if all the options are sleected you can proceed further.

For saving the selected variant we use the localstorage.setItem to store the selected variant.

Two function i Have used 
1> Clear Cart Container : means whenever you change color or quantity or size cart preview should be cleared from the UI
2>Clear Selection message : In this whenever you select all the option it will be clearfed from the UI

Also added media queries for small Screens.
