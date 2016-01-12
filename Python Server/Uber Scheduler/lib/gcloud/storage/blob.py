# Copyright 2014 Google Inc. All rights reserved.
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

"""Create / interact with Google Cloud Storage blobs."""

import copy
import datetime
from io import BytesIO
import json
import mimetypes
import os
import time

import six
from six.moves.urllib.parse import quote  # pylint: disable=F0401

from apitools.base.py import http_wrapper
from apitools.base.py import transfer

from gcloud._helpers import _RFC3339_MICROS
from gcloud._helpers import UTC
from gcloud.credentials import generate_signed_url
from gcloud.exceptions import NotFound
from gcloud.storage._helpers import _PropertyMixin
from gcloud.storage._helpers import _scalar_property
from gcloud.storage.acl import ObjectACL


_API_ACCESS_ENDPOINT = 'https://storage.googleapis.com'


class Blob(_PropertyMixin):
    """A wrapper around Cloud Storage's concept of an ``Object``.

    :type name: string
    :param name: The name of the blob.  This corresponds to the
                 unique path of the object in the bucket.

    :type bucket: :class:`gcloud.storage.bucket.Bucket`
    :param bucket: The bucket to which this blob belongs.

    :type chunk_size: integer
    :param chunk_size: The size of a chunk of data whenever iterating (1 MB).
                       This must be a multiple of 256 KB per the API
                       specification.
    """

    _chunk_size = None  # Default value for each instance.

    _CHUNK_SIZE_MULTIPLE = 256 * 1024
    """Number (256 KB, in bytes) that must divide the chunk size."""

    def __init__(self, name, bucket, chunk_size=None):
        super(Blob, self).__init__(name=name)

        self.chunk_size = chunk_size  # Check that setter accepts value.
        self.bucket = bucket
        self._acl = ObjectACL(self)

    @property
    def chunk_size(self):
        """Get the blob's default chunk size.

        :rtype: integer or ``NoneType``
        :returns: The current blob's chunk size, if it is set.
        """
        return self._chunk_size

    @chunk_size.setter
    def chunk_size(self, value):
        """Set the blob's default chunk size.

        :type value: integer or ``NoneType``
        :param value: The current blob's chunk size, if it is set.

        :raises: :class:`ValueError` if ``value`` is not ``None`` and is not a
                 multiple of 256 KB.
        """
        if value is not None and value % self._CHUNK_SIZE_MULTIPLE != 0:
            raise ValueError('Chunk size must be a multiple of %d.' % (
                self._CHUNK_SIZE_MULTIPLE,))
        self._chunk_size = value

    @staticmethod
    def path_helper(bucket_path, blob_name):
        """Relative URL path for a blob.

        :type bucket_path: string
        :param bucket_path: The URL path for a bucket.

        :type blob_name: string
        :param blob_name: The name of the blob.

        :rtype: string
        :returns: The relative URL path for ``blob_name``.
        """
        return bucket_path + '/o/' + quote(blob_name, safe='')

    @property
    def acl(self):
        """Create our ACL on demand."""
        return self._acl

    def __repr__(self):
        if self.bucket:
            bucket_name = self.bucket.name
        else:
            bucket_name = None

        return '<Blob: %s, %s>' % (bucket_name, self.name)

    @property
    def path(self):
        """Getter property for the URL path to this Blob.

        :rtype: string
        :returns: The URL path to this Blob.
        """
        if not self.name:
            raise ValueError('Cannot determine path without a blob name.')

        return self.path_helper(self.bucket.path, self.name)

    @property
    def client(self):
        """The client bound to this blob."""
        return self.bucket.client

    @property
    def public_url(self):
        """The public URL for this blob's object.

        :rtype: `string`
        :returns: The public URL for this blob.
        """
        return '{storage_base_url}/{bucket_name}/{quoted_name}'.format(
            storage_base_url='https://storage.googleapis.com',
            bucket_name=self.bucket.name,
            quoted_name=quote(self.name, safe=''))

    def generate_signed_url(self, expiration, method='GET',
                            client=None, credentials=None):
        """Generates a signed URL for this blob.

        .. note::
          If you are on Google Compute Engine, you can't generate a signed URL.
          Follow
          https://github.com/GoogleCloudPlatform/gcloud-python/issues/922
          for updates on this. If you'd like to be able to generate a signed
          URL from GCE, you can use a standard service account from a JSON
          file rather than a GCE service account.

        If you have a blob that you want to allow access to for a set
        amount of time, you can use this method to generate a URL that
        is only valid within a certain time period.

        This is particularly useful if you don't want publicly
        accessible blobs, but don't want to require users to explicitly
        log in.

        :type expiration: int, long, datetime.datetime, datetime.timedelta
        :param expiration: When the signed URL should expire.

        :type method: string
        :param method: The HTTP verb that will be used when requesting the URL.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.

        :type credentials: :class:`oauth2client.client.OAuth2Credentials` or
                           :class:`NoneType`
        :param credentials: The OAuth2 credentials to use to sign the URL.

        :rtype: string
        :returns: A signed URL you can use to access the resource
                  until expiration.
        """
        resource = '/{bucket_name}/{quoted_name}'.format(
            bucket_name=self.bucket.name,
            quoted_name=quote(self.name, safe=''))

        if credentials is None:
            client = self._require_client(client)
            credentials = client._connection.credentials

        return generate_signed_url(
            credentials, resource=resource,
            api_access_endpoint=_API_ACCESS_ENDPOINT,
            expiration=expiration, method=method)

    def exists(self, client=None):
        """Determines whether or not this blob exists.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.

        :rtype: boolean
        :returns: True if the blob exists in Cloud Storage.
        """
        client = self._require_client(client)
        try:
            # We only need the status code (200 or not) so we seek to
            # minimize the returned payload.
            query_params = {'fields': 'name'}
            # We intentionally pass `_target_object=None` since fields=name
            # would limit the local properties.
            client.connection.api_request(method='GET', path=self.path,
                                          query_params=query_params,
                                          _target_object=None)
            # NOTE: This will not fail immediately in a batch. However, when
            #       Batch.finish() is called, the resulting `NotFound` will be
            #       raised.
            return True
        except NotFound:
            return False

    def delete(self, client=None):
        """Deletes a blob from Cloud Storage.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.

        :rtype: :class:`Blob`
        :returns: The blob that was just deleted.
        :raises: :class:`gcloud.exceptions.NotFound`
                 (propagated from
                 :meth:`gcloud.storage.bucket.Bucket.delete_blob`).
        """
        return self.bucket.delete_blob(self.name, client=client)

    def download_to_file(self, file_obj, client=None):
        """Download the contents of this blob into a file-like object.

        :type file_obj: file
        :param file_obj: A file handle to which to write the blob's data.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.

        :raises: :class:`gcloud.exceptions.NotFound`
        """
        client = self._require_client(client)
        download_url = self.media_link

        # Use apitools 'Download' facility.
        download = transfer.Download.FromStream(file_obj, auto_transfer=False)
        headers = {}
        if self.chunk_size is not None:
            download.chunksize = self.chunk_size
            headers['Range'] = 'bytes=0-%d' % (self.chunk_size - 1,)
        request = http_wrapper.Request(download_url, 'GET', headers)

        # Use the private ``_connection`` rather than the public
        # ``.connection``, since the public connection may be a batch. A
        # batch wraps a client's connection, but does not store the `http`
        # object. The rest (API_BASE_URL and build_api_url) are also defined
        # on the Batch class, but we just use the wrapped connection since
        # it has all three (http, API_BASE_URL and build_api_url).
        download.InitializeDownload(request, client._connection.http)

        # Should we be passing callbacks through from caller?  We can't
        # pass them as None, because apitools wants to print to the console
        # by default.
        download.StreamInChunks(callback=lambda *args: None,
                                finish_callback=lambda *args: None)

    def download_to_filename(self, filename, client=None):
        """Download the contents of this blob into a named file.

        :type filename: string
        :param filename: A filename to be passed to ``open``.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.

        :raises: :class:`gcloud.exceptions.NotFound`
        """
        with open(filename, 'wb') as file_obj:
            self.download_to_file(file_obj, client=client)

        mtime = time.mktime(self.updated.timetuple())
        os.utime(file_obj.name, (mtime, mtime))

    def download_as_string(self, client=None):
        """Download the contents of this blob as a string.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.

        :rtype: bytes
        :returns: The data stored in this blob.
        :raises: :class:`gcloud.exceptions.NotFound`
        """
        string_buffer = BytesIO()
        self.download_to_file(string_buffer, client=client)
        return string_buffer.getvalue()

    def upload_from_file(self, file_obj, rewind=False, size=None,
                         content_type=None, num_retries=6, client=None):
        """Upload the contents of this blob from a file-like object.

        The content type of the upload will either be
        - The value passed in to the function (if any)
        - The value stored on the current blob
        - The default value of 'application/octet-stream'

        .. note::
           The effect of uploading to an existing blob depends on the
           "versioning" and "lifecycle" policies defined on the blob's
           bucket.  In the absence of those policies, upload will
           overwrite any existing contents.

           See the `object versioning
           <https://cloud.google.com/storage/docs/object-versioning>`_ and
           `lifecycle <https://cloud.google.com/storage/docs/lifecycle>`_
           API documents for details.

        :type file_obj: file
        :param file_obj: A file handle open for reading.

        :type rewind: boolean
        :param rewind: If True, seek to the beginning of the file handle before
                       writing the file to Cloud Storage.

        :type size: int
        :param size: The number of bytes to read from the file handle.
                     If not provided, we'll try to guess the size using
                     :func:`os.fstat`. (If the file handle is not from the
                     filesystem this won't be possible.)

        :type content_type: string or ``NoneType``
        :param content_type: Optional type of content being uploaded.

        :type num_retries: integer
        :param num_retries: Number of upload retries. Defaults to 6.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.

        :raises: :class:`ValueError` if size is not passed in and can not be
                 determined
        """
        client = self._require_client(client)
        # Use the private ``_connection`` rather than the public
        # ``.connection``, since the public connection may be a batch. A
        # batch wraps a client's connection, but does not store the `http`
        # object. The rest (API_BASE_URL and build_api_url) are also defined
        # on the Batch class, but we just use the wrapped connection since
        # it has all three (http, API_BASE_URL and build_api_url).
        connection = client._connection
        content_type = (content_type or self._properties.get('contentType') or
                        'application/octet-stream')

        # Rewind the file if desired.
        if rewind:
            file_obj.seek(0, os.SEEK_SET)

        # Get the basic stats about the file.
        total_bytes = size
        if total_bytes is None:
            if hasattr(file_obj, 'fileno'):
                total_bytes = os.fstat(file_obj.fileno()).st_size
            else:
                raise ValueError('total bytes could not be determined. Please '
                                 'pass an explicit size.')
        headers = {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': connection.USER_AGENT,
        }

        upload = transfer.Upload(file_obj, content_type, total_bytes,
                                 auto_transfer=False,
                                 chunksize=self.chunk_size)

        url_builder = _UrlBuilder(bucket_name=self.bucket.name,
                                  object_name=self.name)
        upload_config = _UploadConfig()

        # Temporary URL, until we know simple vs. resumable.
        base_url = connection.API_BASE_URL + '/upload'
        upload_url = connection.build_api_url(api_base_url=base_url,
                                              path=self.bucket.path + '/o')

        # Use apitools 'Upload' facility.
        request = http_wrapper.Request(upload_url, 'POST', headers)

        upload.ConfigureRequest(upload_config, request, url_builder)
        query_params = url_builder.query_params
        base_url = connection.API_BASE_URL + '/upload'
        request.url = connection.build_api_url(api_base_url=base_url,
                                               path=self.bucket.path + '/o',
                                               query_params=query_params)
        upload.InitializeUpload(request, connection.http)

        # Should we be passing callbacks through from caller?  We can't
        # pass them as None, because apitools wants to print to the console
        # by default.
        if upload.strategy == transfer.RESUMABLE_UPLOAD:
            http_response = upload.StreamInChunks(
                callback=lambda *args: None,
                finish_callback=lambda *args: None)
        else:
            http_response = http_wrapper.MakeRequest(connection.http, request,
                                                     retries=num_retries)
        response_content = http_response.content
        if not isinstance(response_content,
                          six.string_types):  # pragma: NO COVER  Python3
            response_content = response_content.decode('utf-8')
        self._set_properties(json.loads(response_content))

    def upload_from_filename(self, filename, content_type=None,
                             client=None):
        """Upload this blob's contents from the content of a named file.

        The content type of the upload will either be
        - The value passed in to the function (if any)
        - The value stored on the current blob
        - The value given by mimetypes.guess_type

        .. note::
           The effect of uploading to an existing blob depends on the
           "versioning" and "lifecycle" policies defined on the blob's
           bucket.  In the absence of those policies, upload will
           overwrite any existing contents.

           See the `object versioning
           <https://cloud.google.com/storage/docs/object-versioning>`_ and
           `lifecycle <https://cloud.google.com/storage/docs/lifecycle>`_
           API documents for details.

        :type filename: string
        :param filename: The path to the file.

        :type content_type: string or ``NoneType``
        :param content_type: Optional type of content being uploaded.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.
        """
        content_type = content_type or self._properties.get('contentType')
        if content_type is None:
            content_type, _ = mimetypes.guess_type(filename)

        with open(filename, 'rb') as file_obj:
            self.upload_from_file(file_obj, content_type=content_type,
                                  client=client)

    def upload_from_string(self, data, content_type='text/plain',
                           client=None):
        """Upload contents of this blob from the provided string.

        .. note::
           The effect of uploading to an existing blob depends on the
           "versioning" and "lifecycle" policies defined on the blob's
           bucket.  In the absence of those policies, upload will
           overwrite any existing contents.

           See the `object versioning
           <https://cloud.google.com/storage/docs/object-versioning>`_ and
           `lifecycle <https://cloud.google.com/storage/docs/lifecycle>`_
           API documents for details.

        :type data: bytes or text
        :param data: The data to store in this blob.  If the value is
                     text, it will be encoded as UTF-8.

        :type content_type: string
        :param content_type: Optional type of content being uploaded. Defaults
                             to ``'text/plain'``.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.
        """
        if isinstance(data, six.text_type):
            data = data.encode('utf-8')
        string_buffer = BytesIO()
        string_buffer.write(data)
        self.upload_from_file(file_obj=string_buffer, rewind=True,
                              size=len(data), content_type=content_type,
                              client=client)

    def make_public(self, client=None):
        """Make this blob public giving all users read access.

        :type client: :class:`gcloud.storage.client.Client` or ``NoneType``
        :param client: Optional. The client to use.  If not passed, falls back
                       to the ``client`` stored on the blob's bucket.
        """
        self.acl.all().grant_read()
        self.acl.save(client=client)

    cache_control = _scalar_property('cacheControl')
    """HTTP 'Cache-Control' header for this object.

    See: https://tools.ietf.org/html/rfc7234#section-5.2 and
         https://cloud.google.com/storage/docs/json_api/v1/objects

    If the property is not set locally, returns ``None``.

    :rtype: string or ``NoneType``
    """

    content_disposition = _scalar_property('contentDisposition')
    """HTTP 'Content-Disposition' header for this object.

    See: https://tools.ietf.org/html/rfc6266 and
         https://cloud.google.com/storage/docs/json_api/v1/objects

    If the property is not set locally, returns ``None``.

    :rtype: string or ``NoneType``
    """

    content_encoding = _scalar_property('contentEncoding')
    """HTTP 'Content-Encoding' header for this object.

    See: https://tools.ietf.org/html/rfc7231#section-3.1.2.2 and
         https://cloud.google.com/storage/docs/json_api/v1/objects

    If the property is not set locally, returns ``None``.

    :rtype: string or ``NoneType``
    """

    content_language = _scalar_property('contentLanguage')
    """HTTP 'Content-Language' header for this object.

    See: http://tools.ietf.org/html/bcp47 and
         https://cloud.google.com/storage/docs/json_api/v1/objects

    If the property is not set locally, returns ``None``.

    :rtype: string or ``NoneType``
    """

    content_type = _scalar_property('contentType')
    """HTTP 'Content-Type' header for this object.

    See: https://tools.ietf.org/html/rfc2616#section-14.17 and
         https://cloud.google.com/storage/docs/json_api/v1/objects

    If the property is not set locally, returns ``None``.

    :rtype: string or ``NoneType``
    """

    crc32c = _scalar_property('crc32c')
    """CRC32C checksum for this object.

    See: http://tools.ietf.org/html/rfc4960#appendix-B and
         https://cloud.google.com/storage/docs/json_api/v1/objects

    If the property is not set locally, returns ``None``.

    :rtype: string or ``NoneType``
    """

    @property
    def component_count(self):
        """Number of underlying components that make up this object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: integer or ``NoneType``
        :returns: The component count (in case of a composed object) or
                  ``None`` if the property is not set locally. This property
                  will not be set on objects not created via ``compose``.
        """
        component_count = self._properties.get('componentCount')
        if component_count is not None:
            return int(component_count)

    @property
    def etag(self):
        """Retrieve the ETag for the object.

        See: http://tools.ietf.org/html/rfc2616#section-3.11 and
             https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: string or ``NoneType``
        :returns: The blob etag or ``None`` if the property is not set locally.
        """
        return self._properties.get('etag')

    @property
    def generation(self):
        """Retrieve the generation for the object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: integer or ``NoneType``
        :returns: The generation of the blob or ``None`` if the property
                  is not set locally.
        """
        generation = self._properties.get('generation')
        if generation is not None:
            return int(generation)

    @property
    def id(self):
        """Retrieve the ID for the object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: string or ``NoneType``
        :returns: The ID of the blob or ``None`` if the property is not
                  set locally.
        """
        return self._properties.get('id')

    md5_hash = _scalar_property('md5Hash')
    """MD5 hash for this object.

    See: http://tools.ietf.org/html/rfc4960#appendix-B and
         https://cloud.google.com/storage/docs/json_api/v1/objects

    If the property is not set locally, returns ``None``.

    :rtype: string or ``NoneType``
    """

    @property
    def media_link(self):
        """Retrieve the media download URI for the object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: string or ``NoneType``
        :returns: The media link for the blob or ``None`` if the property is
                  not set locally.
        """
        return self._properties.get('mediaLink')

    @property
    def metadata(self):
        """Retrieve arbitrary/application specific metadata for the object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: dict or ``NoneType``
        :returns: The metadata associated with the blob or ``None`` if the
                  property is not set locally.
        """
        return copy.deepcopy(self._properties.get('metadata'))

    @metadata.setter
    def metadata(self, value):
        """Update arbitrary/application specific metadata for the object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :type value: dict or ``NoneType``
        :param value: The blob metadata to set.
        """
        self._patch_property('metadata', value)

    @property
    def metageneration(self):
        """Retrieve the metageneration for the object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: integer or ``NoneType``
        :returns: The metageneration of the blob or ``None`` if the property
                  is not set locally.
        """
        metageneration = self._properties.get('metageneration')
        if metageneration is not None:
            return int(metageneration)

    @property
    def owner(self):
        """Retrieve info about the owner of the object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: dict or ``NoneType``
        :returns: Mapping of owner's role/ID. If the property is not set
                  locally, returns ``None``.
        """
        return copy.deepcopy(self._properties.get('owner'))

    @property
    def self_link(self):
        """Retrieve the URI for the object.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: string or ``NoneType``
        :returns: The self link for the blob or ``None`` if the property is
                  not set locally.
        """
        return self._properties.get('selfLink')

    @property
    def size(self):
        """Size of the object, in bytes.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: integer or ``NoneType``
        :returns: The size of the blob or ``None`` if the property
                  is not set locally.
        """
        size = self._properties.get('size')
        if size is not None:
            return int(size)

    @property
    def storage_class(self):
        """Retrieve the storage class for the object.

        See: https://cloud.google.com/storage/docs/storage-classes
        https://cloud.google.com/storage/docs/nearline-storage
        https://cloud.google.com/storage/docs/durable-reduced-availability

        :rtype: string or ``NoneType``
        :returns: If set, one of "STANDARD", "NEARLINE", or
                  "DURABLE_REDUCED_AVAILABILITY", else ``None``.
        """
        return self._properties.get('storageClass')

    @property
    def time_deleted(self):
        """Retrieve the timestamp at which the object was deleted.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: :class:`datetime.datetime` or ``NoneType``
        :returns: Datetime object parsed from RFC3339 valid timestamp, or
                  ``None`` if the property is not set locally. If the blob has
                  not been deleted, this will never be set.
        """
        value = self._properties.get('timeDeleted')
        if value is not None:
            naive = datetime.datetime.strptime(value, _RFC3339_MICROS)
            return naive.replace(tzinfo=UTC)

    @property
    def updated(self):
        """Retrieve the timestamp at which the object was updated.

        See: https://cloud.google.com/storage/docs/json_api/v1/objects

        :rtype: :class:`datetime.datetime` or ``NoneType``
        :returns: Datetime object parsed from RFC3339 valid timestamp, or
                  ``None`` if the property is not set locally.
        """
        value = self._properties.get('updated')
        if value is not None:
            naive = datetime.datetime.strptime(value, _RFC3339_MICROS)
            return naive.replace(tzinfo=UTC)


class _UploadConfig(object):
    """Faux message FBO apitools' 'ConfigureRequest'.

    Values extracted from apitools
    'samples/storage_sample/storage/storage_v1_client.py'
    """
    accept = ['*/*']
    max_size = None
    resumable_multipart = True
    resumable_path = u'/resumable/upload/storage/v1/b/{bucket}/o'
    simple_multipart = True
    simple_path = u'/upload/storage/v1/b/{bucket}/o'


class _UrlBuilder(object):
    """Faux builder FBO apitools' 'ConfigureRequest'"""
    def __init__(self, bucket_name, object_name):
        self.query_params = {'name': object_name}
        self._bucket_name = bucket_name
        self._relative_path = ''
