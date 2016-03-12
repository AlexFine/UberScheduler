
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


datastores = UserRideDataBase()

def compareApi(pickuptime, pickupdate):

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

        tmins = hour + min                  #

        diff = dtmins - tmins
        return diff
def getTimeApi(self, request):
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
            return uber_api.timeMin(min=str(result.content))
        else:
            return None
