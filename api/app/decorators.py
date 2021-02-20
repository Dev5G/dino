from functools import wraps
from flask import abort
from flask_login import current_user
from .models import PermissionTier
from .utils import is_user_with_store


#------------Store level permission required decorators------
def user_permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not is_user_with_store() or not current_user.store.can(permissions=permission):
                return 'You need a business account with tier 1 permissions before accessing this page.'
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def t1_required(f):
    return user_permission_required(PermissionTier.t1)(f)

def t2_required(f):
    return user_permission_required(PermissionTier.t2)(f)

def t3_required(f):
    return user_permission_required(PermissionTier.t3)(f)

def admin_required(f):
    return user_permission_required(PermissionTier.admin)(f)
#---------------- end store level perms
#---------------- user level permission decorators------------
def no_store_required(f):
        @wraps(f)
        def decarated_func(*args, **kwargs):
            if not current_user.is_authenticated:
                return "You need to log in first to access this page."
            if current_user.store_id:
                return "You need to be logged in and have no business account setup to access this page."
            return f(*args, **kwargs)
        return decarated_func

def store_required(f):
    @wraps(f)
    def decorated_function(*args , **kwargs):
        if not is_user_with_store():
            abort(403)
        return f(*args, **kwargs)
    return decorated_function
