from ....models import (Role,
							Nest, Carat, Metal, RattiMethod,  GoldRate)
from ....utils import generate_gid, jsonList
from ..accounts.models import AccountCash, AccountGold
from ..categories.models import Category
from ..user.provider import Provider as User


class UserProvider():
	@staticmethod
	def find_user_by_gid(gid) -> User:
		u = User.find_by_gid(gid)
		if u:
			return u
		return None


	@staticmethod
	def create_new_user(fname,lname,address,password,confirmed,permissions,phone) -> User:
		"""
		Creates a new user -> user
		"""
		gid = generate_gid(fname,lname)
		user = User(gid=gid,password=password,confirmed=confirmed,permissions=permissions)
		if user.save_to_db():
			details = UserDetails(first_name=fname,last_name=lname,address=address,user_id=user.id)
			details.save_to_db()
			phone = Phone_number(user_id=user.id,number=phone,primary=True)
			phone.save_to_db()
			cash = AccountCash(opening_balance=0,title='Cash account',default=True,user_id=user.id)
			cash.save_to_db()
			gold = AccountGold(opening_balance=0,title='Gold account',default=True,user_id=user.id)
			gold.save_to_db()
			return user
		return None


class GoldrateProvider():
	
	@staticmethod
	def find_goldrates_filtered(identity, filter) -> list:
		"""
			Finds a list of all gold rates for the current user
		"""
		goldrates = None
		if identity:
			user = User.find_by_gid(identity)
			goldrates = GoldRate.find_all_filtered(nest_id=user.nest.id, filter=filter)
		if goldrates:
			return jsonList(goldrates)
		goldrates = GoldRate.find_all_filtered(nest_id=None, filter=filter)
		return jsonList(goldrates) if goldrates else None

	@staticmethod
	def find_goldrates(identity) -> list:
		"""
			Finds a list of all gold rates for the current user
		"""
		user = User.find_by_gid(identity)
		goldrates = GoldRate.find_all(nest_id=user.nest.id)
		if goldrates:
			return jsonList(goldrates)
		return None

	@staticmethod
	def find_goldrate_today(identity) -> GoldRate:
		"""
			Finds todays gold rate for the current user if it exists else returns None
		"""
		user = User.find_by_gid(identity)
		gr = GoldRate.find_today(nest_id=user.nest.id)
		if gr:
			return gr
		return None

	@staticmethod
	def add_new_rate(rate, rate24k, identity) -> GoldRate:
		"""-
		Add new rate -> GoldRate
		"""
		user = User.find_by_gid(gid=identity)
		#get carat id from settings table "settings -> carat_id"
		carat_id = 1
		if user:
			g =	GoldRate(value=rate,value24k=rate24k,carat_id=carat_id,nest_id=user.nest.id)
			if g.save_to_db():
				return g
		return None



class CustomerProvider():
	@staticmethod
	def find_customers(identity) -> list:
		user = User.find_by_gid(identity)
		customers = user.nest.customers.all()
		if customers:
			return jsonList(customers)
		return None

	@staticmethod
	def create_new_customer(fname,lname,phone,
							address,password,
							identity) -> User:
		"""-
		Create new supplier -> user
		"""
		owner = User.find_by_gid(gid=identity)
		permission = Role.get_customer_permissions()
		user =UserProvider.create_new_user(fname=fname,lname=lname,address=address,phone=phone,password=password,confirmed=True,permissions=permission)
		if user:
			if Nest.add_customer(user_id=user.id,nest_id=owner.nest.id):
				return user
		return None



class Provider():
	"""
	Nest Provider
	"""
	#Check new way of returning a new list of categories with max count
	@staticmethod
	def get_categories_with_max_count(nest_id):
		c= jsonList(Category.find_all())
		for x in c:
			x['max'] = Product.get_max_count(nest_id=nest_id,category_id=x['id'])
		return c

	@staticmethod
	def get_categories():
		c= Category.find_all()
		l = jsonList(c)
		return jsonify(l)

	@staticmethod
	def get_carats():
		c= Carat.find_all()
		l = jsonList(c)
		return jsonify(l)

	@staticmethod
	def get_suppliers(gid):
		u= User.find_by_gid(gid)
		s=u.nest.suppliers.all()
		l = jsonList(s)
		return jsonify(l)

	@staticmethod
	def get_metals():
		c= Metal.find_all()
		l = jsonList(c)
		return jsonify(l)

	@staticmethod
	def get_ratti_methods(gid):
		user = User.find_by_gid(gid)
		c= RattiMethod.find_all(user.nest.id)
		l = jsonList(c)
		return jsonify(l)

	@staticmethod
	def get_product_code(gid,cid):
		user = User.find_by_gid(gid)
		c= Product.generate_code(nest_id=user.nest.id,category_id=cid)
		return jsonify({'productCode': c})