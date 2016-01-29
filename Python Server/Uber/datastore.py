import cgi
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import webapp2

class UserID(ndb.Model):
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
    uid = ndb.StructuredProperty(UserID)
    slong = ndb.FloatProperty(indexed=False)
    slat = ndb.FloatProperty(indexed=False)
    elong = ndb.FloatProperty(indexed=False)
    elat = ndb.FloatProperty(indexed=False)
    time = ndb.StringProperty()
    date = ndb.StringProperty()


#INSERT INTO DATASTORE
user = UserID(id=1, email="swag@bomb.com", passwd="mcswag1n")
ride = Ride(uid=user, slong=sslong, slat=sslat, elong=eelong, elat=eelat, time="12:00", date="012816")
ride_key = ride.put()
print ride_key



#RETRIEVE FROM DATASTORE
qry = Ride.query(Ride.uid.id < 5)
print ("query",qry.kind)
def createUser():
    # user = UserID(id=1, email="swag@bomb.com", passwd="mcswag1n")
    # print user
    #
    # user_key = user.put();
    # print user_key
    print "test"
def returnUserID(ids):
        q = Ride.query(Ride.uid.id < 5)
        print q
        return q.kind


#YEAH THATS RIGHT THIS WORKS