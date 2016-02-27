import cgi
import requests #need this

<<<<<<< HEAD
# from google.appengine.api import users
# from google.appengine.ext import ndb
import datastore
import webapp2
=======
#from google.appengine.api import users
#from google.appengine.ext import ndb

#import webapp2
>>>>>>> origin/master
import json #need this
#WHICH OF THESE DO WE NEED AND WHICH ARE NOT NESSESARY??


#set this up at a specific uri that accepts parameters
#This accepts an auth token (when this page is accessed by uri.com?authtoken=token) represented by:
authtoken = "gjCwpiNZO6vZ6fXE3UrDswY6yMeVbd"
#also accept the users email and password somehow (NOT PLAIN TEXT PLEASE)
user = "dyankee"
passw = "gasolina123"

#at = requests.get("https://login.uber.com/oauth/v2/authorize?response_type=code&client_id=_g8Fw1o5KsrVRNBNskv2cMEMhoE6RPbW");
pms = {'client_secret':'MOlViQFGozeOuCdADPhBBay7_Jz6Ac1YfqcZpTWT','client_id':'_g8Fw1o5KsrVRNBNskv2cMEMhoE6RPbW','grant_type':'authorization_code','code': authtoken}
hds = {'Authorization':'Token ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd'}
r = requests.post("https://login.uber.com/oauth/v2/token", params=pms, headers=hds)
#removed paramenter: &redirect_uri=YOUR_REDIRECT_URI becuase I don't get how it works.
print(r)
#parse the json that was returned:
print r
pjson = json.loads(r)
accesstoken = pjson['access_token'] #the real deal
refreshtoken = pjson['refresh_token'] #to refresh the access token after 30 days
print(accesstoken)

#userkey = datastores.createUser(user, passw, authtoken)


#return userkey somehow
print userkey #CHANGE THIS
