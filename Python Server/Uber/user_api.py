
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
import unicodedata
datastores = UserRideDataBase()
def returnUserApi(self, request):
        # try:
        # print datastores.returnUser(request.key)

        users = datastores.returnUser(request.key)  # pings data store api
        # print User
        print "test 2"
        email = str(unicodedata.normalize('NFKD', users[0]).encode('ascii', 'ignore')) #turns unicode to ascii
        pswd = str(unicodedata.normalize('NFKD', users[1]).encode('ascii', 'ignore'))
        code = int(unicodedata.normalize('NFKD', users[2]).encode('ascii', 'ignore'))

        return uber_api.User(email=email, pswd=pswd, code=code)  # returns in json format

def userCreateApi(self, request):
        userkey = datastores.createUser(request.email, request.pswd,
                                        str(request.code))  # create user from requests object

        return uber_api.keySearch(key=userkey)  # returns userkey to frontend