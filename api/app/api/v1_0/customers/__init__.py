from flask import Blueprint

customers_api = Blueprint('customers_api',__name__)

from . import customers