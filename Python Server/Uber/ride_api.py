"""ride_api:  it also will contain all function for get rides
in next 30 minutes"""
from datastore import UserRideDataBase
import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote
from datastore import UserRideDataBase
import time
from google.appengine.api import urlfetch
# from flask import Flask
import uber_api
from ride_api import *

datastores = UserRideDataBase()
def returnRideApi(request):
        ride = datastores.returnRide(request.key)
        print ride
        return uber_api.Ride(ukey=ride[0], slong=ride[1], slat=ride[2], elong=ride[3], elat=ride[4], time=ride[5])
def createRideApi(request):
        ride = datastores.createRide(request.ukey, request.slong, request.slat, request.elong, request.elat, request.time, request.userKey)
        print ride
        return uber_api.keySearch(key=int(ride))
def allReturnRideApi(request):
        users = datastores.returnAllRides(request.key)  # pings data store api
        return uber_api.Greeting(str(users))
