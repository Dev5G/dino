from flask import Blueprint
from app.models import Permission

admin = Blueprint('admin', __name__, template_folder='templates', url_prefix='/store')

from . import views, product_views, supplier_d_views , accounts_views, users_views, customer_views, suppliers_view, pos_view ,salesman_view , errors
