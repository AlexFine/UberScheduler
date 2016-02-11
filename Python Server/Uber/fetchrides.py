#run me every x minutes with a cron job

import cgi
import urllib
from time import gmtime, strftime
from google.appengine.api import users
from google.appengine.ext import ndb


import webapp2

class FetchRide(webapp2.RequestHandler):

	currenttime = strftime("%Y%m%d%H%M%S", gmtime()) #convert this to a numerical format later

	#im not very confident on what this next part does. is qry the thing used? or returnRides?
    qry = Ride.query(Ride.time < (Ride.time-(currentime+30)) #30 is arbitrary and will be changed
    print ("query",qry.kind)

    def returnRides(self,rid):
        databaseQuery = Ride.query().order(-Ride.rid) #fetch based on ride id
        greetings = databaseQuery.fetch(10)
        print greetings
        return greetings