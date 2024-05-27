import React, { useEffect } from "react"
import { PropTypes } from "prop-types";
import DatePicker from "react-horizontal-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

function SelectTimeAppointment({
  setStepTwo,
  previousStep,
  state,
  availableBlocks,
  setState,
  firstLoad,
  setSelectBlock,
  leadState,
  setLeadState,
  scrollParenTop,
  selectedBlock
}) {


  const handleAvailabilityBlockSelect = async (block) => {    
    setState((state) => ({
      ...state,
      block: block,
    }));

    setSelectBlock(block.startDateTime);

    try {
      if (leadState.leadRegistered) {
        const leadPayload = {
          partitionKey: leadState.partititonKey,
          orderKey: leadState.orderKey,
          dateTimeSeleted: block.startDateTime,
          step: 2,
        };
        const leadRequest = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: state.authorization,
            siteid: state.siteId,
          },
          body: JSON.stringify(leadPayload),
        };
        const leadResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/book/clients`,
          leadRequest
        );
        const leadData = await leadResponse.json();
        if (leadResponse.ok) {
          setLeadState((leadState) => ({
            ...leadState,
            leadUpdate: true,
          }));
        } else {
          setLeadState((leadState) => ({
            ...leadState,
            leadUpdate: true,
          }));
          console.error(leadData);
        }
      };

    } catch (error) {
      console.error(error);
    }

  };

  const onSelectedDay = (val) => {
    setStepTwo("default")
    if (
      moment(val).format("MM/DD/YYYY").toString() ===
      moment(state.startDate).format("MM/DD/YYYY").toString()
    ) {
      return;
    }
    setState((state) => ({
      ...state,
      startDate: moment(val).format("MM/DD/YYYY").toString(),
    }));
  };

  useEffect(() => {
    const nextDay = moment(state.startDate)
      .add(1, "days")
      .format("MM/DD/YYYY")
      .toString();
    if (availableBlocks.length === 0 && !firstLoad) {
      setTimeout(() => {
        onSelectedDay(nextDay);
      }, 500);
    }
  }, [availableBlocks]);

  const blockSelected = async () => {
    scrollParenTop();

    setStepTwo("success")

    setState((state) => ({
      ...state,
      step: "summary",
    }));

    try {
      if (leadState.leadRegistered) {
        const leadPayload = {
          partitionKey: leadState.partititonKey,
          orderKey: leadState.orderKey,
          dateTimeSeleted: selectedBlock,
          step: 3,
        };
        const leadRequest = {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            authorization: state.authorization,
            siteid: state.siteId,
          },
          body: JSON.stringify(leadPayload),
        };

        const leadResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/book/clients`,
          leadRequest
        );

        const leadData = await leadResponse.json();
        if (leadResponse.ok) {
          setLeadState((leadState) => ({
            ...leadState,
            leadUpdate: true,
          }));
        } else {
          setLeadState((leadState) => ({
            ...leadState,
            leadUpdate: true,
          }));
          console.error(leadData);
        }

      };

    } catch (error) {
      console.error(error);
    }

  };

  return (

    <div className="row ">
      <div className="col">
        <div className="row my-3">
          <div className="col d-block d-md-flex justify-content-between">
            <h1 className="h1"> </h1>
            <button
              className="btn btn-cta rounded-pill btn-sm px-3 m-2"
              onClick={() => { setStepTwo("default"); previousStep("availability"); }}
            >
              BACK
            </button>
          </div>
        </div>
        <div className="row my-3">
          <div id="datePicker" className="col">
            <DatePicker
              labelFormat={"MMMM"}
              selectDate={new Date(state.startDate)}
              getSelectedDay={onSelectedDay}
              color="#AE678C"
              endDate={100}
            />
          </div>
        </div>

        {state.availabilityRequestStatus === "ready" &&
          availableBlocks.length >= 1 && (
            <>
              <h1 className="h4">Select time for you appointment:</h1>
              <div className="row my-4 gx-0 mx-auto justify-content-center justify-content-lg-start">
                {availableBlocks.map((block, index) => {
                  return (
                    <div
                      className="col-auto mx-0 d-flex d-sm-block"
                      key={index}
                    >
                      <button
                        className={
                          block.id === state.block.id
                            ? " flex-fill btn btn-selected-block btn-sm rounded-pill px-3 m-2"
                            : " flex-fill btn btn-outline-secondary rounded-pill btn-sm px-3 m-2"
                        }
                        key={block.id}
                        onClick={() => handleAvailabilityBlockSelect(block)}
                      >
                        {block.segment}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="row my-4">
                <div className="col text-center">
                  <button
                    className="btn btn-cta rounded-pill px-3 m-2"
                    disabled={state.block.id === ""}
                    onClick={blockSelected}
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </>
          )}
        {state.availabilityRequestStatus === "ready" &&
          availableBlocks.length === 0 && (
            <div className="row">
              <div className="col text-center">
                <h1 className="h1 mb-3">
                  Sorry, there are no available spaces today
                </h1>
                <h1 className="h3 mb-3">
                  Please select another day on the calendar
                </h1>
              </div>
            </div>
          )}
        {(state.availabilityRequestStatus === "loading" || state.availabilityRequestStatus === "BOOK-APPOINTMENT-OK") && (
          <div className="row">
            <div className="col text-center">
              <h1 className="h1 m-auto">
                <FontAwesomeIcon spin icon={faSpinner} /> Loading
              </h1>
            </div>
          </div>
        )}
        {(state.availabilityRequestStatus === "error" ||
          state.availabilityRequestStatus === "no-data-found") && (
            <h1 className="h1">Error: {state.message}</h1>
          )}
      </div>
    </div>

  )

}

SelectTimeAppointment.propTypes = {
  setStepTwo: PropTypes.func.isRequired,
  previousStep: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  availableBlocks: PropTypes.array.isRequired,
  setState: PropTypes.func.isRequired,
  firstLoad: PropTypes.bool.isRequired,
  setSelectBlock: PropTypes.func.isRequired,
  leadState: PropTypes.object.isRequired,
  setLeadState: PropTypes.func.isRequired,
  scrollParenTop: PropTypes.func.isRequired,
  selectedBlock: PropTypes.string
};


export default SelectTimeAppointment;