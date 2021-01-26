from flask import Blueprint
from app.models import UPermissionTier, PermissionTier
from app.utils import is_user_with_store

main = Blueprint('main', __name__, template_folder='templates')

from . import views, errors

@main.app_context_processor
def inject_permissions():
    return dict(Permission=UPermissionTier, StorePermission=PermissionTier, is_user_with_store=is_user_with_store)
