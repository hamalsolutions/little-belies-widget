import React, { useEffect, useState} from "react"
import { PropTypes } from "prop-types";
import Select from "react-select";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller } from "react-hook-form";
import BabyGrow from "./modals/babyGrow";
import HearthBeat from "./modals/hearthBeat";
import RealisticView from "./modals/8kRealisticView";
import Terms from "./modals/terms";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

function RegisterForm({
  scrollParenTop,
  setClientState,
  state,
  setState,
  clientState,
  setLeadState,
  params,
  weeks,
  services,
  selectedOptionAddons,
  setStepOne,
  control,
  register,
  handleSubmit,
  errors,
  setSelectedOptionAddons,
  ultrasounds,
  setAddHeartbeatBuddies,
  setAdd8kRealisticView,
  consultedUltrasounds
}) {

  const [width, setWindowWidth] = useState(0);
  const [sendForm, setSendForm] = useState(false);
  const [fixedServices, setFixedServices] = useState({
    specialPromotion25min: "",
    genderdetermination: "",
    earlypregnancy: "",
    meetyourbaby25: "",
    meetyourbaby15: "",
  });
  const [hoverIndex8kRealisticView, setHoverIndex8kRealisticView] = useState(false);
  const [hoverIndexBabyGrow, setHoverIndexBabyGrow] = useState(false);
  const [hoverIndexHearthbeat, setHoverIndexHearthbeat] = useState(false);
  const [modalBabyGrow, setModalBabyGrow] = useState(false);
  const [modalHearthbeat, setModalHearthbeat] = useState(false);
  const [modal8kRealisticView, setModal8kRealisticView] = useState(false);
  const [clickButtonForm, setClickButtonForm] = useState(false);
  const [addBabysGrowth, setAddBabysGrowth] = useState(false);

  const [seletedService, setSeletedService] = useState(null)
  const [addOns, setAddOns] = useState();

  const addOnsToMeetYourBaby = [
    {
      value: "Heartbeat Buddies",
      label: (
        <div className="d-flex col-12"
        >
          <div className="col-11">
            <span>Heartbeat Buddies</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexHearthbeat(true)}
            onMouseLeave={() => setHoverIndexHearthbeat(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => { setModalHearthbeat(true) }}
            />
          </div>
        </div>
      )
    },
    {
      value: "Baby's Growth",
      label: (
        <div className="col-12 d-flex">
          <div className="col-11">
            <span>Baby's Growth</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexBabyGrow(true)}
            onMouseLeave={() => setHoverIndexBabyGrow(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => setModalBabyGrow(true)}
            />
          </div>
        </div>
      )
    },
    {
      value: "8K Realistic View",
      label: (
        <div className="col-12 d-flex">
          <div className="col-11">
            <span>8K Realistic View</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndex8kRealisticView(true)}
            onMouseLeave={() => setHoverIndex8kRealisticView(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => setModal8kRealisticView(true)}
            />
          </div>
        </div>
      )
    }
  ];
  const addOnsToGenderDetermination = [
    {
      value: "Heartbeat Buddies",
      label: (
        <div className="d-flex col-12"
        >
          <div className="col-11">
            <span>Heartbeat Buddies</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexHearthbeat(true)}
            onMouseLeave={() => setHoverIndexHearthbeat(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => { setModalHearthbeat(true) }}
            />
          </div>
        </div>
      )
    },
    {
      value: "Baby's Growth",
      label: (
        <div className="col-12 d-flex">
          <div className="col-11">
            <span>Baby's Growth</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexBabyGrow(true)}
            onMouseLeave={() => setHoverIndexBabyGrow(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => setModalBabyGrow(true)}
            />
          </div>
        </div>
      )
    }
  ];
  const addOnsToEarlyPregnancy = [
    {
      value: "Heartbeat Buddies",
      label: (
        <div className="d-flex col-12"
        >
          <div className="col-11">
            <span>Heartbeat Buddies</span>
          </div>
          <div className="col-1"
            onMouseOver={() => setHoverIndexHearthbeat(true)}
            onMouseLeave={() => setHoverIndexHearthbeat(false)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faInfo}
              onClick={(e) => setModalHearthbeat(true)}
            />
          </div>
        </div>
      )
    }];

  const groupTextStyles = {
    color: "#AE678C",
    fontSize: width > 1023 ? 18 : 16,
    textTransform: "capitalize",
  };

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }; 

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span style={groupTextStyles}>{data.label}</span>
    </div>
  );

  const showTerms = () => {
    setState((state) => ({
      ...state,
      displayTerms: true,
    }));
  };

  const selectStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        fontSize: width > 1023 ? 16 : 14,
      };
    },
  };

  const translations = {
    en: {
      "Please enter your information": "Please enter your information",
    },
    es: {
      "Please enter your information": "Please enter your information",
    },
  };

  const translate = (text) => {
    const trans = translations[params.get("lang") || "en"];
    return trans[text] || text;
  };
  
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const getBGCombo = (serviceName, servicesArray) => {
    const sessionTypeName = serviceName;
    let purifiedServiceName = "";
    let serviceId = "";
    const regex = /[-.()+\s]/g;

    if (sessionTypeName.toLowerCase().includes("$")) {
      const indexPrice = sessionTypeName.toLowerCase().indexOf("$");
      const remaining = sessionTypeName.toLowerCase().slice(0, indexPrice);
      purifiedServiceName = remaining.replace(regex, "");
    }

    servicesArray.forEach((serviceItem) => {
      if (serviceItem.name.toLowerCase().includes("$")) {
        const indexAddon = serviceItem.name.toLowerCase().indexOf("$");
        const remainingConsulted = serviceItem.name
          .toLowerCase()
          .slice(0, indexAddon);
        const purifiedConsulted = remainingConsulted.replace(regex, "");
        if (purifiedServiceName === purifiedConsulted) {
          serviceId = serviceItem.sessionTypeId;
        }
      }
    });
    return serviceId;
  };

 
  const onFormSubmit = async (data) => {
    scrollParenTop();
    let sessionTypeId = data.service.value;
    let sessionTypeName = data.service.label;

    setClientState((clientState) => ({
      ...clientState,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone.replace(/[^0-9]/gi, ''),
      weeks: data.weeks.label,
      sessionTypeId: sessionTypeId,
      sessionTypeName: sessionTypeName,
      language: state.language,
    }));
    setState((state) => ({
      ...state,
      // step: "addons",
      step: "availability",
    }));

    if (clientState.clientRequestStatus === "loading") {
      return;
    }
    try {
      let clientId = "n/a";
      setClientState((clientState) => ({
        ...clientState,
        clientRequestStatus: "loading",
      }));
      const searchClientsRequest = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          authorization: state.authorization,
          siteid: state.siteId,
        },
      };
      const searchClientsResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/clients/clients?searchText=${data.phone.replace(/[^0-9]/gi, '')}`,
        searchClientsRequest
      );
      const searchClientsData = await searchClientsResponse.json();
      if (searchClientsResponse.ok) {

        setSendForm(true)

        if (
          data.firstName + " " + data.lastName ===
          searchClientsData.clients[0].name &&
          searchClientsData.clients[0].email === data.email &&
          searchClientsData.clients[0].phone.replace(/[^0-9]/gi, '') === data.phone.replace(/[^0-9]/gi, '')
        ) {
          setClientState((clientState) => ({
            ...clientState,
            clientRequestStatus: "CLIENT-FOUND",
            clientObject: searchClientsData.clients[0],
            searchResults: searchClientsData.clients,
          }));
          clientId = searchClientsData.clients[0].clientId;
        } else {
          setClientState((clientState) => ({
            ...clientState,
            clientRequestStatus: "CLIENT-FOUND-DIFFERENT",
            clientObject: searchClientsData.clients[0],
            searchResults: searchClientsData.clients,
          }));
          clientId = searchClientsData.clients[0].clientId;
          setLeadState((leadState) => ({
            ...leadState,
            clientFound: false,
          }));
        }
      } else {
        setClientState((clientState) => ({
          ...clientState,
          clientRequestStatus: "CLIENT-NOT-FOUND",
          searchResults: [],
        }));
        setLeadState((leadState) => ({
          ...leadState,
          clientFound: false,
        }));
      }
      const leadPayload = {
        siteId: state.siteId,
        name: data.firstName + " " + data.lastName,
        mobilePhone: data.phone.replace(/[^0-9]/gi, ''),
        email: data.email,
        service: sessionTypeName,
        clientId: clientId === undefined ? "n/a" : clientId,
        dateTime: moment().format("YYYY-MM-DD[T]HH:mm:ss").toString(),
        step: 1,
        language: state.language,
      };
      const leadRequest = {
        method: "POST",
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
          clientFound: true,
          leadRegistered: true,
          partititonKey: leadData.partititonKey,
          orderKey: leadData.orderKey,
        }));
      } else {
        setLeadState((leadState) => ({
          ...leadState,
          clientFound: true,
          leadRegistered: false,
        }));
        console.log("Error registering lead");
        console.error(leadData);
      }
    } catch (error) {
      setState((state) => ({
        ...state,
        status: "error",
        message: "Client request Error: " + JSON.stringify(error.message),
      }));
    }
  };

  const onChangeServices = (service) => {
    setSeletedService(service)
    setAddBabysGrowth(false);
    setAddHeartbeatBuddies(false);
    setAdd8kRealisticView(false)
  };

  const handleAddonsSelected = (e) => {
    const addons = e;
    setSelectedOptionAddons(addons);
    setHoverIndexBabyGrow(false)
    setHoverIndexHearthbeat(false)
    setHoverIndex8kRealisticView(false)
  };

  const handleFixedServices = () => {
    
    const service = {
      specialPromotion25min: seletedService ? seletedService?.label?.toLowerCase().replace(/[-.()+\s]/g, "").search("specialpromotion25min") : "",
      genderdetermination: seletedService ? seletedService?.label?.toLowerCase().replace(/[-.()+\s]/g, "").search("genderdetermination") : "",
      earlypregnancy: seletedService ? seletedService?.label?.toLowerCase().replace(/[-.()+\s]/g, "").search("earlypregnancy") : "",
      meetyourbaby25: seletedService ? seletedService?.label?.toLowerCase().replace(/[-.()+\s]/g, "").search("meetyourbaby25") : "",
      meetyourbaby15: seletedService ? seletedService?.label?.toLowerCase().replace(/[-.()+\s]/g, "").search("meetyourbaby15") : "",
    }
    setFixedServices((fixedServices) => ({
      ...fixedServices,
      specialPromotion25min: service.specialPromotion25min === 0,
      genderdetermination: service.genderdetermination === 0,
      earlypregnancy: service.earlypregnancy === 0,
      meetyourbaby25: service.meetyourbaby25 === 0,
      meetyourbaby15: service.meetyourbaby15 === 0,
    }));
  }
  useEffect(() => {
    handleFixedServices();
  }, [seletedService,services]);

  useEffect(() => {

    if (selectedOptionAddons) {

      let formattingSelectedOptionAddons;

      if (fixedServices.genderdetermination) {

        formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "8K Realistic View" })
        setSelectedOptionAddons(formattingSelectedOptionAddons)

      } else if (fixedServices.earlypregnancy || fixedServices.specialPromotion25min) {

        formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "Baby's Growth" && i.value !== "8K Realistic View" })
        setSelectedOptionAddons(formattingSelectedOptionAddons)

      } else if (fixedServices.meetyourbaby25 || fixedServices.meetyourbaby15) {

        setSelectedOptionAddons(selectedOptionAddons)

      } else {
        setSelectedOptionAddons([])
      }
    }
  }, [seletedService, fixedServices]);

  
  useEffect(() => {

    let babyGrow;
    let hearthbeat;
    let realisticView;

    if (selectedOptionAddons) {
      babyGrow = selectedOptionAddons.find(i => i.value === "Baby's Growth");
      hearthbeat = selectedOptionAddons.find(i => i.value === "Heartbeat Buddies");
      realisticView = selectedOptionAddons.find(i => i.value === "8K Realistic View");
    }

    if (fixedServices.genderdetermination) {

      setAddOns(addOnsToGenderDetermination)

      if (realisticView === undefined) setAdd8kRealisticView(false);

      if (hearthbeat === undefined) {
        setAddHeartbeatBuddies(false)
        addOnsToGenderDetermination[0].label = addOnsToGenderDetermination[0].label;
      } else {
        setAddHeartbeatBuddies(true);
        hearthbeat.label = <span>Heartbeat Buddies</span>;
      }
      if (babyGrow === undefined) {
        setAddBabysGrowth(false)
        addOnsToGenderDetermination[1].label = addOnsToGenderDetermination[1].label;
      } else {
        setAddBabysGrowth(true)
        babyGrow.label = <span>Baby's Growth</span>;
      }

    } else if (fixedServices.meetyourbaby25 || fixedServices.meetyourbaby15) {

      setAddOns(addOnsToMeetYourBaby)

      if (hearthbeat === undefined) {
        setAddHeartbeatBuddies(false)
        addOnsToMeetYourBaby[0].label = addOnsToMeetYourBaby[0].label;
      } else {
        setAddHeartbeatBuddies(true);
        hearthbeat.label = <span>Heartbeat Buddies</span>;
      }
      if (babyGrow === undefined) {
        setAddBabysGrowth(false)
        addOnsToMeetYourBaby[1].label = addOnsToMeetYourBaby[1].label;
      } else {
        setAddBabysGrowth(true)
        babyGrow.label = <span>Baby's Growth</span>;
      }
      if (realisticView === undefined) {
        setAdd8kRealisticView(false)
        addOnsToMeetYourBaby[2].label = addOnsToMeetYourBaby[2].label;
      } else {
        setAdd8kRealisticView(true)
        realisticView.label = <span>8K Realistic View</span>;
      }

    }
    else if (fixedServices.earlypregnancy || fixedServices.specialPromotion25min) {

      setAddOns(addOnsToEarlyPregnancy)

      if (babyGrow === undefined) setAddBabysGrowth(false);

      if (realisticView === undefined) setAdd8kRealisticView(false);

      if (hearthbeat === undefined) {
        setAddHeartbeatBuddies(false)
        addOnsToEarlyPregnancy[0].label = addOnsToEarlyPregnancy[0].label;
      } else {
        setAddHeartbeatBuddies(true);
        hearthbeat.label = <span>Heartbeat Buddies</span>;
      }

    } else {
      setAddHeartbeatBuddies(false)
      setAdd8kRealisticView(false)
      setAddBabysGrowth(false)
      setAddOns([]);
    }

  }, [
    seletedService,
    selectedOptionAddons,
    fixedServices,
    ultrasounds
  ]);

  useEffect(() => {
    let newSessionTypeId = clientState.sessionTypeId;
    let newSessionTypeName = clientState.sessionTypeName;
    const costBabysGrowth = 29; 

    if (fixedServices.meetyourbaby25 && addBabysGrowth) {
      const costMeetYourbaby25 = seletedService.label.match(/(\d+)/g);
      const costMeetYourbaby25PlusBabysGrowth = parseFloat(costMeetYourbaby25[2]) + costBabysGrowth;

      newSessionTypeId = getBGCombo(
        `Meet Your Baby - 25 Min 5D/HD + Baby's Growth $${costMeetYourbaby25PlusBabysGrowth}`,
        consultedUltrasounds
      );
      newSessionTypeName = `Meet Your Baby - 25 Min 5D/HD + Baby's Growth $${costMeetYourbaby25PlusBabysGrowth}`;
    }

    if (fixedServices.meetyourbaby15 && addBabysGrowth) {
      const costMeetYourbaby15 = seletedService.label.match(/(\d+)/g);
      const costMeetYourbaby15PlusBabysGrowth = parseFloat(costMeetYourbaby15[2]) + costBabysGrowth;

      newSessionTypeId = getBGCombo(
        `Meet Your Baby - 15 Min 5D/HD + Baby's Growth $${costMeetYourbaby15PlusBabysGrowth}`,
        consultedUltrasounds
      );
      newSessionTypeName = `Meet Your Baby - 15 Min 5D/HD + Baby's Growth $${costMeetYourbaby15PlusBabysGrowth}`;
    }

    if (fixedServices.genderdetermination && addBabysGrowth) {

      const costGenderDetermination = seletedService.label.match(/(\d+)/g);
      const costGenderPlusBabysGrowth = parseFloat(costGenderDetermination[0]) + costBabysGrowth;

      newSessionTypeId = getBGCombo(
        `Gender Determination  + Baby's Growth - $${costGenderPlusBabysGrowth}  `,
        consultedUltrasounds
      );
      newSessionTypeName = `Gender Determination  + Baby's Growth - $${costGenderPlusBabysGrowth}  `;
    }

    setClientState((clientState) => ({
      ...clientState,
      sessionTypeId: newSessionTypeId,
      sessionTypeName: newSessionTypeName,
    }));
  }, [
    sendForm,
    clientState.sessionTypeName,
    clientState.sessionTypeId,
    addBabysGrowth,
    seletedService,
    fixedServices
  ]);

  useEffect(() => {
    let formattingSelectedOptionAddons;
    if (modalHearthbeat) {
      formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "Heartbeat Buddies" })
      setSelectedOptionAddons(formattingSelectedOptionAddons)
      setAddHeartbeatBuddies(false)
    }
    if (modalBabyGrow) {
      formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "Baby's Growth" })
      setSelectedOptionAddons(formattingSelectedOptionAddons)
      setAddBabysGrowth(false)
    }
    if (modal8kRealisticView) {
      formattingSelectedOptionAddons = selectedOptionAddons.filter((i) => { return i.value !== "8K Realistic View" })
      setSelectedOptionAddons(formattingSelectedOptionAddons)
      setAdd8kRealisticView(false)
    }
  }, [modalBabyGrow, modalHearthbeat, modal8kRealisticView])


  useEffect(() => {
    let val = false;
    if (errors.firstName) {
      val = true;
    }
    if (errors.lastName) {
      val = true;
    }
    if (errors.email) {
      val = true;
    }
    if (errors.phone) {
      val = true;
    }
    if (errors.weeks) {
      val = true;
    }
    if (errors.service) {
      val = true;
    }
    if (errors.temsCheckbox) {
      val = true;
    }
    if (clickButtonForm) {
      if (val) {
        setStepOne("invalid")
      } else {
        setStepOne("success");
      }
    }

  }, [
    errors.firstName,
    errors.lastName,
    errors.email,
    errors.phone,
    errors.weeks,
    errors.service,
    errors.temsCheckbox,
    clickButtonForm
  ])

  return (
    <>
      <form
        className="row my-3 registerForm mx-auto p-md-4 justify-content-center"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <div className="row mb-3">
          <div className="col">
            <h1 className="h4 mt-2 mb-3 text-uppercase text-center">
              {translate("Please enter your information", state.language)}
            </h1>
            <h3 className="h6 fw-normal">
              {" "}
              In order to book an appointment please provide the following
              information
            </h3>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <input
              type="text"
              placeholder="First name"
              className={
                "form-control bg-light-input mb-3" +
                (errors.firstName ? " border-1 is-invalid" : " border-0")
              }
              {...register("firstName", {
                required: true,
                pattern: /^([^0-9]*)$/i,
              })}
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="text"
              placeholder="Last Name"
              className={
                "form-control bg-light-input mb-3" +
                (errors.lastName ? " border-1 is-invalid" : " border-0")
              }
              {...register("lastName", {
                required: true,
                pattern: /^([^0-9]*)$/i,
              })}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input
              type="text"
              placeholder="Email"
              className={
                "form-control bg-light-input mb-3" +
                (errors.email ? " border-1 is-invalid" : " border-0")
              }
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+\.\S+$/i,
              })}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input
              type="tel"
              placeholder="Phone number"
              className={
                "form-control bg-light-input mb-3" +
                (errors.phone ? " border-1 is-invalid" : " border-0")
              }
              {...register("phone", {
                required: true,
                pattern:
                  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/i,
              })}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Controller
              name="weeks"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={weeks}
                  placeholder="Select Pregnancy Weeks"
                  isSearchable={false}
                  className={
                    "dropdown w-100 mb-3" +
                    (errors.weeks ? " is-select-invalid" : "")
                  }
                />
              )}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Controller
              name="service"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={services}
                  placeholder={
                    services.length > 0
                      ? "Select a service"
                      : "Loading services"
                  }
                  isDisabled={!services.length > 0}
                  className={
                    "dropdown w-100 mb-3" +
                    (errors.service ? " is-select-invalid" : "")
                  }
                  formatGroupLabel={formatGroupLabel}
                  styles={selectStyles}
                  isSearchable={false}
                  onChange={(service) => {
                    onChangeServices(service);
                    field.onChange(service);
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Controller
              name="addons"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isDisabled={!services.length > 0}
                  value={selectedOptionAddons}
                  isSearchable={false}
                  options={addOns}
                  placeholder={
                    services.length > 0
                      ? "Checkout out our amazing addons"
                      : "Loading addons"
                  }
                  className="dropdown w-100 mb-3"
                  isMulti
                  onChange={(e) => { handleAddonsSelected(e); field.onChange(e) }}
                />
              )}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col text-left">
            <Controller
              name="temsCheckbox"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-check">
                  <input
                    className={
                      "form-check-input" +
                      (errors.temsCheckbox ? " is-select-invalid" : "")
                    }
                    {...field}
                    type="checkbox"
                  />
                  <label
                    className={
                      "form-check-label mx-2 " +
                      (errors.temsCheckbox ? " text-danger" : "")
                    }
                  >
                    {errors.temsCheckbox && (
                      <>
                        You have to agree to{" "}
                        <button
                          type="button"
                          className="btn btn-link pt-0 px-0 mx-0 mt-0"
                          onClick={showTerms}
                        >
                          {" "}
                          terms and conditions
                        </button>
                      </>
                    )}
                    {!errors.temsCheckbox && (
                      <>
                        Agree to{" "}
                        <button
                          type="button"
                          className="btn btn-link pt-0 px-0 mx-0 mt-0"
                          onClick={showTerms}
                        >
                          {" "}
                          terms and conditions
                        </button>
                      </>
                    )}
                  </label>
                </div>
              )}
            />
          </div>
        </div>

        {hoverIndexBabyGrow && (
          <div
            className={
              hoverIndexBabyGrow
                ? "lb-preview-info-card-visible-baby-grow col-3"
                : "lb-preview-card"
            }
            style={{ fontSize: 13 }}
          >
            <div className="row mt-2">
              <div className="col-12">
                <p style={{ textAlign: 'justify' }} className="px-3 pt-3">
                  By adding this feature, you'll discover: baby's position in the uterus,
                  weeks of pregnancy and estimated due date, baby's measurements and baby hearts activity.
                  This add-on doesn't replace a medical study performed by your specialist</p>
              </div>
            </div>
          </div>
        )}

        {hoverIndexHearthbeat && (
          <div
            className={
              hoverIndexHearthbeat
                ? "lb-preview-info-card-visible-hearthbeat col-3"
                : "lb-preview-card"
            }
            style={{ fontSize: 13 }}
          >
            <div className="row mt-2">
              <div className="col-12">
                <p style={{ textAlign: 'justify' }} className="px-3 pt-3">
                  Some moments come once in a lifetime, and they should never be forgotten.
                  Recording the baby's heartbeat builds connection and strengthens the bond with baby.
                  Our beautiful, high-quality stuffed animals come with a 20-second recording of the baby's heartbeat that can be cherished forever.
                </p>
              </div>
            </div>
          </div>
        )}

        {hoverIndex8kRealisticView && (
          <div
            className={
              hoverIndex8kRealisticView
                ? "lb-preview-info-card-visible-8k-realistic-view col-3"
                : "lb-preview-card"
            }
            style={{ fontSize: 13 }}
          >
            <div className="row mt-2">
              <div className="col-12">
                <p style={{ textAlign: 'justify' }} className="px-3 pt-3">
                  Will show our Mommies and Fathers a hyper-realistic image of what their babies will look like once they are born. We work with the ultrasound images from the session,
                  process them and send them to our clients within 7 business days.
                </p>
              </div>
            </div>
          </div>
        )}

        {state.displayTerms && (
          <Terms setState={setState} state={state}/>
        )}

        {modalHearthbeat && (
          <HearthBeat setModalHearthbeat={setModalHearthbeat} />
        )}
        {modalBabyGrow && (
         <BabyGrow setModalBabyGrow={setModalBabyGrow}/>
        )}
        {modal8kRealisticView && (
          <RealisticView setModal8kRealisticView={setModal8kRealisticView}/>
        )}

        <div className="row my-3">
          <div className="col text-center">
            <button
              type="submit"
              className="btn btn-cta-active rounded-pill px-3 mx-auto"
              onClick={() => setClickButtonForm(true)}
            >
              Check availabilities
            </button>
          </div>
        </div>
      </form>
    </>

  );
}

RegisterForm.propTypes = {
  scrollParenTop: PropTypes.func.isRequired,
  setClientState: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  clientState: PropTypes.object.isRequired,
  setLeadState: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  weeks: PropTypes.array.isRequired,
  services: PropTypes.array.isRequired,
  selectedOptionAddons: PropTypes.array,
  setStepOne: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setSelectedOptionAddons: PropTypes.func.isRequired,
  ultrasounds: PropTypes.array.isRequired,
  setAddHeartbeatBuddies: PropTypes.func.isRequired,
  setAdd8kRealisticView: PropTypes.func.isRequired,
  consultedUltrasounds: PropTypes.array.isRequired,
};

export default RegisterForm;