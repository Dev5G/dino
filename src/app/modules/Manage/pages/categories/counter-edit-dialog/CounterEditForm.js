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
	abr: Yup.string()
		.min(1, "Minimum 1 symbols")
		.max(50, "Maximum 50 symbols")
		.required("Abbreviation is required"),
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
											placeholder="Category Name"
											label="Name"
										/>
									</div>
								</div>
								{/* Email */}
								<div className="form-group row">
									<div className="col-lg-6">
										<Field
											name="abr"
											component={Input}
											placeholder="Category Abbreviation"
											label="Abbreviation"
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
