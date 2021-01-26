from flask import Blueprint

nest_api =  Blueprint('nest_api',__name__)

from . import store_views, products, customers, goldrates