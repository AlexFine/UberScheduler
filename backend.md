#Backend plan
</br></br>
We need a backend plan so here it is (also: Set benchmarks with advisor)
</br>
Here's one method: (no sql needed). Additionaly, personal information is only stored for a limited time.
<pre>
0. Client gathers information+payment
1. Client sends server information and payment confirmation (payment should be handled by the client)
2. Python script (reciever) creates an xml file 
	a. Content: ride + client info (location, product, account, etc)
	b. Title: time + date
3. Always running checker script scans directory every x seconds. If a file name is < x minutes from current time, the checker script creates and instance of the requester script for that ride. "The reason being we dont want a trillion instances of the requester scripts running for rides days in advance. It's probably better to just have a few running while the checker script creates them when they are needed"
4. Requester script recieves info from checker script. Requester pings uber for info on eta. Requester script keeps running.
5. At a time determined by the requester script, it requests an uber on behalf of the user to the specified location in the xml file. It sends confirmation to the client, but does not wait for a response
6. If the client is available, the user is notified
7. On confirmation of the ride, the requester script deletes the xml file and turns off. Perhaps it can add a record into a master file so we know how many rides were taken/distance traveled

I don't know what the deal is on ratings/things after the ride
</pre>
</br>
Here's another method: (does this work with google?)
<pre>
0. Each user has their own table in a database on the server. Each row is their upcoming rides. (cols are time, product, etc) When nesseary, the client can tell the server to add rows to the table.
1. Server has a daemon (cron job?) that runs around and looks for upcoming rides for all users. 
2. If the ride is soon (x minutes away), it pings uber for eta until it deems it nessesary to call the uber
3. Client is notified if possible
4. On confirmation the uber is arriving, the user is charged with the payment information stored in the database. 
</pre>