"""`main` is the top level module for your Flask application."""

# Import the Flask Framework
from flask import Flask
import time

import requests
from datetime import timedelta
app = Flask(__name__)
# Note: We don't need to call run() since our application is embedded within
# the App Engine WSGI application server.
def compare(pickuptime,pickupdate):

        spt = pickuptime.split(":")
        dhour = float(spt[0])
        dmin = float(spt[1])
        dtmins = (dhour*60) + (dmin)

        sdt = pickupdate.split("/")
        dmonth = float(sdt[0])
        ddate = float(sdt[1])
        dyear = float(sdt[2])
        hour = float(time.strftime('%H'))*60
        min = float(time.strftime('%M'))
        day = float(time.strftime('%d'))
        month = float(time.strftime('%m'))
        year = float(time.strftime('%y'))

        tmins = hour+min

        diff = dtmins - tmins
def gettime(cords):
    slat = ""
    slong = ""
    if cords == 1:
        print("You need at least 6 decimal places for this to be accurate")
        slat = input("start lat")
        slong = input("start long")
        elat = input("end lat")
        elong = input("end long")
    if cords == 0:
        slat = 37.775818
        slong = -122.418028
        elat = 37.791948
        elong = -122.446480
    else:
        print("restart and enter a 0 or 1")
        exit(0)
    url = "https://api.uber.com/v1/estimates/time"

    parameters = {
       'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
       'start_latitude': slat,
       'start_longitude': slong,
    }

    response = requests.get(url, params=parameters)
    data = str(response.json())
    ux = data.split("uberX")
    uxe = ux[1].split(":")
    uxef = uxe[1].split(",")
    estimate = float(uxef[0])
    print(estimate) #estimate in seconds
    return estimate

@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""

    # cords = input("Do you want to input coordinates? If not, I'll use defaults. 0 or 1?")


    estamate = gettime(0)
    diff = compare('6:50', '1/27/16')












    return diff


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500
