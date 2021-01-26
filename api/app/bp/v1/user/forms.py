from flask_wtf import FlaskForm
from wtforms import StringField , PasswordField, SubmitField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, Length, EqualTo, ValidationError, Email, Regexp
from flask_wtf.file import FileField, FileAllowed

class StoreSignupForm(FlaskForm):
    store_name = StringField('Store name*', validators=[DataRequired(), Length(min=3,max=20)])
    email = StringField('Email*', validators=[DataRequired() , Length(min=3,max=20)])
    address = StringField('Address*', validators=[DataRequired(), Length(min=10,max=180)])
    country = StringField('Country')
    city = StringField('City')
    bio = TextAreaField('Bio')
    phone = StringField('Phone*',validators=[DataRequired(), Length(min=8,max=20)])
    website = StringField('Website')
    logo_image = FileField('Logo image',validators=[FileAllowed(['jpeg', 'jpg', 'png', 'gif'])])
    submit = SubmitField('Submit')
