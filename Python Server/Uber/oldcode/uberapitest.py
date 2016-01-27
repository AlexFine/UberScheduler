#!/usr/bin/python

#print "Content-type: text/html\n\n"
#print "Access-Control-Allow-Origin: *"
#NOT WORKING RIGHT NOW

import requests
import json
#import cgi
import cgitb; cgitb.enable()
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer

PORT_NUMBER = 8080

def getTime():
	slat = 37.775818
	slong = -122.418028
	elat = 37.791948
	elong = -122.446480

	url = "https://sandbox-api.uber.com/v1/estimates/time"
	parameters = {
	'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
    	'start_latitude': slat,
    	'start_longitude': slong,
	}	


	response = requests.get(url, params=parameters)

	data = response.json()
	print("Request Recieved")
	print(data)
	return data

class myHandler(BaseHTTPRequestHandler):
	def do_GET(self):
		self.send_response(200)
		self.send_header("Content-type:","application/json")
		self.send_header("Access-Control-Allow-Origin","*")
		self.end_headers()
		self.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
		self.wfile.write(getTime())
		return

try:
	#Create a web server and define the handler to manage the
	#incoming request
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print 'I Started httpserver on port ' , PORT_NUMBER
	print server	
	#Wait forever for incoming htto requests
	server.serve_forever()

except KeyboardInterrupt:
	print '^C received, shutting down the web server'
	server.socket.close()
