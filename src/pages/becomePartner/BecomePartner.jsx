import { useEffect, useState } from 'react';
import style from './BecomePartner.module.css';
import AddTheater from './components/addTheater/AddTheater';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import TermsNConditions from './components/addTheater/config/TermsNConditions';

const BecomePartner = () => {
  const [agreed, setAgreed] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded?.role === 'USER' || decoded?.role === 'OWNER') {
        navigate('/become-partner');
      } else {
        navigate('/')
      }
    } else {
      navigate('/');
    }
  }, [])

  const handleNext = () => {
    if (agreed) {
      setHasSubmitted(true);
    }
  }
  return (
    <div className={style.main_becomePartner}>
      {!hasSubmitted ? (
        <div className={style.tncContainer}>
          <h1>Terms and Conditions to Become a Partner</h1>
          <TermsNConditions />

          <hr></hr>
          <div className={style.formBottom}>
            <label>
              <span>
                <input type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
              </span>
              <span><p>By checking the box "I agree to the Theater Partner Terms and Conditions," you acknowledge that you have read, understood, and accepted all the terms outlined above.</p></span>
            </label>

            <button
              onClick={() => { handleNext() }}
              disabled={!agreed}
            >
              Next
            </button>
          </div>

        </div>
      ) : (
        <AddTheater />
      )}
    </div>
  )
}

export default BecomePartner