I decided to go with pokeapi.co for my api. This gives access to a bunch of information about all the pokemon.
At first I thought I'd just display the first pokemon entry but decided to have some more fun with it.
I added a "Random Pokemon" button that will select a random pokemon ID from the original 150 and query the API for its info.
It surprisingly wasn't that hard to get the angular functionality once I knew which angular directives to use. 

I used some code from W3schools as a jumping off point for my media queries. I basically tried to emulate 
bootstrap's functionality. In my html I had classes defined for both small and medium columns so it will
automatically toggle based on the screen size.

I didn't actually find a way to use bootstrap because you can't change the class from sm to md within the media query so
as I mentioned above, I emulated some of its functionality.