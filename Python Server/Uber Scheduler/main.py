#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
def getTime():
	slat = 37.775818
	slong = -122.418028
	elat = 37.791948
	elong = -122.446480

	url = "https://api.uber.com/v1/estimates/time"
	parameters = {
		'server_token': 'ikGvlAJSejPSY6bUp7APhxkwyu5ermguZnreUaCd',
    	'start_latitude': slat,
    	'start_longitude': slong,
	}


	response = requests.get(url, params=parameters)

	data = response.json()

	return data


class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.send_response(200)
		self.send_header("Content-type:","application/json")
		self.send_header("Access-Control-Allow-Origin","*")
		self.end_headers()
		self.wfile.write(getTime())


app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
