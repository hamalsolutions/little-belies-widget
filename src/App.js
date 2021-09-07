import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactHorizontalDatePicker from "react-horizontal-strip-datepicker";
// import ReactHorizontalDatePicker from "./components/ReactHorizontalDatePicker";
import "react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css";
// import "./styles/ReactHorizontalDatePicker.css";
import moment from "moment";

const blocks = [
  {
    id: 2,
    segment: "09:00 AM",
    endSegment: "09:30 AM",
    appointment: {},
  },
  {
    id: 3,
    segment: "09:30 AM",
    endSegment: "10:00 AM",
    appointment: {},
  },
  {
    id: 4,
    segment: "10:00 AM",
    endSegment: "10:30 AM",
    appointment: {},
  },
  {
    id: 5,
    segment: "10:30 AM",
    endSegment: "11:00 AM",
    appointment: {},
  },
  {
    id: 6,
    segment: "11:00 AM",
    endSegment: "11:30 AM",
    appointment: {},
  },
  {
    id: 7,
    segment: "11:30 AM",
    endSegment: "12:00 PM",
    appointment: {},
  },
  {
    id: 8,
    segment: "12:00 PM",
    endSegment: "12:30 PM",
    appointment: {},
  },
  {
    id: 9,
    segment: "12:30 PM",
    endSegment: "01:00 PM",
    appointment: {},
  },
  {
    id: 10,
    segment: "01:00 PM",
    endSegment: "01:30 PM",
    appointment: {},
  },
  {
    id: 11,
    segment: "01:30 PM",
    endSegment: "02:00 PM",
    appointment: {},
  },
  {
    id: 12,
    segment: "02:00 PM",
    endSegment: "02:30 PM",
    appointment: {},
  },
  {
    id: 13,
    segment: "02:30 PM",
    endSegment: "03:00 PM",
    appointment: {},
  },
  {
    id: 14,
    segment: "03:00 PM",
    endSegment: "03:30 PM",
    appointment: {},
  },
  {
    id: 15,
    segment: "03:30 PM",
    endSegment: "04:00 PM",
    appointment: {},
  },
  {
    id: 16,
    segment: "04:00 PM",
    endSegment: "04:30 PM",
    appointment: {},
  },
  {
    id: 17,
    segment: "04:30 PM",
    endSegment: "05:00 PM",
    appointment: {},
  },
  {
    id: 18,
    segment: "05:00 PM",
    endSegment: "05:30 PM",
    appointment: {},
  },
  {
    id: 19,
    segment: "05:30 PM",
    endSegment: "06:00 PM",
    appointment: {},
  },
  {
    id: 20,
    segment: "06:00 PM",
    endSegment: "06:30 PM",
    appointment: {},
  },
  {
    id: 21,
    segment: "06:30 PM",
    endSegment: "07:00 PM",
    appointment: {},
  },
  {
    id: 22,
    segment: "07:00 PM",
    endSegment: "07:30 PM",
    appointment: {},
  },
  {
    id: 23,
    segment: "07:30 PM",
    endSegment: "08:00 PM",
    appointment: {},
  },
];

function App() {
  const [state, setState] = useState({
    step: "registerForm",
    status: "IDLE",
    message: "",
    siteId: "549974",
    locationId: "1",
    userName: "Manuelcastro",
    userPassword: "Manuel123!",
    authorization: "",
    startDate: moment(new Date()).toString(),
    block: {},
  });
  const [clientState, setClientState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    weeks: "",
    sessionTypeId: "",
    sessionTypeName: "",
    language: ""
  }); 
  const [availableBlocks, setAvailableBlocks] = useState([]);

  const getAvailability = async () => {
    setState((state) => ({
      ...state,
      status: "loading",
    }));

    try {
      const authPayload = {
        Username: state.userName,
        Password: state.userPassword,
      };
      const authRequest = {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          siteid: state.siteId,
        },
        body: JSON.stringify(authPayload),
      };
      const authResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/userToken/`,
        authRequest
      );
      const authData = await authResponse.json();
      if (authResponse.ok) {
        setState((state) => ({
          ...state,
          authorization: authData.accesssToken,
        }));
        const queryStartDate = moment(state.startDate).format("MM/DD/YYYY").toString();

        const availabilityRequest = {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            siteid: state.siteId,
            authorization: authData.accesssToken,
            locationid: state.locationId,
          },
        };
        const availabilityResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/sites/${state.siteId}/locations/${state.locationId}/schedule?startDate=${queryStartDate}&endDate=${queryStartDate}`,
          availabilityRequest
        );
        const availabilityData = await availabilityResponse.json();
        if (availabilityResponse.ok) {

          const appointmentsRequest = {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              siteid: state.siteId,
              authorization: authData.accesssToken,
              locationid: state.locationId,
            },
          };
          const appointmentsRequestResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/appointments/?appointmentDate=${queryStartDate}`,
            appointmentsRequest
          );
          const appointmentsRequestData = await appointmentsRequestResponse.json();
          if (appointmentsRequestResponse.ok) {
            const rooms = availabilityData.schedule.map((room) => {
              const appointments = [];
              appointmentsRequestData.forEach((appointment) => {
                if (room.id === appointment.staffId) {
                  const mutableAppointment = appointment;
                  const segment = new Date(
                    mutableAppointment.StartDateTime
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  mutableAppointment.segment = segment;
                  appointments.push(mutableAppointment);
                }
              });

              const roomReturn = {
                staffId: room.id,
                staffName: room.name,
                unavailabilities: room.unavailabilities,
                availabilities: room.availabilities,
                roomBlocks: [],
                appointments: appointments,
              };
              return roomReturn;
            });
  
            const displayableRooms = [];
            rooms.forEach(room => {
              const mutableBlocks = [...blocks];
              const availableBlocks = [];
              const roomBlocks = mutableBlocks.map((block) => {
                const mutableBlock = { ...block };
                const addTwelve = mutableBlock.segment.includes("PM");
                const rawHours = parseInt(mutableBlock.segment.split(" ")[0].split(":")[0]);
                const hours = addTwelve && rawHours !== 12 ? rawHours + 12 : rawHours;
                const minutes = parseInt( mutableBlock.segment.split(" ")[0].split(":")[1] );
                const stringDate = moment(state.startDate).format("MM/DD/YYYY").toString();
                const startDateTime = moment(stringDate).add(hours, "hours").add(minutes, "minutes").format("YYYY-MM-DD[T]HH:mm:ss");
                const endDateTime = moment(startDateTime).add(30, "minutes").format("YYYY-MM-DD[T]HH:mm:ss");
                mutableBlock.startDateTime = startDateTime;
                mutableBlock.endDateTime = endDateTime;
                const blockDate = moment(stringDate).add(hours, "hours").add(minutes, "minutes").toString();
                mutableBlock.blockDate = blockDate;
                let available = false;
                room.availabilities.forEach(
                  (availabilityBlock) => {
                    available = available +moment(blockDate).isBetween(availabilityBlock.startDateTime,availabilityBlock.endDateTime,undefined,"[)");
                  }
                );
                room.unavailabilities.forEach(
                  (unavailabilityBlock) => {
                    available = available *!moment(blockDate).isBetween(unavailabilityBlock.startDateTime,unavailabilityBlock.endDateTime,undefined,"[)");
                  }
                );
                const blockAppointment = room.appointments.find(
                  (appointment) =>
                    moment(blockDate).isBetween(
                      appointment.StartDateTime,
                      appointment.endDateTime,
                      undefined,
                      "[)"
                    )
                );
                mutableBlock.appointment =
                blockAppointment === undefined ? {} : blockAppointment;
                mutableBlock.available = Boolean(available);

                if(blockAppointment === undefined && available){
                  availableBlocks.push(mutableBlock);
                }
                
                return mutableBlock;
              });

              const returnRoom = {
                staffId: room.staffId,
                staffName: room.staffName,
                unavailabilities: room.unavailabilities,
                availabilities: room.availabilities,
                roomBlocks: roomBlocks,
                availableBlocks: availableBlocks,
              }
              displayableRooms.push(returnRoom);
            });
            console.log(displayableRooms);

            const availableBlocksForDisplay = [];
            displayableRooms.forEach(room => {
              room.availableBlocks.forEach((block) => {
                const foundedBlock = availableBlocksForDisplay.find(availableBlock => availableBlock.id === block.id);
                if(foundedBlock !== undefined){
                  const mutableBlock = foundedBlock;
                  mutableBlock.staffId.push(room.staffId);
                  mutableBlock.count++;
                }
                else{
                  const mutableBlock = { ...block };
                  mutableBlock.staffId = [room.staffId];
                  mutableBlock.count = 1;
                  availableBlocksForDisplay.push(mutableBlock);
                }
              });
            });
            setAvailableBlocks(availableBlocksForDisplay);
  
            setState((state) => ({
              ...state,
              status: "ready",
            }));
          }
          else {
            setState((state) => ({
              ...state,
              status: "no-data-found",
              message: JSON.stringify(appointmentsRequestData),
            }));
          }          
        } else {
          setState((state) => ({
            ...state,
            status: "no-data-found",
            message: JSON.stringify(availabilityData),
          }));
        }
      } else {
        setState((state) => ({
          ...state,
          status: "no-data-found",
          message: JSON.stringify(authData),
        }));
      }
    } catch (error) {
      setState((state) => ({
        ...state,
        status: "error",
        message: "Onload page Error: " + JSON.stringify(error.message),
      }));
    }
  };

  useEffect(() => {
    getAvailability();
  }, [state.startDate]);

  const onSelectedDay = (d) => {
    if(moment(d).format("MM/DD/YYYY").toString() === moment(state.startDate).format("MM/DD/YYYY").toString()){
      return
    }
    setState((state) => ({
      ...state,
      startDate: moment(d).format("MM/DD/YYYY").toString(),
    }));
  };

  const handleAvailabilityBlockSelect = (block) => {
    setState((state) => ({
      ...state,
      step: "summary",
      block: block,
    }));
  }

  const handleClientFormFilled = () => {
    setState((state) => ({
      ...state,
      step: "availability",
    }));
  }

  const handleClientInfoChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    
    setClientState((clientState) => ({
      ...clientState,
      [name]: value,
    }));
  }

  return (
    <div className="container pt-4">

      {state.step === "registerForm" && (
        <div className="mt-3">
          <div className="row gx-5">
            <div className="col-md-6">
              <h1 className="h3">Please enter your information</h1>
            </div>
          </div>
          <div className="row gx-5">
            <div className="col-md-6">
              <div className="bg-light p-4">
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">First Name</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="firstName" name="firstName" onBlur={handleClientInfoChange}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label" >Last Name</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="lastName" name="lastName" onBlur={handleClientInfoChange} />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label" >Email</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="email" name="email" onBlur={handleClientInfoChange}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label" >Phone number</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="phone" name="phone" onBlur={handleClientInfoChange}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
            <div className="bg-light p-4">
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label" >Weeks</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="weeks" name="weeks" onBlur={handleClientInfoChange}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label" >Language</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="language" name="language" onBlur={handleClientInfoChange}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label" >Service</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" id="sessionTypeName" name="sessionTypeName" onBlur={handleClientInfoChange}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <button type="submit" class="btn btn-primary" onClick={handleClientFormFilled}>Check availabilities</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.step === "availability" && (
        <div className="row mt-3">
            <div className="col">
              <h1 className="h1">Temporary booking online for houston</h1>
              <ReactHorizontalDatePicker selectedDay={onSelectedDay} enableScroll={true} enableDays={50} enableDaysBefore={5}/>
              <br/><br/>
              {state.status === "ready" && (
                <>           
                <h1 className="h4">Only available blocks combined</h1>
                <div className="row my-4">
                  <div className="col">
                    {availableBlocks.map( (block, index) => {
                      return (
                      <button 
                        className={block.available ? "btn btn-success btn-sm m-2" : "btn btn-danger btn-sm m-2"}
                        key={block.id}
                        onClick={() => handleAvailabilityBlockSelect(block)}
                        > 
                        {block.segment+", "+block.count} 
                      </button>)
                    })}
                  </div>
                </div>
                </>
              )}  
              {state.status === "loading" && (
                <h1 className="h1">Loading...</h1>
              )}
              {(state.status === "error" || state.status === "no-data-found") && (
                <h1 className="h1">Error: {state.message}</h1>
              )}
            </div>        
        </div>
      )}

      {state.step === "summary" && (
        <div className="mt-3">
          <div className="row gx-5">
              <div className="col-md-6">
                <h1 className="h3">Your booking information</h1>
              </div>
            </div>
          <div className="row gx-5">
            <div className="col-md-6 bg-light p-4">
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">First Name</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={clientState.firstName}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Last Name</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={clientState.lastName}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Email</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={clientState.email}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Phone number</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={clientState.phone}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Weeks</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={clientState.weeks}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Language</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={clientState.language}/>
                  </div>
                </div>
            </div>
            <div className="col-md-6 bg-light p-4">
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Appointment date</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={state.block.blockDate}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">StaffId</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={state.block.staffId[0]}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label">Service</label>
                  <div className="col-sm-8">
                    <input type="text" className="form-control" readOnly value={clientState.sessionTypeName}/>
                  </div>
                </div>
                <div className="mb-3 row">
                  <button type="submit" class="btn btn-primary" onClick={handleClientFormFilled}>Book your appointment</button>
                </div>
            </div>
          </div>  
        </div>
      )}
    </div>
  );
}

export default App;
