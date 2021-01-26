from datetime import timedelta

from flask import jsonify
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_refresh_token_required)

from ..user.provider import Provider as User
from ....utils import jsonList
from ..accounts.models import AccountCash, AccountGold

class Provider():
	"""
		DB helper class to facilitate easy adding and deletion of objects from db
	"""
	

	@staticmethod
	def create_new_user_with_store(gid,password,confirmed,permissions,store_name,store_permissions):
		user = User(gid=gid,password=password,confirmed=True,permissions=permissions)
		user.save_to_db()
		cash = AccountCash(opening_balance=0,title='Cash account',default=True,user_id=user.id)
		cash.save_to_db()
		gold = AccountGold(opening_balance=0,title='Gold account',default=True,user_id=user.id)
		gold.save_to_db()
		store= Nest(name=store_name)
		nest.save_to_db()
		return {'user': user.json()}
	
	@staticmethod
	def check_login(gid,password):
		"""Check login credentials"""
		status, user = User.login(gid=gid,password=password)
		if not status:
			print('No user')
			if not user:
				return False, 'Account not found!'
			return False, user
		print('We got through')
		expiresIn = timedelta(hours=12)
		r = {'access_token': create_access_token(identity=user,fresh=True, expires_delta=expiresIn),\
								'expiresIn':expiresIn.seconds,\
								'user':user.json()
				}
		if user.nest is not None:
			r['nest'] = user.nest.json()
		return True , r

	@staticmethod
	def get_user_data(gid):
		user = User.find_by_gid(gid=gid)
		r = {'user': user.json()}
		if user.nest is not None:
			r['nest'] = Provider.get_nest_with_entities(user)
		return jsonify(r)
