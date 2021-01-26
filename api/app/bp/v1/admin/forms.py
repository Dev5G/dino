from flask_wtf import FlaskForm
from wtforms import StringField , PasswordField, SubmitField, BooleanField, TextAreaField, MultipleFileField ,HiddenField
from wtforms.fields import IntegerField, SelectField, FloatField, DecimalField, FieldList, FormField
from wtforms.validators import DataRequired, Length, EqualTo, ValidationError, Email, Regexp
from flask_wtf.file import FileField, FileAllowed



class SaleEditForm(FlaskForm):
	sale_id = HiddenField('Sale id')
	customer = SelectField('Customer', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	salesman = SelectField('Salesman', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	cash_account = SelectField('Cash Account', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	care_of = SelectField('Care of', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	counter = SelectField('Counter', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	desc = TextAreaField('Description', render_kw={'class':'form-control'})
	total = IntegerField('Total amount',render_kw={'readonly':True,'class':'form-control','value':'0'})
	grand = IntegerField('grand total amount',render_kw={'readonly':True,'class':'form-control' , 'value':'0'})
	goldrate = IntegerField('Total amount',render_kw={'readonly':True,'class':'form-control'})
	discount = IntegerField('Discount amount',render_kw={'class':'form-control', 'value':'0'})
	balance = IntegerField('Balance amount',render_kw={'readonly':True,'class':'form-control', 'value':'0'})
	savebtn = SubmitField('Save', render_kw={'class':'btn btn-raised btn-primary waves-effect'})

class SingleStringForm(FlaskForm):
	value = StringField('Value', render_kw={ 'class':'form-control'})
	published = BooleanField('Published', render_kw={'checked': 'checked'})
	savebtn = SubmitField('Save', render_kw={'class':'btn btn-raised btn-primary waves-effect'})



class AddProductForm(FlaskForm):
	class Meta:
		csrf = False
	product_id = HiddenField('Product id')
	category = StringField('Category', render_kw={'readonly': True,  'class':'form-control'})
	carat = StringField('Carat', render_kw={'readonly': True, 'class':'form-control'})
	supplier = StringField('Supplier', render_kw={'readonly': True, 'class':'form-control'})
	operator = StringField('Operator', render_kw={'readonly': True, 'class':'form-control'})
	metal = StringField('Metal', render_kw={'readonly': True, 'class':'form-control'})
	ratti_method = StringField('Ratti method', render_kw={'readonly': True, 'class':'form-control'})
	design_no = StringField('Design no',render_kw={'readonly': True, 'class':'form-control'})
	size = IntegerField('Size no',render_kw={'readonly': True, 'class':'form-control'})
	qty = IntegerField('Quantity',render_kw={'readonly': True, 'class':'form-control'})
	product_code = StringField('Product code',render_kw={'readonly': True, 'class':'form-control'})
	weight = FloatField('Weight' ,render_kw={'readonly': True, 'class':'form-control'})
	waste = DecimalField('Waste',render_kw={'readonly': True, 'class':'form-control'})
	ratti = FloatField('Ratti',render_kw={'readonly': True, 'class':'form-control'})
	total_weight =FloatField('Total weight',render_kw={'readonly': True, 'class':'form-control'})
	pure_weight = FloatField('Pure weight',render_kw={'readonly': True, 'class':'form-control'})
	desc = StringField('Description',render_kw={'readonly': True, 'class':'form-control'})
	net = IntegerField('Net amount',render_kw={'class':'form-control', 'value':'0'})
	gross = IntegerField('Gross amount',render_kw={'class':'form-control', 'value':'0'})
	is_split = BooleanField('Is split sale?')
	split_weight = FloatField('Weight' ,render_kw={'class':'form-control', 'value':'0'})
	is_order = BooleanField('Is order sale?')
	addbtn = SubmitField('Add', render_kw={'class':'btn btn-raised btn-primary waves-effect'})



class SaleDetails(FlaskForm):
	class Meta:
		csrf = False
	product_id = StringField('Product id', validators=[DataRequired()])
	net = IntegerField('Net amount',render_kw={'class':'form-control'})
	gross = IntegerField('Gross amount',render_kw={'class':'form-control'})
	is_split = BooleanField('Is split sale?')
	weight = FloatField('Weight' ,render_kw={'class':'form-control'})
	is_order = BooleanField('Is order sale?')

class testForm(FlaskForm):
	product_d = FieldList(FormField(SaleDetails), min_entries=1)
	savebtn = SubmitField('Save', render_kw={'class':'btn btn-raised btn-primary waves-effect'})


class SaleForm(FlaskForm):
	product_details = FieldList(FormField(SaleDetails), min_entries=1)
	customer = SelectField('Customer', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	salesman = SelectField('Salesman', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	cash_account = SelectField('Cash Account', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	care_of = SelectField('Care of', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	counter = SelectField('Counter', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	desc = TextAreaField('Description', render_kw={'class':'form-control'})
	total = IntegerField('Total amount',render_kw={'readonly':True,'class':'form-control','value':'0'})
	grand = IntegerField('grand total amount',render_kw={'readonly':True,'class':'form-control' , 'value':'0'})
	goldrate = IntegerField('Total amount',render_kw={'readonly':True,'class':'form-control'})
	discount = IntegerField('Discount amount',render_kw={'class':'form-control', 'value':'0'})
	balance = IntegerField('Balance amount',render_kw={'readonly':True,'class':'form-control', 'value':'0'})
	savebtn = SubmitField('Save', render_kw={'class':'btn btn-raised btn-primary waves-effect'})


class SearchProductBox(FlaskForm):
	class Meta:
		csrf = False

	code_input = StringField('Product Code', validators=[DataRequired()], render_kw={'class':'form-control', 'placeholder':'Product code..'})
	searchbtn = SubmitField('Search', render_kw={'class':'btn btn-raised btn-primary waves-effect'})


class AddSupplierForm(FlaskForm):
	user_id = SelectField('User', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	submit = SubmitField('Submit', render_kw={'class':'btn btn-raised btn-primary waves-effect'})


class UserForm(FlaskForm):
	first_name = StringField('First name', validators=[DataRequired()],render_kw={'placeholder':'First name','autofocus': True,'class':'form-control'})
	last_name = StringField('Last name', validators=[DataRequired()],render_kw={'placeholder':'Last name','class':'form-control'})
	email = StringField('Email', validators=[DataRequired(), Email()],render_kw={'placeholder':'Email','class':'form-control', 'type': 'email'})
	password = PasswordField('Passowrd', validators=[DataRequired()],render_kw={'placeholder':'Password','class':'form-control','readonly': True})
	submit = SubmitField('Submit', render_kw={'class':'btn btn-raised btn-primary waves-effect'})


class CashAccountForm(FlaskForm):
	title = StringField('Title', validators=[DataRequired()],render_kw={'placeholder':'Enter account title','autofocus': True,'class':'form-control'})
	opening = FloatField('Opening balance',validators=[DataRequired()] ,render_kw={'value' : '0','placeholder':'Enter opening balance','class':'form-control'})
	account_group_id = SelectField('Account group', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	user_id = SelectField('User', validators=[DataRequired()],render_kw={'class':'form-control show-tick ms select2'})
	submit = SubmitField('Submit', render_kw={'class':'btn btn-raised btn-primary waves-effect'})


class GoldGivenForm(FlaskForm):
	weight = FloatField('Weight*',validators=[DataRequired()] ,render_kw={'value' : '0','placeholder':'Enter Weight'})
	supplier_id = SelectField('Supplier*', validators=[DataRequired()])
	care_of_id = SelectField('Care of', validators=[DataRequired()])
	desc = TextAreaField('Description')
	submit = SubmitField('Submit')

class ProductForm(FlaskForm):
	images = MultipleFileField('Product Gallery', validators=[FileAllowed(['jpeg', 'jpg', 'png'])], render_kw={'class':'form-control'})
	category = SelectField('Category', validators=[DataRequired()], render_kw={'autofocus': True, 'class':'form-control show-tick ms select2', 'data-placeholder': 'Select'})
	carat = SelectField('Carat', validators=[DataRequired()], render_kw={'class':'form-control show-tick ms select2', 'data-placeholder': 'Select'})
	supplier = SelectField('Supplier', validators=[DataRequired()], render_kw={'class':'form-control show-tick ms select2', 'data-placeholder': 'Select'})
	metal = SelectField('Metal', validators=[DataRequired()], render_kw={'class':'form-control show-tick ms select2', 'data-placeholder': 'Select'})
	ratti_method = SelectField('Ratti method', validators=[DataRequired()], render_kw={'class':'form-control show-tick ms select2', 'data-placeholder': 'Select'})
	design_no = StringField('Design no',render_kw={'value' : '0','placeholder':'Enter design no','class':'form-control'})
	size = IntegerField('Size no',render_kw={'value' : '0','placeholder':'Enter Size','class':'form-control'})
	qty = IntegerField('Quantity', validators=[DataRequired()],render_kw={'value' : '1','placeholder':'Enter Quantity','aria-required':'true','required':'','class':'form-control'})
	product_code = StringField('Product code', validators=[DataRequired()],render_kw={'readonly': True ,'aria-required':'true','required':'','class':'form-control'})
	weight = FloatField('Weight',validators=[DataRequired()] ,render_kw={'value' : '0','placeholder':'Enter Weight','aria-required':'true','required':'','class':'form-control'})
	waste = DecimalField('Waste',validators=[DataRequired()],render_kw={'value' : '0','placeholder':'Enter waste','aria-required':'true','required':'','class':'form-control'})
	ratti = FloatField('Ratti',validators=[DataRequired()],render_kw={'value' : '0','placeholder':'Enter ratti','aria-required':'true','required':'','class':'form-control'})
	total_weight =FloatField('Total weight',render_kw={'readonly': True,'aria-required':'true','required':'','class':'form-control'},validators=[DataRequired()])
	pure_weight = FloatField('Pure weight',render_kw={'readonly': True,'aria-required':'true','required':'','class':'form-control'},validators=[DataRequired()])
	published = BooleanField('Published', render_kw={'checked': 'checked'})
	desc = TextAreaField('Description' , render_kw={'class':'form-control no-resize','rows':'4','aria-required':'true','required':''})
	submit = SubmitField('Submit', render_kw={'class':'btn btn-raised btn-primary waves-effect'})

	def validate_category(self, cat):
		if not cat.data.strip():
			raise ValidationError('You must select a category')


class StoneFrom(FlaskForm):
	name = StringField('Stone name*', validators=[DataRequired()])
	stone_type = SelectField('Stone type', validators=[DataRequired()])
	qty = IntegerField('Quantity', validators=[DataRequired()])
	rate = DecimalField('Rate (r/g)', places=3,validators=[DataRequired()])
	desc = StringField('Description')
	published = BooleanField('Published')
	submit = SubmitField('Submit')

	def validate_stone_type(self, st):
		if st.data == '':
			raise ValidationError('You must select a stone type value')


class StoneTypeForm(FlaskForm):
	name = StringField('Name*', validators=[DataRequired()])
	published = BooleanField('Published')
	submit = SubmitField('Submit')


class GoldRateForm(FlaskForm):
	value = IntegerField('Gold rate*', validators=[DataRequired()])
	carat = SelectField('Carat')
	published = BooleanField('Published')
	submit = SubmitField('Submit')


class CaratsForm(FlaskForm):
	value = StringField('value*', validators=[DataRequired(), Length(min=1,max=2)])
	published = BooleanField('Published')
	submit = SubmitField('Save Changed')


class CategoryForm(FlaskForm):
	name = StringField('Name', validators=[DataRequired()])
	abr = StringField('Abbreviation')
	published = BooleanField('Published')
	submit = SubmitField('Save Changed')
