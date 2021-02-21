import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";


// Validation schema
const SupplierEditSchema = Yup.object().shape({
	firstName: Yup.string()
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required("Firstname is required"),
	lastName: Yup.string()
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required("Lastname is required"),
	phone: Yup.string()
		.required("Phone is required"),
	address: Yup.string().required("Addres is required"),
	password: Yup.string().required("Password is required"),
});

export function SupplierEditForm({
	supplier,
	btnRef,
	saveSupplier,
}) {
	return (
		<>
			<Formik
				enableReinitialize={true}
				initialValues={supplier}
				validationSchema={SupplierEditSchema}
				onSubmit={(values) => {
					saveSupplier(values);
				}}
			>

				{({ handleSubmit}) => (
					<>
						<Form className="form form-label-right">
							<div className="form-group row">
								{/* First Name */}
								<div className="col-lg-4">
									<Field
										name="firstName"
										component={Input}
										placeholder="First Name"
										label="First Name"
									/>
								</div>
								{/* Last Name */}
								<div className="col-lg-4">
									<Field
										name="lastName"
										component={Input}
										placeholder="Last Name"
										label="Last Name"
									/>
								</div>
								{/* Login */}
								<div className="col-lg-4">
									<Field
										name="address"
										component={Input}
										placeholder="Address"
										label="Address"
									/>
								</div>
							</div>
							{/* Email */}
							<div className="form-group row">
								<div className="col-lg-4">
									<Field
										name="phone"
										component={Input}
										placeholder="Phone"
										label="Phone"
									/>
								</div>

								{/* IP Address */}
								<div className="col-lg-4">
									<Field
										name="password"
										component={Input}
										placeholder="Password"
										label="Password"
										customFeedbackLabel="Make sure the user changes the password later"
									/>
								</div>
							</div>
							<div className="form-group row">
								{/* Gender */}
								<div className="col-lg-4">
									<Select name="Gender" label="Gender">
										<option value="Female">Female</option>
										<option value="Male">Male</option>
									</Select>
								</div>
								{/* Type */}
								<div className="col-lg-4">
									<Select name="type" label="Type">
										<option value="0">Business</option>
										<option value="1">Individual</option>
									</Select>
								</div>
							</div>
							<button
								type="submit"
								style={{ display: "none" }}
								ref={btnRef}
								onSubmit={() => handleSubmit()}
							></button>
						</Form>
					</>
				)}
			</Formik>
		</>
	);
}
