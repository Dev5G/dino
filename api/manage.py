#!usr/bin/env python
import  os
from flask_script import  Manager, Shell
from flask_migrate import Migrate , MigrateCommand
from app.models import  Role , NestRole, Nest, PermissionTier, UPermissionTier, GoldRate
from app.api.v1_0.user.models import User
from app import create_app, db
import uuid

app = create_app(os.getenv('FLASK_ENV') or 'default')
manager = Manager(app)
migrate = Migrate(app, db)

def make_shell_ctx():
     return dict(app=app, db=db, User=User, Role=Role, sRole=NestRole,
                    Store=Nest, UPT=UPermissionTier, PT=PermissionTier , uuid=uuid.uuid4,
                    Gold=GoldRate
                    )
manager.add_command('shell',Shell(make_context=make_shell_ctx))
manager.add_command('db', MigrateCommand)
#@app.before_first_request
#def create_tables():
#    db.drop_all()
#    db.create_all()
#s    Create_defaults.insert_defaults()
@manager.command
def test():
     """Run the unit tests."""
     import unittest
     tests = unittest.TestLoader().discover('tests')
     unittest.TextTestRunner(verbosity=2).run(tests)

if __name__ == '__main__':
    manager.run()
