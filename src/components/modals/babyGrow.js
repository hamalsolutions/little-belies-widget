import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { PropTypes } from "prop-types";


function BabyGrow({setModalBabyGrow}){

return(
  <div className="lb-modal-overlay-addons" >
  <div className="lb-modal-addons rounded-3">
    <button
      className="closeTermsButton btn btn-link m-0 p-0"
      onClick={(e) => setModalBabyGrow(false)}
      style={{ cursor: "pointer" }}
    >
      <FontAwesomeIcon
        className="white-icon"
        size="lg"
        icon={faTimesCircle}
      />
    </button>
    <div className="lb-modal-body-addons py-2 px-4 text-justify">
      <>
        <div className="row mt-2">
          <div className="col-12 m-1 mt-3 py-3 text-center">
            <p style={{ textAlign: 'justify' }}>
              By adding this feature, you'll discover: baby's position in the uterus,
              weeks of pregnancy and estimated due date, baby's measurements and baby hearts activity.
              This add-on doesn't replace a medical study performed by your specialist</p>
          </div>
        </div>
      </>
    </div>
    <div className="lb-modal-footer-addons lb-text-center ">
      <button className="btn btn-cta-active rounded-pill px-3 mx-auto"
        onClick={(e) => setModalBabyGrow(false)}
        style={{ cursor: "pointer" }}
      >
        Close
      </button>
    </div>
  </div>
</div>
)
}


BabyGrow.propTypes = {
  setModalBabyGrow: PropTypes.func.isRequired,
};

export default BabyGrow;