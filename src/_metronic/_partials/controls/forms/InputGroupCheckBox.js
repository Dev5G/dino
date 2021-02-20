import React from "react";
import { FieldFeedbackLabel } from "./FieldFeedbackLabel";

const getFieldCSSClasses = (touched, errors) => {
    const classes = ["form-control"];
    if (touched && errors) {
        classes.push("is-invalid");
    }

    if (touched && !errors) {
        classes.push("is-valid");
    }

    return classes.join(" ");
};

export function InputGroupCheckBox({
    field, // { name, value, onChange, onBlur }
    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    label,
    withFeedbackLabel = true,
    customFeedbackLabel,
    type = "text",
    isSelected,
    checkBoxOnChange,
    ...props
}) {
    return (
        <>
            {label && <label>Enter {label}</label>}
            <div className="mb-3 input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <input type="checkbox" checked={isSelected} onChange={checkBoxOnChange} />
                    </span>
                </div>
                <input
                    type={type}
                    className={getFieldCSSClasses(touched[field.name], errors[field.name])}
                    {...field}
                    {...props}
                />
            </div>
            {withFeedbackLabel && (
                <FieldFeedbackLabel
                    error={errors[field.name]}
                    touched={touched[field.name]}
                    label={label}
                    type={type}
                    customFeedbackLabel={customFeedbackLabel}
                />
            )}
        </>
    );
}
