from .models import User, UserDetails
from ..accounts.accounts import Accounts

class Provider:
    """User Provider"""
    @staticmethod
    def login(gid,password):
        """return [bool, value]"""
        return User.login(gid,password)


    @staticmethod
    def find_by_gid(gid):
        """return [bool, value]"""
        return User.find_by_gid(gid)
    
    @staticmethod
    def add_user_details(first_name:str,last_name:str,address:str,user:User):
        ud = UserDetails(first_name=first_name,last_name=last_name,address=address,user_id=user.id)
        if ud.add_to_nest():
            return True,ud
        return False, 'Could not add user details'

    @staticmethod
    def add_user(first_name,last_name,address,password,confirmed):
        u = User(password=password,confirmed=confirmed)
        u.gid = str(u.gid)
        if u.add_to_nest():
            print('userrrrrrrrrr')
            status , _ = Provider.add_user_details(first_name=first_name,last_name=last_name,address=address,user=u)
            if status:
                print(u.json())
                return True,u
        if u:
            u.delete_from_db()
        return False, 'Couldn\'t create user!'