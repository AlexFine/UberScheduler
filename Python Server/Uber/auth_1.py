import cgi
# from flask import request#need this


#from google.appengine.api import users
#from google.appengine.ext import ndb

#import webapp2

import json #need this
import sys
sys.path.insert(0, 'lib')

from rauth import OAuth2Service



def auth_step_one():
    uber_api = OAuth2Service(
         client_id='_g8Fw1o5KsrVRNBNskv2cMEMhoE6RPbW',
         client_secret='MOlViQFGozeOuCdADPhBBay7_Jz6Ac1YfqcZpTWT',
         name='On Point',
         authorize_url='https://login.uber.com/oauth/authorize',
         access_token_url='https://login.uber.com/oauth/token',
         base_url='https://api.uber.com/v1/',
     )

    parameters = {
        'response_type': 'code',
        'redirect_uri': 'http://localhost:8080/_ah/api/uberApi/v1/authorize/steptwo',
        'scope': 'profile',
    }

    # Redirect user here to authorize your application
    login_url = uber_api.get_authorize_url(**parameters)
    return login_url
    self.redirect(login_url)
