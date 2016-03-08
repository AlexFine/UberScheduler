import cgi
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import webapp2
class User(ndb.Model):
    """Sub model for representing a user."""
    # id = ndb.IntegerProperty()
    email = ndb.StringProperty(indexed=True) #We will never need to sort by email, thus indexed=false
    passwd = ndb.StringProperty(indexed=False)

    uberauth = ndb.StringProperty(indexed=False)

#Not relavent:
pickupLocation = [34.07636433,-118.4290661]
dropLocation = [34.07636433,-118.4290661]

sslat = pickupLocation[0]
sslong = pickupLocation[1]
eelat = dropLocation[0]
eelong = dropLocation[1]

class Ride(ndb.Model):
    """A main model for representing a Ride."""
    ukey = ndb.IntegerProperty(indexed=False)
    slong = ndb.FloatProperty(indexed=False)
    slat = ndb.FloatProperty(indexed=False)
    elong = ndb.FloatProperty(indexed=False)
    elat = ndb.FloatProperty(indexed=False)
    time = ndb.StringProperty()
    @classmethod
    def query_book(cls, ancestor_key):
        return cls.query(ancestor=ancestor_key).order(-cls.date)

     #ride ID

class UserRideDataBase(webapp2.RequestHandler):

    #INSERT INTO DATASTORE
    # user = User(id=1, email="swag@bomb.com", passwd="mcswag1n")
    # user.put();
    # ride = Ride(uid=user, slong=sslong, slat=sslat, elong=eelong, elat=eelat, time="12:00", date="012816")
    # ride_key = ride.put()
    # print ride_key



    #RETRIEVE FROM DATASTORE
    # qry = Ride.query(Ride.uid.id < 5)
    # print ("query",qry.kind)

    def createUser(self, email, passwd, ua):
        user = User(email=email, passwd=passwd, uberauth=ua) #creates user object
        user_key = user.put(); #add to datastore
        print("userKey",user_key)
        return user_key.id()

    def createRide(self, ukey, slong, slat, elong, elat, time):
        ride = Ride(ukey=ukey, slong=slong, slat=slat, elong=elong, elat=elat, time=time)
        ride_key = ride.put();
        print("rideKey",ride_key.id())
        return ride_key.id()
    def returnRide(self, userId):
        # d = UserID.all()
        key= ndb.Key("User", userId)
        greetings = key.get()
        print greetings
        x = [greetings.ukey, greetings.slong, greetings.slat, greetings.elong, greetings.elat, greetings.time]

        return x

    def returnAllRides(self, userId):
        # d = UserID.all()
        key= ndb.Key("Ride", userId)  #
        greetings = Ride.query_book(key).fetch(20)


        print greetings
        x = [greetings.ukey, greetings.slong, greetings.slat, greetings.elong, greetings.elat, greetings.time]

        return x

    def returnUser(self,keys):
        # d = UserID.all()
        key= ndb.Key("User", keys)
        greetings = key.get()
        print greetings

        x =[greetings.email, greetings.passwd, greetings.uberauth] #formats it correctly
        print x
        return x
