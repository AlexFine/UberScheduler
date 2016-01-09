import requests
import json
import time

def gettime():
	cords = input("Do you want to input coordinates? If not, I'll use defaults. 0 or 1?")

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


pickuptime = raw_input("Input the time you want to get on in 24 hour format. No need for seconds. Example: '09:30'")
pickupdate = raw_input("Input the date you want to get on in m/d/y. Example: '01/08/16'")

spt = pickuptime.split(":")
dhour = float(spt[0])
dmin = float(spt[1])
dtmins = (dhour*60) + (dmin)

sdt = pickupdate.split("/")
dmonth = float(sdt[0])
ddate = float(sdt[1])
dyear = float(sdt[2])

def compare():
	hour = float(time.strftime('%H'))*60
	min = float(time.strftime('%M'))
	day = float(time.strftime('%d'))
	month = float(time.strftime('%m'))
	year = float(time.strftime('%y'))

	tmins = hour+min

	diff = dtmins - tmins


print(diff)
