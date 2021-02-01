from .models import (AccountCash, AccountGold,
							SupplierCashAccounts,
							SupplierGoldAccounts,
							CustomerCashAccounts,
							CustomerGoldAccounts)

class Accounts:
	@staticmethod
	def create_cash_and_gold(cash_title:str='Cash Account',
						  gold_title:str='Gold Account',
						  gold24_title:str='Gold24 Account',
						  opening_cash:int=0,
						  opening_gold:float=0.0,
						  opening_gold24:float=0.0):
		cash = AccountCash(opening_balance=opening_cash,
					 title=cash_title)
		gold = AccountGold(opening_balance=opening_gold,
					 title=gold_title)
		gold24 = AccountGold(opening_balance=opening_gold24,
					 title=gold24_title,carat_id=24)
		try:
			cash.add_to_nest()
			gold.add_to_nest()
			gold24.add_to_nest()
		except Exception as e:
			print(str(e))
			return None
		return cash, gold, gold24

	@staticmethod
	def add_supplier_accounts(supplier,hen_id,opening_cash=0,opening_gold=0,opening_gold24=0):
		try:
			cash_status,cashA = SupplierCashAccounts.find_account(supplier_id=supplier.id,hen_id=hen_id)
			gold_status,goldA = SupplierGoldAccounts.find_account(supplier_id=supplier.id,hen_id=hen_id,carat_id=21)
			gold24_status,gold24A = SupplierGoldAccounts.find_account(supplier_id=supplier.id,hen_id=hen_id,carat_id=24)
			
			cash, gold, gold24 = Accounts.create_cash_and_gold(opening_cash=opening_cash,
														opening_gold=opening_gold,
														opening_gold24=opening_gold24)
			#TODO:// separate account creation and improve adding of account so 
			# that we can check each account if it 
			# exist or not and then 
			# create a new otherwise none and return old
			if not cash_status:
				cashA = SupplierCashAccounts(account_id=cash.id,supplier_id=supplier.id,hen_id=hen_id)
				cashA.add_to_nest()
			else:
				cash.delete_from_db()
			if not gold_status:
				goldA = SupplierGoldAccounts(account_id=gold.id,supplier_id=supplier.id,hen_id=hen_id)
				goldA.add_to_nest()
			else:
				gold.delete_from_db()
			if not gold24_status:
				gold24A = SupplierGoldAccounts(account_id=gold24.id,supplier_id=supplier.id,hen_id=hen_id)
				gold24A.add_to_nest()
			else:
				gold24.delete_from_db()
			return True, 'Supplier accounts added'
		except Exception as e:
			return False, 'Supplier accounts could not be added!'+ str(e)

	@staticmethod
	def add_customer_accounts(customer,hen_id,opening_cash=0,opening_gold=0,opening_gold24=0):
		try:
			cash_status,cashA = CustomerCashAccounts.find_account(customer_id=customer.id,hen_id=hen_id)
			gold_status,goldA = CustomerGoldAccounts.find_account(customer_id=customer.id,hen_id=hen_id,carat_id=21)
			gold24_status,gold24A = CustomerGoldAccounts.find_account(customer_id=customer.id,hen_id=hen_id,carat_id=24)
			
			cash, gold, gold24 = Accounts.create_cash_and_gold(opening_cash=opening_cash,
														opening_gold=opening_gold,
														opening_gold24=opening_gold24)
			#TODO:// separate account creation and improve adding of account so 
			# that we can check each account if it 
			# exist or not and then 
			# create a new otherwise none and return old
			if not cash_status:
				cashA = CustomerCashAccounts(account_id=cash.id,customer_id=customer.id,hen_id=hen_id)
				cashA.add_to_nest()
			else:
				cash.delete_from_db()
			if not gold_status:
				goldA = SupplierGoldAccounts(account_id=gold.id,customer_id=customer.id,hen_id=hen_id)
				goldA.add_to_nest()
			else:
				gold.delete_from_db()
			if not gold24_status:
				gold24A = SupplierGoldAccounts(account_id=gold24.id,customer=customer.id,hen_id=hen_id)
				gold24A.add_to_nest()
			else:
				gold24.delete_from_db()
			return True, 'Supplier accounts added'
		except Exception as e:
			return False, 'Supplier accounts could not be added!'+ str(e)