import React from "react";

export function Checkbox({label , ...props}) {
  return (
    <>
      <label className="checkbox checkbox-lg checkbox-single">
              <input type="checkbox" {...props}/>
              {label && label}
        <span />
      </label>
    </>
  );
}
