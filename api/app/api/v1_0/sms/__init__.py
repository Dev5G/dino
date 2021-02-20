from flask import Blueprint

sms_api = Blueprint('sms_api', __name__)

from . import sms_views