import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { PropTypes } from "prop-types";


export function RealisticView({setModal8kRealisticView}){

  return(
    <div className="lb-modal-overlay-addons" >
    <div className="lb-modal-addons rounded-3">
      <button
        className="closeTermsButton btn btn-link m-0 p-0"
        onClick={(e) => setModal8kRealisticView(false)}
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
                Will show our Mommies and Fathers a hyper-realistic image of what their babies will
                look like once they are born. We work with the ultrasound images from the session,
                process them and send them to our clients within 7 business days.</p>
            </div>
          </div>
        </>
      </div>
      <div className="lb-modal-footer-addons lb-text-center ">
        <button className="btn btn-cta-active rounded-pill px-3 mx-auto"
          onClick={(e) => setModal8kRealisticView(false)}
          style={{ cursor: "pointer" }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
  )
  }

  RealisticView.propTypes = {
    setModal8kRealisticView: PropTypes.func.isRequired,
  };

  export default RealisticView;