"""Hello World API implemented using Google Cloud Endpoints.

Defined here are the ProtoRPC messages needed to define Schemas for methods
as well as those methods defined in an API.
"""


import endpoints
from protorpc import messages
from protorpc import message_types
from protorpc import remote
from datastore import UserRideDataBase
datastores  = UserRideDataBase()
package = 'Hello'


class Greeting(messages.Message):
  """Greeting that stores a message."""
  message = messages.StringField(1)
class userKey(messages.Message):
  """Greeting that stores a message."""
  key = messages.StringField(2, required=True)
class userKey(messages.Message):
  """Greeting that stores a message."""
  # key = messages.StringField(2, required=True)
  code=messages.IntegerField(1, variant=messages.Variant.INT32)
  email = messages.StringField(2, required=True)
  pswd = messages.StringField(3, required=True)
class GreetingCollection(messages.Message):
  """Collection of Greetings."""
  items = messages.MessageField(Greeting, 1, repeated=True)


STORED_GREETINGS = GreetingCollection(items=[
    Greeting(message='hello world!'),
    Greeting(message='goodbye world!'),
])


@endpoints.api(name='uberApi', version='v1')
class UberApi(remote.Service):

  ID_RESOURCE2 = endpoints.ResourceContainer(
      userKey
      )
  @endpoints.method(ID_RESOURCE2, Greeting,
                    path='returnUser', http_method='POST',
                    name='user.return')
  def greetings_list(self, request):
      try:
          datastores.returnUser(request.email)
          return Greeting(message =datastores.returnUser(request.email))
      except:
          return Greeting(message="not in database")

  ID_RESOURCE = endpoints.ResourceContainer(
      message_types.VoidMessage,
      code=messages.IntegerField(1, variant=messages.Variant.INT32),email = messages.StringField(2, required=True),pswd = messages.StringField(3, required=True))


  @endpoints.method(ID_RESOURCE, Greeting,
                    path='usercreate/{code}/{email}/{pswd}', http_method='GET',
                    name='user.create')
  def greeting_get(self, request):
    userkey = datastores.createUser(request.email, request.pswd,str(request.code))
    try:
      return Greeting(message=str(userkey))
    except (IndexError, TypeError):
      raise endpoints.NotFoundException('Greeting %s not found.' %
                                        (request.code,))
  # MULTIPLY_METHOD_RESOURCE = endpoints.ResourceContainer(
  #     Greeting,
  #     times=messages.IntegerField(2, variant=messages.Variant.INT32,
  #                                 required=True))
  #
  # @endpoints.method(MULTIPLY_METHOD_RESOURCE, Greeting,
  #                   path='hellogreeting/{times}', http_method='POST',
  #                   name='greetings.multiply')
  # def greetings_multiply(self, request):
  #   return Greeting(message=request.message * request.times)


APPLICATION = endpoints.api_server([UberApi])