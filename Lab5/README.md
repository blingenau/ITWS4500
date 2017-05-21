This lab was super fun yet intensive. I learned so much about node and express that (although having previous experience)
I didn't know. Setting up the server was easy, just needed to make sure the routes were set up. I learned that
you could just make up routes to handle and you've got yourself an API there. That's how I had my client code
communicate with my server code. The server code connected to the Twitter Stream API through the npm twitter package.

The really hard part was figuring out how to send the information fro mthe twitter API in my server code back to my
client code so I could display it. I learned that using socket.io I could emit events from the server code that the
client code could listen for. This allowed me to add new tweets to my ng-repeat'ed tweet list. 