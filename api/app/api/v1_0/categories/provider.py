from ..user.provider import Provider as User
from ....utils import  jsonList
from ..accounts.accounts import Accounts
from .models import Category

class Provider:
	@staticmethod
	def find_by_id(id):
		"""return [bool, val]"""
		return Category.find_by_id(id)
	
	@staticmethod
	def find_product_category_by_code(gid,product_code):
		status,u = User.find_by_gid(gid)
		if status:
			return Category.find_product_category_by_code(product_code,u.nest.id)
		return False, None
		
	@staticmethod
	def find_all(gid):
		"""Return [bool, value]"""
		status,u = User.find_by_gid(gid)
		if status and u.nest:
			status,categories = Category.find_all_by_nest(nest_id=u.nest.id)
			if status:
				categories = jsonList(categories)
				return status,categories
		return False, 'Categories not found!'

	@staticmethod
	def add_category(gid,name,abr) -> Category: 
		"""gid, name, abr """
		status,u = User.find_by_gid(gid)
		if status and u.nest:
			category = Category(name=name,abr=abr,published=True,nest_id =u.nest.id)
			try:
				category.add_to_nest()
				return True,category
			except Exception as e:
				print(str(e))
				return False, (str(e))
		return False, 'You don\'t seem to have enough permissions!'
