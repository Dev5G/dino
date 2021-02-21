// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { 
	Input
} from "../../../../../../_metronic/_partials/controls";

// Validation schema
const GoldrateEditSchema = Yup.object().shape({
	goldrate: Yup.number()
		.min(1000, "Minimum rate can be 1000")
		.max(999999, "Maximum rate can be 999999")
		.required("Goldrate is required"),
	goldrate24k: Yup.number()
		.min(1000, "Minimum rate can be 1000")
		.max(999999, "Maximum rate can be 999999")
		.required("Goldrate 24k is required"),
});

export function GoldrateEditForm({
	saveGoldrate,
	goldrate,
	actionsLoading,
	onHide,
}) {
	return (
		<>
			<Formik
				enableReinitialize={true}
				initialValues={goldrate}
				validationSchema={GoldrateEditSchema}
				onSubmit={(values) => {
					saveGoldrate(values);
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
									<div className="col-lg-12">
										<Field
											name="goldrate"
											component={Input}
											placeholder="Goldrate"
											label="Goldrate"
										/>
									</div>
								</div>
								{/* 24k Goldrate */}
								<div className="form-group row">
									<div className="col-lg-12">
										<Field
											name="goldrate24k"
											component={Input}
											placeholder="Goldrate 24k"
											label="Goldrate 24k"
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
