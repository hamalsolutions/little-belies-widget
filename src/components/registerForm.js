import React, { useEffect } from "react"
import { PropTypes } from "prop-types";
import Select from "react-select";
import BabyGrow from "./modals/babyGrow";
import HearthBeat from "./modals/hearthBeat";
import RealisticView from "./modals/8kRealisticView";
import Terms from "./modals/terms";

function RegisterForm({
  state,
  setState,
  params,
  weeks,
  watch,
  setValue,
  services,
  selectedOptionAddons,
  control,
  register,
  handleSubmit,
  errors,
  Controller,
  onFormSubmit,
  onChangeServices,
  handleAddonsSelected,
  width,
  addOns,
  hoverIndexBabyGrow,
  hoverIndexHearthbeat,
  hoverIndex8kRealisticView,
  modalHearthbeat,
  setModalHearthbeat,
  modalBabyGrow,
  setModalBabyGrow,
  modal8kRealisticView,
  setModal8kRealisticView,
  setClickButtonForm,
}) {
  const selectedWeeks = watch ? watch("weeks") : null;
  const selectedWeekNum =
    selectedWeeks?.value != null && selectedWeeks.value !== "I don't know"
      ? parseInt(selectedWeeks.value, 10)
      : null;
  const filteredServices =
    selectedWeekNum != null && !Number.isNaN(selectedWeekNum)
      ? services
          .map((group) => ({
            ...group,
            options: (group.options || []).filter(
              (opt) => {
                const startWeek = parseInt(opt.start_week, 10);
                const endWeek = parseInt(opt.end_week, 10);
                const hasStart = !Number.isNaN(startWeek);
                const hasEnd = !Number.isNaN(endWeek);

                if (hasStart && hasEnd) {
                  return selectedWeekNum >= startWeek && selectedWeekNum <= endWeek;
                }
                if (hasStart) {
                  return selectedWeekNum >= startWeek;
                }
                if (hasEnd) {
                  return selectedWeekNum <= endWeek;
                }
                return true;
              }
            ),
          }))
          .filter((group) => group.options.length > 0)
      : services;
  const hasFilteredServices =
    filteredServices.length > 0 &&
    filteredServices.some((g) => (g.options || []).length > 0);

  useEffect(() => {
    if (!setValue || selectedWeekNum == null) return;
    const currentService = watch ? watch("service") : null;
    if (!currentService?.value) return;
    const inFiltered = filteredServices.some(
      (g) => (g.options || []).some((o) => o.value === currentService.value)
    );
    if (!inFiltered) setValue("service", null);
  }, [selectedWeekNum, filteredServices, watch, setValue]);

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
                  options={filteredServices}
                  placeholder={
                    services.length > 0
                      ? hasFilteredServices
                        ? "Select a service"
                        : "No services available for this week"
                      : "Loading services"
                  }
                  isDisabled={!hasFilteredServices}
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
                  isDisabled={!hasFilteredServices}
                  value={selectedOptionAddons}
                  isSearchable={false}
                  options={addOns}
                  placeholder={
                    services.length > 0
                      ? hasFilteredServices
                        ? "Checkout out our amazing addons"
                        : "Select a week and service first"
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
  state: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  weeks: PropTypes.array.isRequired,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  services: PropTypes.array.isRequired,
  selectedOptionAddons: PropTypes.array,
  control: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  Controller: PropTypes.func.isRequired,
  onFormSubmit :  PropTypes.func.isRequired,
  onChangeServices:  PropTypes.func.isRequired,
  handleAddonsSelected:  PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  addOns: PropTypes.array,
  hoverIndexBabyGrow: PropTypes.bool.isRequired,
  hoverIndexHearthbeat: PropTypes.bool.isRequired,
  hoverIndex8kRealisticView: PropTypes.bool.isRequired,
  modalHearthbeat: PropTypes.bool.isRequired,
  setModalHearthbeat: PropTypes.func.isRequired,
  modalBabyGrow: PropTypes.bool.isRequired,
  setModalBabyGrow: PropTypes.func.isRequired,
  modal8kRealisticView: PropTypes.bool.isRequired,
  setModal8kRealisticView: PropTypes.func.isRequired,
  setClickButtonForm: PropTypes.func.isRequired,
};

export default RegisterForm;