import cgi
import requests #need this

# from google.appengine.api import users
# from google.appengine.ext import ndb
import datastore
import webapp2
import json #need this
#WHICH OF THESE DO WE NEED AND WHICH ARE NOT NESSESARY??


#set this up at a specific uri that accepts parameters
#This accepts an auth token (when this page is accessed by uri.com?authtoken=token) represented by:
authtoken = "changeme"
#also accept the users email and password somehow (NOT PLAIN TEXT PLEASE)
user = "dyankee"
passw = "gasolina123"

r = requests.get("https://login.uber.com/oauth/v2/token?client_secret=MOlViQFGozeOuCdADPhBBay7_Jz6Ac1YfqcZpTWT&client_id=_g8Fw1o5KsrVRNBNskv2cMEMhoE6RPbW&grant_type=authorization_code&code=" + authtoken)
#removed paramenter: &redirect_uri=YOUR_REDIRECT_URI becuase I don't get how it works.

#parse the json that was returned:
print r
pjson = json.loads(r)
accesstoken = pjson['access_token'] #the real deal
refreshtoken = pjson['refresh_token'] #to refresh the access token after 30 days

#insert into database
userkey = datastore.createUser(user, passw, authtoken)

#return userkey somehow
print userkey #CHANGE THIS
