// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
	Input,
	Select
} from "../../../../../../_metronic/_partials/controls";

// Validation schema
const CounterEditSchema = Yup.object().shape({
	name: Yup.string()
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required("Name is required"),
	opening_cash: Yup.number()
		.min(0, "Minimum 3 symbols")
		.max(99999999, "Maximum 99999999 cash is allowed"),
	opening_gold: Yup.number()
		.min(0, "Minimum 3 symbols")
		.max(10000, "Maximum 10000 gram gold is allowed"),
	opening_gold24: Yup.number()
		.min(0, "Minimum 3 symbols")
		.max(10000, "Maximum 10000 gram gold is allowed")
});

export function CounterEditForm({
	saveCounter,
	counter,
	actionsLoading,
	onHide,
}) {
	return (
		<>
			<Formik
				enableReinitialize={true}
				initialValues={counter}
				validationSchema={CounterEditSchema}
				onSubmit={(values) => {
					saveCounter(values);
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
											name="name"
											component={Input}
											placeholder="Counter Name"
											label="Name"
										/>
									</div>
								</div>
								{/* Email */}
								<div className="form-group row">
									<div className="col-lg-6">
										<Field
											name="opening_cash"
											type="number"
											component={Input}
											placeholder="Opening Cash"
											label="Opening Cash"
										/>
									</div>
								</div>
								<div className="form-group row">
									{/* Gender */}
									<div className="col-lg-6">
										<Field
											name="opening_gold"
											type="number"
											component={Input}
											placeholder="Opening Gold"
											label="Opening Gold"
										/>
									</div>
									{/* Type */}
									<div className="col-lg-6">
										<Field
											name="opening_gold24"
											type="number"
											component={Input}
											placeholder="Opening Gold 24k"
											label="Opening Gold 24k"
										/>
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
