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
import unicodedata

datastores = UserRideDataBase()
package = 'Hello'


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


class user(messages.Message):  # this is input and response class for user
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
    time = messages.StringField(6, required=True)
    date = messages.StringField(7, required=True)
    rid = messages.StringField(8, required=True) #ride ID

STORED_GREETINGS = GreetingCollection(items=[
    Greeting(message='hello world!'),
    Greeting(message='goodbye world!'),
])


@endpoints.api(name='uberApi', version='v1')
class UberApi(remote.Service):
    rideReturn = endpoints.ResourceContainer(
        keySearch
        # userkey
    )  # defines resources in post request

    @endpoints.method(rideReturn, Greeting,
                      path='datastore/returnRide', http_method='POST',
                      name='ride.return')  # defines url and type of request
    def returnRide(self, request):
        ride = datastores.returnRide(request.key)
        return Greeting(messages=str(ride))
        # try:
        # print datastores.returnUser(request.key)

          # returns in json format
        # except:
        # return Greeting(message="not in database")
    rideCreate = endpoints.ResourceContainer(
        Ride
        # userkey
    )  # defines resources in post request

    @endpoints.method(rideReturn, Greeting,
                      path='datastore/createRide', http_method='POST',
                      name='ride.create')  # defines url and type of request
    def createRide(self, request):
        ride = datastores.returnRide(request.key)
        return Greeting(messages=str(ride))

    # This area bellow is for user specific api functions






    userReturn = endpoints.ResourceContainer(
        # Greeting
        keySearch
    )  # defines resources in post request

    @endpoints.method(userReturn, user,
                      path='datastore/returnUser', http_method='POST',
                      name='user.return')  # defines url and type of request

    def returnUser(self, request):
        # try:
        # print datastores.returnUser(request.key)

        users = datastores.returnUser(request.key)  # pings data store api
        print user
        print "test 2"
        email = str(unicodedata.normalize('NFKD', users[0]).encode('ascii', 'ignore'))
        pswd = str(unicodedata.normalize('NFKD', users[1]).encode('ascii', 'ignore'))
        code = int(unicodedata.normalize('NFKD', users[2]).encode('ascii', 'ignore'))
        print email
        print pswd
        print code
        return user(email=email, pswd=pswd, code=code)  # returns in json format
        # except:
        # return Greeting(message="not in database")

    createUser = endpoints.ResourceContainer(
        user
        # code=messages.IntegerField(1, variant=messages.Variant.INT32),email = messages.StringField(2, required=True),pswd = messages.StringField(3, required=True))
    )

    @endpoints.method(createUser, keySearch,
                      path='datastore/usercreate', http_method='POST',
                      name='user.create')
    def userCreate(self, request):
        userkey = datastores.createUser(request.email, request.pswd,
                                        str(request.code))  # create user from requests object

        return keySearch(key=userkey)  # returns userkey to frontend


    def compare(pickuptime, pickupdate):

        spt = pickuptime.split(":")
        dhour = float(spt[0])
        dmin = float(spt[1])
        dtmins = (dhour * 60) + (dmin)

        sdt = pickupdate.split("/")
        dmonth = float(sdt[0])
        ddate = float(sdt[1])
        dyear = float(sdt[2])
        hour = float(time.strftime('%H')) * 60
        min = float(time.strftime('%M'))
        day = float(time.strftime('%d'))
        month = float(time.strftime('%m'))
        year = float(time.strftime('%y'))

        tmins = hour + min

        diff = dtmins - tmins


    ID_RESOURCE3 = endpoints.ResourceContainer(
        message_types.VoidMessage,

        slat=messages.FloatField(1, variant=messages.Variant.FLOAT),
        slong=messages.FloatField(2, variant=messages.Variant.FLOAT),

    )

    @endpoints.method(ID_RESOURCE3, timeMin,
                      path='uber/getTime', http_method='GET',
                      name='uber.getTime')
    def gettime(self, request):
        # slat = ""
        # slong = ""

        slat = request.slat
        slong = request.slong
        # elat = 37.791948
        # elong = -122.446480

        baseurl = "https://sandbox-api.uber.com/v1/estimates/time"

        parameters = {
            'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
            'start_latitude': str(slat),
            'start_longitude': str(slong),
        }

        url = baseurl + "?" + "server_token=" + parameters['server_token'] + "&start_latitude=" + parameters[
            'start_latitude'] + "&start_longitude=" + parameters['start_longitude']

        # url = "https://sandbox-api.uber.com/v1/estimates/time?server_token=ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd&start_latitude=37.775818&start_longitude=-122.418028"
        result = urlfetch.fetch(url)
        if result.status_code == 200:
            print result.content
            return timeMin(min=str(result.content))
        else:
            return None
            # data = str(response.json())
            # ux = data.split("uberX")
            # uxe = ux[1].split(":")
            # uxef = uxe[1].split(",")
            # estimate = float(uxef[0])
            # print(estimate) #estimate in seconds
            # return estimate
        # ID_RESOURCE3 = endpoints.ResourceContainer(
        #     message_types.VoidMessage,
        #
        #     slat=messages.FloatField(1, variant=messages.Variant.FLOAT),
        #     slong=messages.FloatField(2, variant=messages.Variant.FLOAT),
        #
        # )
        #
        # @endpoints.method(ID_RESOURCE3, timeMin,
        #                   path='uber/getTime', http_method='GET',
        #                   name='uber.getTime')
        # def gettime(self, request):


APPLICATION = endpoints.api_server([UberApi])