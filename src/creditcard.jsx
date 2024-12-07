import React, { useState, useEffect, useRef } from 'react';
import './credit.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faArrowRotateRight, faWifi, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import emailjs from 'emailjs-com';
import { db, auth } from './firebase';
import { collection, addDoc } from "firebase/firestore"; 


const CreditCardPage = () => {
  const [cardInfo, setCardInfo] = useState({
    accountNumber: '',
    sortCode: '',
    expiryMonth: '',
    expiryYear: '',
    name: '',
    ccv: ''
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const focusBorderRef = useRef();
  const user = auth.currentUser;

  useEffect(() => {
    emailjs.init("jY-5dfuTDKsa6PHmRD");
  }, []);

  const updateCardInfo = (key, value) => {
    setCardInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { name, accountNumber, sortCode, expiryMonth, expiryYear, ccv } = cardInfo;
  
    if (!name || !accountNumber || !sortCode || !expiryMonth || !expiryYear || !ccv) {
      alert("Please fill in all fields");
      return;
    }
  
    setIsLoading(true);
  
    try {
      await addDoc(collection(db, "transactions"), {
        buyerId: user?.uid,
        productName: "Example Product", 
        transactionDate: new Date(), 
        paymentDetails: {
          name,
          accountNumber: accountNumber.slice(-4), 
          sortCode,
          expiry: `${expiryMonth}/${expiryYear}`,
          ccv
        }
      });
      
      alert("Transaction saved successfully!");
      sendEmail(); 
    } catch (error) {
      console.error("Error storing transaction:", error);
      alert("Failed to store transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const sendEmail = async () => {
    try {
      const templateParams = {
        to_name: cardInfo.name,
        to_email: user?.email, 
        from_name: "Tarak market",
        message: `Thank you for your purchase! Your payment has been processed successfully.
                 Transaction details:
                 - Card ending in: ${cardInfo.accountNumber.slice(-4)}
                 - Date: ${new Date().toLocaleDateString()}`,
      };

      const response = await emailjs.send(
        'service_1duzpuv',
        'template_df4dyf4',
        templateParams,
        'xzV65KalpYhKR_ODZ'
      );

      console.log('Email sent successfully!', response);
      alert('Purchase confirmation email sent!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Email send error:', error);
      alert('Failed to send confirmation email. Please contact support.');
    }
  };

  const cancelSubmit = () => {
    setIsSubmitted(false);
  };

  const flipCard = () => {
    setIsFlipped(prev => !prev);
  };

  const formatAccountNumber = () => {
    setCardInfo(prev => ({
      ...prev,
      accountNumber: prev.accountNumber.replace(/\s+/g, '').match(/.{1,4}/g)?.join(' ') || prev.accountNumber
    }));
  };

  const formatSortCode = () => {
    setCardInfo(prev => ({
      ...prev,
      sortCode: prev.sortCode.replace(/-/g, '').match(/.{1,2}/g)?.join('-') || prev.sortCode
    }));
  };

  return (
    <div className='creditpage'>
      <div className="pageWrap">
        <div className={`card ${isFlipped ? 'flip' : ''}`} id="card">
          <button className="cancel-btn" id="cancel-btn" onClick={cancelSubmit}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
          <button className="flip-btn" id="flip-btn" onClick={flipCard}>
            <FontAwesomeIcon icon={faArrowRotateRight} />
          </button>

          <div className="cardfront">
            <FontAwesomeIcon icon={faWifi} />
            <FontAwesomeIcon icon={faCcVisa} className="visa" />
            <div className="Debit">Debit</div>
            <div className="chip"></div>
            <div className="card-section" id="account-number-display">
              {cardInfo.accountNumber || '1234 5678 9012 3456'}
            </div>
            <div className="card-section" id="name-display">
              {cardInfo.name || 'John Doe'}
            </div>
          </div>

          <div className="cardback">
            <div className="card-section" id="sort-code-display">
              {cardInfo.sortCode || '12-34-56'}
            </div>
            <div className="expiry-date-display-wrap">
              <span>exp<br />end</span>
              <div className="card-section" id="expiry-date-display">
                {`${cardInfo.expiryMonth.padStart(2, '0')}/${cardInfo.expiryYear.padStart(2, '0')}` || '12/24'}
              </div>
            </div>
            <div className="card-section" id="ccv-display">
              {cardInfo.ccv || '123'}
            </div>
            <div className="strip"></div>
          </div>
        </div>

        <div className="inputs">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={cardInfo.name}
            onChange={e => updateCardInfo('name', e.target.value)}
          />
          
          <label htmlFor="account-number">Account Number</label>
          <input
            type="text"
            id="account-number"
            maxLength="19"
            value={cardInfo.accountNumber}
            onChange={e => updateCardInfo('accountNumber', e.target.value)}
            onBlur={formatAccountNumber}
          />
          
          <label htmlFor="sort-code">Sort Code</label>
          <input
            type="text"
            id="sort-code"
            maxLength="8"
            value={cardInfo.sortCode}
            onChange={e => updateCardInfo('sortCode', e.target.value)}
            onBlur={formatSortCode}
          />
          
          <div className="dateCCV">
            <div className="date">
              <label htmlFor="expiry-month">Expiry MM/YY</label>
              <input
                type="text"
                id="expiry-month"
                maxLength="2"
                value={cardInfo.expiryMonth}
                onChange={e => updateCardInfo('expiryMonth', e.target.value)}
              />
              <input
                type="text"
                id="expiry-year"
                maxLength="2"
                value={cardInfo.expiryYear}
                onChange={e => updateCardInfo('expiryYear', e.target.value)}
              />
            </div>
            <div className="CCV">
              <label htmlFor="ccv">CCV</label>
              <input
                type="text"
                id="ccv"
                maxLength="3"
                value={cardInfo.ccv}
                onChange={e => updateCardInfo('ccv', e.target.value)}
              />
            </div>
          </div>

          <button 
            className="submit-btn" 
            id="submit-btn" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Submit'}
          </button>
        </div>

        <div className="focus-border" id="focus-border" ref={focusBorderRef}></div>
      </div>
    </div>
  );
};

export default CreditCardPage;
