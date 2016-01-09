import requests
import json


cords = input("Do you want to input coordinates? If not, I'll use defaults. 0 or 1?")

slat = ""
slong = ""
elat = ""
elong = ""

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

selection = input("1: list products available at start point. 2: estimate price from a to b. 3: estimate time for next uber arrival at start point(in seconds) ")

url=""
parameters = {}

if (selection == 1):
	url = "https://api.uber.com/v1/products"
	parameters = {
    'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
    'latitude': slat,
    'longitude': slong,
	}
elif (selection == 2):
	url = "https://api.uber.com/v1/estimates/price"
	parameters = {
    'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
    'start_latitude': slat,
    'start_longitude': slong,
    'end_latitude': elat,
    'end_longitude': elong,
	}
elif (selection == 3):
	url = "https://api.uber.com/v1/estimates/time"
	parameters = {
    'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
    'start_latitude': slat,
    'start_longitude': slong,
	}	
else:
	print("restart and enter a valid option")
	exit(0)


response = requests.get(url, params=parameters)

data = response.json()

print(data)
exit(0)
