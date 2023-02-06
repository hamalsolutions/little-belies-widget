
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { PropTypes } from "prop-types";


export function HearthBeat({setModalHearthbeat}){

  return(
    <div className="lb-modal-overlay-addons" >
    <div className="lb-modal-addons rounded-3">
      <button
        className="closeTermsButton btn btn-link m-0 p-0"
        onClick={(e) => setModalHearthbeat(false)}
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
                Some moments come once in a lifetime, and they should never be forgotten.
                Recording the baby's heartbeat builds connection and strengthens the bond with baby.
                Our beautiful, high-quality stuffed animals come with a 20-second recording of the baby's heartbeat that can be cherished forever.
              </p>
            </div>
          </div>
        </>
      </div>
      <div className="lb-modal-footer-addons lb-text-center ">
        <button className="btn btn-cta-active rounded-pill px-3 mx-auto"
          onClick={(e) => setModalHearthbeat(false)}
          style={{ cursor: "pointer" }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
  )
  }

  HearthBeat.propTypes = {
    setModalHearthbeat: PropTypes.func.isRequired,
  };

  export default HearthBeat;