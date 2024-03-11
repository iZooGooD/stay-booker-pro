import { useState } from 'react';
import { Link } from 'react-router-dom';
import { networkAdapter } from 'services/NetworkAdapter';
import { useNavigate } from 'react-router-dom';
import Toast from 'components/ux/toast/Toast';
import { REGISTRATION_MESSAGES } from 'utils/constants';

/**
 * Register Component
 * Renders a registration form that allows new users to create an account.
 * It captures user input for personal information and credentials, submitting these to a registration endpoint.
 * Upon successful registration, the user is notified and redirected to the login page.
 */
const Register = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    firstNameError: false,
    lastNameError: false,
    emailError: false,
    phoneNumberError: false,
    passwordError: false,
    confirmPasswordError: false,
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  /**
   * Updates the form data state with the value of the input field that triggered the change.
   * This function ensures that the component's state reflects the user's input.
   *
   * @param {Object} e - The event object generated by the input field change.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Submits the registration form data to the server.
   * It performs an asynchronous operation to post the form data to a registration endpoint.
   * If registration is successful, a success message is displayed, and the user is redirected to the login page after a brief delay.
   * Otherwise, the user is informed of the failure.
   *
   * @param {Object} e - The event object generated by the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await networkAdapter.put('/api/users/register', formData);

    if (response && response.errors && response.errors.length < 1) {
      setSuccessMessage(REGISTRATION_MESSAGES.SUCCESS);
      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }

    /*
      Firstname input validation
    */
    if (formData.firstName.length < 2) {
      setErrorMessage((prevState) => ({
        ...prevState,
        firstNameError: 'Must be at least 2 characters long',
      }));
      return;
    } else if (/\d/.test(formData.firstName)) {
      setErrorMessage((prevState) => ({
        ...prevState,
        firstNameError: 'The field cannot contain numbers',
      }));
      return;
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        firstNameError: false,
      }));
    }

    /*
      Lastname input validation
    */
    if (formData.lastName.length < 2) {
      setErrorMessage((prevState) => ({
        ...prevState,
        lastNameError: 'Must be at least 2 characters long',
      }));
      return;
    } else if (/\d/.test(formData.lastName)) {
      setErrorMessage((prevState) => ({
        ...prevState,
        lastNameError: 'The field cannot contain numbers',
      }));
      return;
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        lastNameError: false,
      }));
    }

    /*
      Email input validation
    */
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) === false) {
      setErrorMessage((prevState) => ({
        ...prevState,
        emailError: 'Incorrect email adress',
      }));
      return;
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        emailError: false,
      }));
    }

    /*
      Phone number validation
    */
    if (/^\+\d{2}\d{1,2}\d{7,8}$/.test(formData.phoneNumber) === false) {
      setErrorMessage((prevState) => ({
        ...prevState,
        phoneNumberError: 'Incorrect phone number format e.g.(+36302748465)',
      }));
      return;
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        phoneNumberError: false,
      }));
    }

    /*
      Password validator
    */
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password) === false
    ) {
      setErrorMessage((prevState) => ({
        ...prevState,
        passwordError: 'Min. 8 characters, upper and lowercase',
      }));
      return;
    } else if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.confirmPassword) ===
      false
    ) {
      setErrorMessage((prevState) => ({
        ...prevState,
        confirmPasswordError: 'Min. 8 characters, upper and lowercase',
      }));
      return;
    } else if (formData.password !== formData.confirmPassword) {
      setErrorMessage((prevState) => ({
        ...prevState,
        passwordError: "The passwords don't match",
      }));
      return;
    } else {
      setErrorMessage((prevState) => ({
        ...prevState,
        passwordError: false,
        confirmPasswordError: false,
      }));
    }
  };

  return (
    <>
      <div className="register__form">
        <div className="container mx-auto p-4 flex justify-center min-h-[600px] items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-4 shadow-md md:p-10"
          >
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-brand">
                Join the Adventure!
              </h2>
              <p className="text-gray-500">
                Create your account and start your journey with us
              </p>
            </div>
            <div className="flex flex-wrap mb-6 -mx-3">
              <div className="w-full px-3 mb-6 md:w-1/2 md:mb-0">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
                />
              </div>
              {errorMessage.firstNameError && (
                <Toast type="error" message={errorMessage.firstNameError} />
              )}
              <div className="w-full px-3 md:w-1/2">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
                />
              </div>
              {errorMessage.lastNameError && (
                <Toast type="error" message={errorMessage.lastNameError} />
              )}
            </div>
            <div className="mb-6">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
              />
            </div>
            {errorMessage.emailError && (
              <Toast type="error" message={errorMessage.emailError} />
            )}
            <div className="mb-6">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="+36303674565"
                value={formData.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
              />
            </div>
            {errorMessage.phoneNumberError && (
              <Toast type="error" message={errorMessage.phoneNumberError} />
            )}
            <div className="mb-6">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
              />
            </div>
            {errorMessage.passwordError && (
              <Toast type="error" message={errorMessage.passwordError} />
            )}
            <div className="mb-6">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-200 border rounded appearance-none focus:outline-none focus:bg-white"
              />
            </div>
            {errorMessage.confirmPasswordError && (
              <Toast type="error" message={errorMessage.confirmPasswordError} />
            )}
            <div className="flex items-center w-full my-3">
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white rounded bg-brand hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Register
              </button>
            </div>
            <Link
              to="/login"
              className="inline-block w-full text-lg text-center text-gray-500 align-baseline hover:text-blue-800"
            >
              Back to login
            </Link>
            {showSuccess && (
              <Toast type="success" message={successMessage} dismissError />
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
