import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const TransportForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: true
  });

  // Form state
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterPhone: '',
    busRoute: '',
    incidentDate: '',
    incidentTime: '',
    issueType: '',
    description: '',
    severity: '',
    additionalNotes: ''
  });

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyiikADJd5LCVGM9_K17uyl778_dkClT_vJrX_Dldw_TnV5j5QnAaK7MokQGh9lb3Hu/exec';

  // Extract name from email
  const extractNameFromEmail = (email) => {
    let name = email.split('@')[0];
    name = name.replace(/[^a-zA-Z]/g, ' ');
    name = name.replace(/\b\w/g, l => l.toUpperCase());
    return name.trim() || 'User';
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(false);
    setIsLoggingIn(true);

    const loginPayload = {
      action: "login",
      email: loginData.email,
      password: loginData.password
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });

      setTimeout(() => {
        const validDomains = ["jainuniversity.ac.in"];
        const domain = loginData.email.split('@')[1];
        
        if (validDomains.includes(domain)) {
          const extractedName = extractNameFromEmail(loginData.email);
          setUserEmail(loginData.email);
          setUserName(extractedName);
          setFormData(prev => ({ ...prev, reporterName: extractedName }));
          setIsLoggedIn(true);
          setIsLoggingIn(false);
        } else {
          setLoginError(true);
          setIsLoggingIn(false);
        }
      }, 2000);
    } catch (error) {
      setLoginError(true);
      setIsLoggingIn(false);
      console.error('Login Error:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserName('');
    setLoginData({ email: '', password: '', remember: true });
    setFormData({
      reporterName: '',
      reporterPhone: '',
      busRoute: '',
      incidentDate: '',
      incidentTime: '',
      issueType: '',
      description: '',
      severity: '',
      additionalNotes: ''
    });

    const logoutPayload = {
      action: "logout",
      email: userEmail || "unknown"
    };

    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logoutPayload),
    }).catch(error => console.error('Logout error:', error));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(false);
    setErrorMessage('');
    setIsSubmitting(true);

    const requiredFields = ['reporterName', 'reporterPhone', 'busRoute', 'incidentDate', 'issueType', 'description', 'severity'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    const timestamp = new Date().toISOString();
    const submissionData = {
      action: "submitReport",
      timestamp: timestamp,
      reportType: "Transport Issues",
      reporterEmail: userEmail,
      ...formData
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      setSuccessMessage(true);
      setIsSubmitting(false);
      
      const reporterName = formData.reporterName;
      setFormData({
        reporterName,
        reporterPhone: '',
        busRoute: '',
        incidentDate: '',
        incidentTime: '',
        issueType: '',
        description: '',
        severity: '',
        additionalNotes: ''
      });
    } catch (error) {
      setErrorMessage('Error submitting form. Please try again.');
      setIsSubmitting(false);
      console.error('Error:', error);
    }
  };

  // CSS Styles (same as Lost.js)
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '3rem 1rem',
      backgroundImage: 'linear-gradient(180deg, #16213e 0%, #0f3460 100%)'
    },
    formContainer: {
      maxWidth: '700px',
      margin: '0 auto',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '3rem',
      border: '1px solid #e2e8f0'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: 'rgba(255,255,255,0.9)',
      marginBottom: '0'
    },
    loginHeading: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '2rem',
      textAlign: 'center'
    },
    sectionDivider: {
      height: '1px',
      backgroundColor: '#e2e8f0',
      margin: '2.5rem 0',
      opacity: '0.6'
    },
    message: {
      padding: '1.25rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    successMessage: {
      backgroundColor: '#f0fff4',
      color: '#22543d',
      border: '1px solid #68d391'
    },
    errorMessage: {
      backgroundColor: '#fed7d7',
      color: '#742a2a',
      border: '1px solid #fc8181'
    },
    formGroup: {
      marginBottom: '2rem',
      position: 'relative'
    },
    row: {
      display: 'flex',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    colHalf: {
      flex: '1'
    },
    floatLabel: {
      position: 'relative',
      marginBottom: '0'
    },
    input: {
      width: '100%',
      padding: '1rem 1.25rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 4px rgba(66, 153, 225, 0.1)',
      transform: 'translateY(-1px)'
    },
    label: {
      position: 'absolute',
      left: '1.25rem',
      top: '1rem',
      fontSize: '1rem',
      color: '#718096',
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
      backgroundColor: 'white',
      padding: '0 0.5rem'
    },
    labelActive: {
      top: '-0.75rem',
      fontSize: '0.8rem',
      color: '#4299e1',
      fontWeight: '600'
    },
    labelRequired: {
      display: 'block',
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.75rem',
      letterSpacing: '0.025em'
    },
    select: {
      width: '100%',
      padding: '1rem 1.25rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '1rem 1.25rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: 'white',
      outline: 'none',
      resize: 'vertical',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      minHeight: '120px'
    },
    button: {
      width: '100%',
      padding: '1rem 2rem',
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginTop: '1rem'
    },
    buttonHover: {
      backgroundColor: '#3182ce',
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px rgba(66, 153, 225, 0.3)'
    },
    buttonDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed',
      transform: 'none'
    },
    rememberMe: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem',
      marginTop: '0.5rem'
    },
    forgotPassword: {
      textAlign: 'right',
      marginBottom: '2rem'
    },
    link: {
      color: '#4299e1',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    footer: {
      textAlign: 'center',
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: '1px solid #e2e8f0',
      fontSize: '0.9rem',
      color: '#718096'
    },
    checkbox: {
      width: '1.1rem',
      height: '1.1rem',
      accentColor: '#4299e1'
    }
  };

  const FloatingLabelInput = ({ type, id, value, onChange, placeholder, required, label }) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    useEffect(() => {
      setHasValue(value && value.length > 0);
    }, [value]);

    const isActive = focused || hasValue;

    return (
      <div style={styles.floatLabel}>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...styles.input,
            ...(focused ? styles.inputFocus : {})
          }}
          required={required}
        />
        <label 
          htmlFor={id}
          style={{
            ...styles.label,
            ...(isActive ? styles.labelActive : {})
          }}
        >
          {label} {required && '*'}
        </label>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Add keyframes for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input:focus, select:focus, textarea:focus {
            border-color: #4299e1 !important;
            box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.1) !important;
            transform: translateY(-1px);
          }
          
          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(66, 153, 225, 0.3);
          }
        `}
      </style>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Transport Issues Report</h1>
        <p style={styles.subtitle}>Report transport-related problems and incidents</p>
      </div>

      {!isLoggedIn ? (
        /* Login Container */
        <div style={styles.formContainer}>
          {loginError && (
            <div style={{...styles.message, ...styles.errorMessage}}>
              <AlertCircle size={20} style={{marginRight: '0.75rem'}} />
              Invalid login credentials. Please try again.
            </div>
          )}

          <h2 style={styles.loginHeading}>Login to continue</h2>

          <div>
            <div style={{marginBottom: '2rem'}}>
              <FloatingLabelInput
                type="email"
                id="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                label="Email"
                required={true}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <FloatingLabelInput
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                label="Password"
                required={true}
              />
            </div>

            <div style={styles.rememberMe}>
              <input
                type="checkbox"
                id="remember"
                checked={loginData.remember}
                onChange={(e) => setLoginData(prev => ({ ...prev, remember: e.target.checked }))}
                style={styles.checkbox}
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            <div style={styles.forgotPassword}>
              <a href="#" style={styles.link}>Forgot password?</a>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              style={{
                ...styles.button,
                ...(isLoggingIn ? styles.buttonDisabled : {})
              }}
              onMouseOver={(e) => !isLoggingIn && Object.assign(e.target.style, styles.buttonHover)}
              onMouseOut={(e) => !isLoggingIn && Object.assign(e.target.style, {backgroundColor: styles.button.backgroundColor, transform: 'none', boxShadow: 'none'})}
            >
              {isLoggingIn ? (
                <>
                  <div style={styles.spinner}></div>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Form Container */
        <div style={styles.formContainer}>
          {successMessage && (
            <div style={{...styles.message, ...styles.successMessage}}>
              <CheckCircle size={20} style={{marginRight: '0.75rem'}} />
              Your transport issue report has been submitted successfully!
            </div>
          )}

          {errorMessage && (
            <div style={{...styles.message, ...styles.errorMessage}}>
              <AlertCircle size={20} style={{marginRight: '0.75rem'}} />
              {errorMessage}
            </div>
          )}

          <div>
            {/* Reporter Information Section */}
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#2d3748', marginBottom: '1.5rem', marginTop: '0'}}>
              Reporter Information
            </h3>
            
            <div style={styles.row}>
              <div style={styles.colHalf}>
                <FloatingLabelInput
                  type="text"
                  id="reporter-name"
                  value={formData.reporterName}
                  onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                  label="Your Name"
                  required={true}
                />
              </div>
              <div style={styles.colHalf}>
                <FloatingLabelInput
                  type="tel"
                  id="reporter-phone"
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, reporterPhone: e.target.value }))}
                  label="Your Phone Number"
                  required={true}
                />
              </div>
            </div>

            {/* Bus Route */}
            <div style={styles.formGroup}>
              <label htmlFor="bus-route" style={styles.labelRequired}>
                Bus Route/Number *
              </label>
              <select
                id="bus-route"
                value={formData.busRoute}
                onChange={(e) => setFormData(prev => ({ ...prev, busRoute: e.target.value }))}
                style={styles.select}
                required
              >
                <option value="">Select bus route</option>
                <option value="Route 1A - Banashankari">Route 1A - Banashankari</option>
                <option value="Route 2B - Jayanagar">Route 2B - Jayanagar</option>
                <option value="Route 3C - Electronic City">Route 3C - Electronic City</option>
                <option value="Route 4D - Whitefield">Route 4D - Whitefield</option>
                <option value="Route 5E - Hebbal">Route 5E - Hebbal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.sectionDivider}></div>

            {/* Incident Details Section */}
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#2d3748', marginBottom: '1.5rem'}}>
              Incident Details
            </h3>

            {/* Date and Time */}
            <div style={styles.row}>
              <div style={styles.colHalf}>
                <div style={styles.formGroup}>
                  <label htmlFor="incident-date" style={styles.labelRequired}>
                    Date of Incident *
                  </label>
                  <input
                    type="date"
                    id="incident-date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
                    style={styles.input}
                    required
                  />
                </div>
              </div>
              <div style={styles.colHalf}>
                <div style={{marginBottom: '2rem'}}>
                  <FloatingLabelInput
                    type="time"
                    id="incident-time"
                    value={formData.incidentTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, incidentTime: e.target.value }))}
                    label="Time of Incident"
                    required={false}
                  />
                </div>
              </div>
            </div>

            {/* Issue Type and Severity */}
            <div style={styles.row}>
              <div style={styles.colHalf}>
                <div style={styles.formGroup}>
                  <label htmlFor="issue-type" style={styles.labelRequired}>
                    Type of Issue *
                  </label>
                  <select
                    id="issue-type"
                    value={formData.issueType}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueType: e.target.value }))}
                    style={styles.select}
                    required
                  >
                    <option value="">Select issue type</option>
                    <option value="Bus Breakdown">Bus Breakdown</option>
                    <option value="Late Arrival">Late Arrival</option>
                    <option value="No Show">Bus Did Not Arrive</option>
                    <option value="Driver Behavior">Driver Behavior Issue</option>
                    <option value="Safety Concern">Safety Concern</option>
                    <option value="Overcrowding">Overcrowding</option>
                    <option value="Route Change">Unexpected Route Change</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div style={styles.colHalf}>
                <div style={styles.formGroup}>
                  <label htmlFor="severity" style={styles.labelRequired}>
                    Issue Severity *
                  </label>
                  <select
                    id="severity"
                    value={formData.severity}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                    style={styles.select}
                    required
                  >
                    <option value="">Select severity</option>
                    <option value="Low">Low - Minor inconvenience</option>
                    <option value="Medium">Medium - Significant delay/issue</option>
                    <option value="High">High - Major disruption/safety concern</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label htmlFor="description" style={styles.labelRequired}>
                Description of Issue *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                style={styles.textarea}
                placeholder="Please provide detailed description of the transport issue..."
                required
              />
            </div>

            <div style={styles.sectionDivider}></div>

            {/* Additional Information Section */}
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', color: '#2d3748', marginBottom: '1.5rem'}}>
              Additional Information
            </h3>

            {/* Additional Notes */}
            <div style={styles.formGroup}>
              <label htmlFor="additional-notes" style={styles.labelRequired}>
                Additional Notes
              </label>
              <textarea
                id="additional-notes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                rows={3}
                style={styles.textarea}
                placeholder="Any additional information or suggestions..."
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : {})
              }}
              onMouseOver={(e) => !isSubmitting && Object.assign(e.target.style, styles.buttonHover)}
              onMouseOut={(e) => !isSubmitting && Object.assign(e.target.style, {backgroundColor: styles.button.backgroundColor, transform: 'none', boxShadow: 'none'})}
            >
              {isSubmitting ? (
                <>
                  <div style={styles.spinner}></div>
                  Submitting Report...
                </>
              ) : (
                'Submit Transport Issue Report'
              )}
            </button>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={{marginBottom: '1rem', fontWeight: '500'}}>
              All fields marked with an asterisk (*) are required.
            </p>
            <p style={{margin: '0'}}>
              <button
                onClick={handleLogout}
                style={{...styles.link, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}
              >
                Logout from {userName}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportForm;