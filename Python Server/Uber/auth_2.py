import cgi
import requests
#from rauth import OAuth2Service
from flask import Flask
from flask import request
app = Flask(__name__)

# Once your user has signed in using the previous step you should redirect
# them here
with app.test_request_context():

    parameters = {
        'redirect_uri': 'http://localhost',
        #'code': request.args.get('code'),
        'code': 'i7q6Yfx6FjKy53f23v5P2mopue4zkg',
        'grant_type': 'authorization_code',
    }

    response = requests.post(
        'https://login.uber.com/oauth/token',
        auth=(
            '_g8Fw1o5KsrVRNBNskv2cMEMhoE6RPbW',
            'MOlViQFGozeOuCdADPhBBay7_Jz6Ac1YfqcZpTWT',
        ),
        data=parameters,
    )
    print response
    # This access_token is what we'll use to make requests in the following
    # steps
    access_token = response.json().get('access_token')
