from ..user.provider import Provider as User
from ...models.phone.model import Phone
from ....utils import jsonList
from ..accounts.accounts import Accounts
from ..hens.provider import Provider as Hens

class Provider():
	@staticmethod
	def find_customers(gid):
		"""Return [bool, value]"""
		status,user = User.find_by_gid(gid)
		if status and user.nest:
			customers = user.nest.customers.all()
			if customers:
				return True, jsonList(customers)
		return False, 'Customers not found!'

	@staticmethod
	def create_new_customer(first_name,last_name,phone,
							address,password,
							hen_id,gid) -> [bool,User]:
		"""-
		Create new customer ->[bool, val]
		"""
		status,keeper = User.find_by_gid(gid=gid)
		if status:
			phone_status , number = Phone.find_by_phone(phone)
			user = None
			if not phone_status:
				try:
					phone = Phone(number=phone,primary=True)
					phone.add_to_nest()
					status,user =User.add_user(first_name=first_name,last_name=last_name,address=address,password=password,confirmed=False)
					if status:
						user.add_phone(phone)
				except Exception as e:
					print(str(e))
					return False, 'Error:' + str(e)
			if phone_status:
				try:
					if not number.user:
						_,user =User.add_user(first_name=first_name,last_name=last_name,address=address,password=password,confirmed=False)
						user.add_phone(number)
					if number.user:
						user = number.user
						if	not user.details:
							User.add_user_details(first_name=first_name,last_name=last_name,address=address,user=number.user)
				except Exception as e:
					print(str(e))
					return False, 'Error:' + str(e)
			if	user:
				status,_ = Accounts.add_customer_accounts(user,hen_id)
			if status:
				keeper.nest.customers.append(user)
				return True,user
		return False, 'There was some problem creating customer!'