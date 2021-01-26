from flask import jsonify, g
from flask.views import MethodView
from flask_jwt_extended import (jwt_required, get_jwt_identity)
from . import dashboard_api
#from app.models import GoldRate, User

class dashboard(MethodView):
	def get(self):
		return jsonify({'goldrate': 20000}), 200

dashboard_api.add_url_rule("/",
view_func=dashboard.as_view("dashboard_index_api"))


#@dashboard_api.before_request
#@jwt_required
#def before_dashboard_request():
#	username = get_jwt_identity()
#	print(username)
#	g.username = username
#	user = User.find_by_username(username)
#	if user:
#		g.store_id = user.store.uuid