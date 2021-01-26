from flask import Blueprint


sms = Blueprint('sms',__name__,template_folder='templates', url_prefix='/sms')

from . import sms_views