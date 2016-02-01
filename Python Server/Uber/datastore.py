import cgi
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import webapp2
class User(ndb.Model):
    """Sub model for representing a user."""
    id = ndb.IntegerProperty()
    email = ndb.StringProperty(indexed=False) #We will never need to sort by email, thus indexed=false
    passwd = ndb.StringProperty(indexed=False)

pickupLocation = [34.07636433,-118.4290661]
dropLocation = [34.07636433,-118.4290661]

sslat = pickupLocation[0]
sslong = pickupLocation[1]
eelat = dropLocation[0]
eelong = dropLocation[1]

class Ride(ndb.Model):
    """A main model for representing a Ride."""
    uid = ndb.StructuredProperty(User)
    slong = ndb.FloatProperty(indexed=False)
    slat = ndb.FloatProperty(indexed=False)
    elong = ndb.FloatProperty(indexed=False)
    elat = ndb.FloatProperty(indexed=False)
    time = ndb.StringProperty()
    date = ndb.StringProperty()

class UserRideDataBase(webapp2.RequestHandler):

    #INSERT INTO DATASTORE
    # user = User(id=1, email="swag@bomb.com", passwd="mcswag1n")
    # user.put();
    # ride = Ride(uid=user, slong=sslong, slat=sslat, elong=eelong, elat=eelat, time="12:00", date="012816")
    # ride_key = ride.put()
    # print ride_key



    #RETRIEVE FROM DATASTORE
    qry = Ride.query(Ride.uid.id < 5)
    print ("query",qry.kind)
    def createUser(self,id, email, passwd):
        user = User(id=id, email=email, passwd=passwd)
        user_key = user.put();
        print("userKey",user_key)
    def returnUserID(self,id):
        # d = UserID.all()
        databaseQuery = User.query().order(-User.id)
        greetings = databaseQuery.fetch(10)
        print greetings
        return greetings


    #YEAH THATS RIGHT THIS WORKS
