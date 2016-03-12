"""Hello World API implemented using Google Cloud Endpoints.

Defined here are the ProtoRPC messages needed to define Schemas for methods
as well as those methods defined in an API.
"""

import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote
from datastore import UserRideDataBase
import time
from google.appengine.api import urlfetch
# from flask import Flask
"""These area is for files with the api methods"""
from ride_api import *
from user_api import *
from time_api import *


# import unicodedata
from auth_1 import auth_step_one
from auth_2 import auth_step_two

datastores = UserRideDataBase()
package = 'Hello'

"""These are classes for the inputs and returns  for post and get requests"""
class Greeting(messages.Message):
    """Greeting that stores a message."""
    message = messages.StringField(1)


class keySearch(messages.Message):  # this class is for the key search used by return functions to search by
    # from email to something better

    """Greeting that stores a message."""
    key = messages.IntegerField(1, variant=messages.Variant.INT32)


class timeMin(messages.Message):
    # min = messages.IntegerField(1, variant=messages.Variant.INT32)
    min = messages.StringField(1)


class User(messages.Message):  # this is input and response class for user
    """Greeting that stores a message."""
    # key = messages.StringField(2, required=True)
    code = messages.IntegerField(1, variant=messages.Variant.INT32)
    email = messages.StringField(2, required=True)
    pswd = messages.StringField(3, required=True)


class GreetingCollection(messages.Message):
    """Collection of Greetings."""
    items = messages.MessageField(Greeting, 1, repeated=True)

class Ride(messages.Message):
    """A main model for representing a Ride."""
    ukey = messages.IntegerField(1, required=True, variant=messages.Variant.INT32)
    slong = messages.FloatField(2, required=True)
    slat = messages.FloatField(3, required=True)
    elong = messages.FloatField(4, required=True)
    elat = messages.FloatField(5, required=True)
    time = messages.IntegerField(6, required=True)
    userKey = messages.IntegerField(7, variant=messages.Variant.INT32)
    # rid = messages.StringField(8, required=True) #ride ID

STORED_GREETINGS = GreetingCollection(items=[
    Greeting(message='hello world!'),
    Greeting(message='goodbye world!'),
])


@endpoints.api(name='uberApi', version='v1')
class UberApi(remote.Service):

    """these are the resource containers"""
    userReturn = endpoints.ResourceContainer( keySearch)
    rideReturn = endpoints.ResourceContainer(keySearch) #these are different resourse containers for the post requests
    rideCreate = endpoints.ResourceContainer(Ride)
    createUser = endpoints.ResourceContainer(User)
    noInput= endpoints.ResourceContainer(message_types.VoidMessage)#this one is for ones with no input
    timeGet = endpoints.ResourceContainer(
        message_types.VoidMessage,

        slat=messages.FloatField(1, variant=messages.Variant.FLOAT),
        slong=messages.FloatField(2, variant=messages.Variant.FLOAT),

    )
    """This is the rides area"""
    @endpoints.method(rideReturn, Ride,
                      path='datastore/returnRide', http_method='POST',
                      name='ride.return')  # defines url and type of request
    def returnRide(self, request):
        return returnRideApi(request)

    @endpoints.method(rideCreate, keySearch, path='datastore/createRide', http_method='POST', name='ride.create')  # defines url and type of request
    def createRide(self, request):
        return createRideApi(request)
    @endpoints.method(userReturn, Greeting,
                        path='datastore/allReturnRide', http_method='POST',
                      name='rides.returnAll')  # defines url and type of request

    def allReturnRide(self, request):
          return allReturnRideApi(request)

    """This is the end of the rides area
    Start of auth area"""
    @endpoints.method(noInput, Greeting, path='authorize/stepone', http_method='GET', name='auth.one')
    def redirectUrl(self, request):
        reurl = auth_step_one()
        return Greeting(message=reurl)
        self.redirect(reurl)

    @endpoints.method(noInput, Greeting,path='authorize/steptwo', http_method='GET', name='auth.two')
    def returnToken(self, request):
        realtoken = auth_step_two(uniquet)
        return Greeting(message=realtoken)
        #use createUser to make a new user

    """End of Auth start of User area"""

    @endpoints.method(userReturn, User,
                      path='datastore/returnUser', http_method='POST',
                      name='user.return')
    def returnUser(self, request):
        return returnUserApi(request)
        # except:
        # return Greeting(message="not in database")



    @endpoints.method(createUser, keySearch,
                      path='datastore/usercreate', http_method='POST',
                      name='user.create')
    def userCreate(self, request):
        return userCreateApi(request)
    """time Api area"""
    @endpoints.method(timeGet, timeMin,
                      path='uber/getTime', http_method='GET',
                      name='uber.getTime')
    def gettime(self, request):
        return getTimeApi(request)

APPLICATION = endpoints.api_server([UberApi])
