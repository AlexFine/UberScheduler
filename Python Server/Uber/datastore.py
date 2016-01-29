import cgi
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb

import webapp2

class UserID(ndb.Model):
    """Sub model for representing an author."""
    id = ndb.IntegerProperty()
    email = ndb.StringProperty(indexed=False) #We will never need to sort by email, thus indexed=false
    passwd = ndb.StringProperty(indexed=False)

pickupLocation = [34.07636433,-118.4290661]
dropLocation = [34.07636433,-118.4290661]

slat = pickupLocation[0]
slong = pickupLocation[1]
elat = dropLocation[0]
elong = dropLocation[1]

class Ride(ndb.Model):
    """A main model for representing an individual Guestbook entry."""
    uid = ndb.StructuredProperty(UserID)
    slong = ndb.StringProperty(indexed=False)
    slat = ndb.StringProperty(indexed=False)
    elong = ndb.StringProperty(indexed=False)
    elat = ndb.StringProperty(indexed=False)
    time = ndb.StringProperty()

    date = ndb.DateTimeProperty(auto_now_add=True)


def createUser():
    user = UserID(id=1, email="swag@bomb.com", passwd="mcswag1n")
    print user

    user_key = user.put();

def returnUserID(ids):
        q =UserID.get_by_id(1)
        print q
        return q


#YEAH THATS RIGHT THIS WORKS