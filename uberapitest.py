import requests
import json

cords = input("Do you want to input coordinates? If not, I'll use defaults. y or n?")

slat = ""
slong = ""
elat = ""
elong = ""

if cords == y:
	slat = input("start lat")
	slong = input("start long")
	elat = input("end lat")
	elong = input("end long")
if cords == n:
	slat = 37.775818
	slong = -122.418028
	elat = 37.791948
	elong = -122.446480


selection = input("1: list products in your area. 2: estimate price.  ")

url=""
parameters = {}

if (selection == 1):
	url = "https://api.uber.com/v1/products"
	parameters = {
    'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
    'latitude': slat,
    'longitude': slong,
	}
if (selection == 2):
	url = "https://api.uber.com/v1/estimates/price"
	parameters = {
    'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
    'start_latitude': slat,
    'start_longitude': slong,
    'end_latitude': elat,
    'end_longitude': elong,
	}



response = requests.get(url, params=parameters)

data = response.json()

print(data)
exit = input("press a key to exit")
