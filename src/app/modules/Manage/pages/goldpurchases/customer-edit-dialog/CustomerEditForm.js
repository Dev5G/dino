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
import { shallowEqual, useSelector } from "react-redux";

// Validation schema
const CustomerEditSchema = Yup.object().shape({
	weight: Yup.string()
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required("Firstname is required"),
	goldrate: Yup.string()
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required("Lastname is required"),
	deduction: Yup.string()
		.required("Phone is required"),
	price: Yup.string().required("Addres is required"),
	amount_paid: Yup.string().required("Password is required"),
	customer_id: Yup.number()
		.min(1, 'Please select a counter')
		.required('Counter is required!'),
	careof_id: Yup.number()
		.min(1, 'Please select a counter')
		.required('Counter is required!'),
	hen_id: Yup.number()
		.min(1, 'Please select a counter')
		.required('Counter is required!'),
});

export function CustomerEditForm({
	saveCustomer,
	customer,
	actionsLoading,
	onHide,
}) {
	const { counters, customers } = useSelector(
		(state) => ({ 
			counters: state.counters.entities,
			customers: state.customers.entities,
		}),
		shallowEqual
	);
	return (
		<>
			<Formik
				enableReinitialize={true}
				initialValues={customer}
				validationSchema={CustomerEditSchema}
				onSubmit={(values) => {
					saveCustomer(values);
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
									<div className="col-lg-4">
										<Select name="customer_id" label="Customer">
											<option value="0">Please select</option>
											{customers && customers.map(c => (
												<option key={c.id} value={c.id}>{c.fullName}</option>
											))}
										</Select>
									</div>
									<div className="col-lg-4">
										<Select name="careof_id" label="Care of">
											<option value="0">Please select</option>
											{customers && customers.map(c => (
												<option key={c.id} value={c.id}>{c.fullName}</option>
											))}
										</Select>
									</div>
									<div className="col-lg-4">
										<Select name="hen_id" label="Counter">
											<option value="0">Please select</option>
											{counters && counters.map(c => (
												<option key={c.id} value={c.id}>{c.name}</option>
											))}
										</Select>
									</div>
								</div>
								<div className="form-group row">
									{/* First Name */}
									<div className="col-lg-4">
										<Field
											name="weight"
											component={Input}
											placeholder="Weight"
											label="Weight"
										/>
									</div>
									{/* Last Name */}
									<div className="col-lg-4">
										<Field
											name="amount_pound"
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
										<Select name="gender" label="Gender">
											<option value="0">Female</option>
											<option value="1">Male</option>
										</Select>
									</div>
									<div className="col-lg-4">
										<Select name="hen_id" label="Counter">
											<option value="0">Please select</option>
											{counters && counters.map(c => (
												<option key={c.id} value={c.id}>{c.name}</option>
											))}
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
