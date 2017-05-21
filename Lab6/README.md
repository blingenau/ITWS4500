This lab was pretty easy since I used Lab 5 as a platform. The hardest part
was probably converting the JSON to CSV. Luckily an npm module, json2csv, helped
a lot with this. It takes an argument, fields, that describes what each field is like.
I provided a label and the path to the value, which was necessary for the attributes
under user.
I notified the user with a notification bar at the top when the data was loaded
successfully and when the data file was overwritten on their machine.

I decided it was easier to put the CSV conversion in the backend. This is because
I found a really nice npm module that helped facilitate the conversion, called json2csv.
If I did it in the frontend I wouldn't have  been able to use this module.
Also, since the file is saved to the filesystem in the backend, it makes sense to just
do the conversion in the backend right before saving.