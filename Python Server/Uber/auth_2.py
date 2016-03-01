import cgi
import requests
#from rauth import OAuth2Service
from flask import request, url_f

# Once your user has signed in using the previous step you should redirect
# them here
def go():
    parameters = {
        'redirect_uri': 'INSERT_ROUTE_TO_STEP_TWO',
        'code': request.args.get('code'),
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

    # This access_token is what we'll use to make requests in the following
    # steps
    access_token = response.json().get('access_token')
