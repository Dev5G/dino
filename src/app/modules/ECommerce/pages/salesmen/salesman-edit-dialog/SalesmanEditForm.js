// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
	Input,
	Select
} from "../../../../../../_metronic/_partials/controls";

// Validation schema
const SalesmanEditSchema = Yup.object().shape({
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

export function SalesmanEditForm({
	saveSalesman,
	salesman,
	actionsLoading,
	onHide,
}) {
	return (
		<>
			<Formik
				enableReinitialize={true}
				initialValues={salesman}
				validationSchema={SalesmanEditSchema}
				onSubmit={(values) => {
					saveSalesman(values);
				}}
			>
				{({ handleSubmit }) => (
					<>
						<Modal.Body className="overlay overlay-block cursor-default">
							{actionsLoading && (
								<div className="overlay-layer bg-transparent">
									<div className="spinner spinner-lg spinner-success" />
								</div>
							)}
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
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<button
								type="button"
								onClick={onHide}
								className="btn btn-light btn-elevate"
							>
								Cancel
			  </button>
							<> </>
							<button
								type="submit"
								onClick={() => handleSubmit()}
								className="btn btn-primary btn-elevate"
							>
								Save
			  </button>
						</Modal.Footer>
					</>
				)}
			</Formik>
		</>
	);
}
