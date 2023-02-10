import React from "react"
import { PropTypes } from "prop-types";

function StepProgress({
  stepOne,
  stepTwo,
  stepThree,
}) {

  const stepProgressStyles = {
    default: {
      borderRight: "none",
      borderBottom: "none",
      borderLeft: "none",
      borderTop: "4px dotted #a9a9a9"
    },
    error: {
      borderRight: "none",
      borderBottom: "none",
      borderLeft: "none",
      borderTop: "4px dotted #dc3545"
    },
    success: {
      borderRight: "none",
      borderBottom: "none",
      borderLeft: "none",
      borderTop: "4px dotted #AE678C ",
    },
  };


  return (
    <>
      <div className="row mt-5 mx-auto align-items-center justify-content-center">

        <div className="col-md-12 d-flex">

          <div className={
            stepOne === "success" ? "btn btn-cta-active rounded-circle" :
              stepOne === "invalid" ? "btn rounded-circle btn-cta-invalid" :
                "text-dark btn rounded-circle btn-cta-default bg-white"}>
            {stepOne === "success" ? "✓" :
              stepOne === "invalid" ? "X" : "1"}
          </div>

          <div className="col mt-3" style={
            stepOne === "success" ? stepProgressStyles.success :
              stepOne === "invalid" ? stepProgressStyles.error : stepProgressStyles.default} />

          <div className={
            stepTwo === "success" ? "btn btn-cta-active rounded-circle" :
              "text-dark btn rounded-circle btn-cta-default bg-white"}>
            {stepTwo === "success" ? "✓" : "2"}
          </div>

          <div className="col mt-3" style={stepTwo === "success" ? stepProgressStyles.success : stepProgressStyles.default} />

          <div className={
            stepThree === "success" ? "btn btn-cta-active rounded-circle" :
              "text-dark btn rounded-circle btn-cta-default bg-white"}>
            {stepThree === "success" ? "✓" : "3"}
          </div>

        </div>

      </div>
      <div className="row mx-auto align-items-center justify-content-center">
        <div className="col-12 d-flex">

          <span className="col col-md-3 col-lg-4 col-xl-4">Information</span>
          <div className="col" />
          <span className="col col-md-5 col-lg-4 col-xl-4 text-center">Schedule</span>
          <div className="col" />
          <span className="col col-md-3 col-lg-4 col-xl-4 text-end">Summary</span>

        </div>
      </div>
    </>
  )


}

StepProgress.propTypes = {
  stepOne: PropTypes.string.isRequired,
  stepTwo: PropTypes.string.isRequired,
  stepThree: PropTypes.string.isRequired,
};


export default StepProgress;