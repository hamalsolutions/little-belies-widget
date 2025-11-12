
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { PropTypes } from "prop-types";

function Terms({setState,state}){

  const hideTerms = () => {
    setState((state) => ({
      ...state,
      displayTerms: false,
    }));
  };

  return (

    <div className="lb-modal-overlay" onClick={hideTerms}>
    <div className="lb-modal rounded">
      <button
        className="closeTermsButton btn btn-link m-0 p-0"
        onClick={hideTerms}
      >
        <FontAwesomeIcon
          className="white-icon"
          size="lg"
          icon={faTimesCircle}
        />
      </button>
      <div className="lb-modal-body py-3 px-4 text-justify ">
        <div className="row px-2 pb-2">
          <div className="col ">
            <h3>Little Bellies Terms of services.</h3>
          </div>
        </div>
        <>
          <p className="px-3 pt-3">
            I am receiving ongoing prenatal care. <br />
            <br />
            I have undergone a medical diagnostic ultrasound
            prescribed by my OB provider in regard to this
            pregnancy. <br />
            <br />I understand that my OB provider ultimately will
            confirm my due date, screen for fetal abnormalities
            and/or any issues/concerns related to my pregnancy.{" "}
            <br />
            <br /> Little Bellies is not a medical provider and will
            not do any of the foregoing. <br />
            <br />I understand that this ultrasound may not last
            more than 25 minutes and will focus on my pelvic area.{" "}
            <br />
            <br />
            I understand that this is a limited non-medical
            ultrasound and does not replace any diagnostic
            ultrasound ordered by my OB provider. <br />
            <br />
            I understand that there is a possibility that the wrong
            gender may be assigned to my baby. <br />
          </p>
          <p className="px-3 pt-3">
            Little Bellies is not a health care provider. Little
            Bellies understands the importance of proper prenatal
            medical care for both the expectant mother and the
            fetus. Therefore, in order to provide our clients with a
            meaningful “keepsake” ultrasound image, Little Bellies
            requires that I: (i) truthfully certify that I am under
            the care of a physician or other health care provider
            for my pregnancy and that I am not obtaining this
            ultrasound as a replacement for, or in lieu of, standard
            prenatal medical care, and (ii) notify my current
            physician or health care provider regarding the keepsake
            ultrasound I receive from Little Bellies.
            <br />
            <br />
            Little Bellies requests that I present to Little Bellies
            an acknowledgement of receipt of this notice, signed by
            my physician or health provider, prior to Little
            Bellies’ performance of the keepsake ultrasound. In the
            event I am unable to notify my physician or health
            provider prior to performance of the keepsake
            ultrasound, I assume sole responsibility for notifying
            him or her as soon as practical following performance of
            the keepsake ultrasound.
            <br />
            <br />
            As further condition to my receiving ultrasound services
            from Little Bellies, I hereby acknowledge, understand
            and agree to the following statements.
            <br />
            <br />
            <ul>
              <li>
                This ultrasound: (i) is an elective non-medical
                procedure that I have voluntarily requested and (ii)
                is not intended to take the place of a diagnostic
                ultrasound or any other test or treatment that has
                been or may be recommended by my physician or
                healthcare provider.
              </li>
              <li>
                Because of its elective, non-medical nature, this
                ultrasound is generally not covered by insurance.
                Therefore, advance payment is required.
              </li>
              <li>
                The technician who performs the ultrasound, while
                qualified to provide such ultrasound services, is
                not a doctor, nurse, or healthcare provider and
                cannot interpret, diagnose medical conditions from,
                or otherwise offer medical advice regarding the
                images produced.
                <b>
                  {" "}
                  This ultrasound will not be read or interpreted by
                  any physician, nurse or other healthcare provider
                  at any time.
                </b>
              </li>
              <li>
                This keepsake ultrasound is intended to provide
                enhanced images for the purpose of my viewing fetal
                movement in utero. The technician will make no
                attempt to guarantee a medically inclusive
                ultrasound or fetal well being.
              </li>
              <li>
                I understand that I am responsible for contacting my
                own healthcare provider if I have any questions
                concerning this keepsake ultrasound or any other
                aspect of my pregnancy.
              </li>
              <li>
                {" "}
                I understand that the quality of the keepsake
                ultrasound and the DVD, or other audio visual media,
                depends upon many factors including: body tissue
                content, developmental stage and fetal position.
              </li>
              <li>
                I understand that Little Bellies does not guarantee
                the quality of the DVD, or other audio visual media,
                or the ability to visualize any characteristics of
                the fetus.
              </li>
              <li>
                I understand that publication, presentation or
                distribution of any video taken during the
                ultrasound session, not provided by Little Bellies,{" "}
                <b> is strictly prohibited. </b>
              </li>
              <li>
                I understand that all the images and video clips
                taken during my session can be used for promotional
                purposes by Little Bellies.
              </li>
              <li>
                I agree to receive E-mail and SMS from Little
                Bellies, as well as surveys, promotional offers and
                marketing.
              </li>
              <li>
                I grant Little Bellies permission to use any content 
                on social media (including Facebook, Instagram, TikTok,
                Twitter/X, YouTube, or other platforms) that references
                or tags Little Bellies, whether posted by me or others.
                This includes all photos, videos, reviews, and posts 
                made before, during, or after my visit. 
                Little Bellies may use this content for marketing,
                advertising, and promotional purposes on its social 
                media accounts, website, or other materials without 
                notice or compensation.
              </li>
              <li>
                I accept to receive the images and videos of my
                session in my E-mail and Smartphone.
              </li>
              <li>As evidenced by my signature below,</li>
            </ul>
            I understand that factors beyond Little Bellies’ control
            may also affect the ability to accurately determine the
            gender of the fetus, and that Little Bellies can provide
            no warranty or guaranty as to the accuracy of any such
            determination. <br />
            <br />
            I further understand and accept the risk that, while
            ultrasound is believed to have no harmful effect on the
            mother or the fetus, future research or other
            information may disclose harmful or adverse effects that
            are presently unknown. <br />
            <br />
            IN CONSIDERATION OF THE SERVICES RENDERED, I AGREE TO
            RELEASE LITTLE BELLIES, ITS AGENTS, AFFILIATES, MEMBERS,
            MANAGERS AND EMPLOYEES FROM ANY AND ALL CLAIMS OR CAUSES
            OF ACTIONS FOR INJURY, HARM, DAMAGE, OR OTHER LIABILITY
            WHICH RESULTS FROM, OR ARE ALLEGED TO HAVE RESULTED
            FROM, THIS KEEPSAKE ULTRASOUND, INCLUDING BUT NOT
            LIMITED TO, THE FAILURE OF A LITTLE BELLIES ULTRASOUND
            TO ACCURATELY DETERMINE FETAL GENDER OR OTHER
            CHARACTERISTICS OR ANOMOLIES AND ANY DAMAGES OR INJURIES
            RESULTING FROM ULTRASOUND WHICH ARE NOT NOW KNOWN TO
            OCCUR. <br />
            <br />
            “I have carefully read this document and by signing at
            the bottom, acknowledge that I fully understand and
            agree to its contents.”
          </p>
          <p className="px-3 pt-3">
            I understand that all the images and video clips taken
            during my session can be used for promotional purposes
            by Little Bellies.
            <br />
            <br />
            I agree to receive E-mail and SMS from Little Bellies,
            as well as surveys, promotional offers and marketing.
            <br />
            <br />
            I accept to receive the images and videos of my session
            in my E-mail and Smartphone.
            <br />
            <br />
            As evidenced by my signature below, I understand that
            factors beyond Little Bellies control may also affect
            the ability to accurately determine the gender of the
            fetus, and that Little Bellies can provide no warranty
            or guaranty as to the accuracy of any such
            determination.
            <br />
            <br />
            I further understand and accept the risk that, while
            ultrasound is believed to have no harmful effect on the
            mother or the fetus, future research or other
            information may disclose harmful or adverse effects that
            are presently unknown.
            <br />
            <br />
          </p>
        </>
      </div>
      <div className="lb-modal-footer lb-text-center ">
        <button className="btn btn-cta-active rounded-pill px-3 mx-auto">
          Close
        </button>
      </div>
    </div>
  </div>
  );


}

Terms.propTypes = {
  setModalBabyGrow: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};


export default Terms;