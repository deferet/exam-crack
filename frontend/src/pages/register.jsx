import { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch("http://localhost:4000/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setError(Object.values(result.errors).join(", "));
        } else {
          setError("Something went wrong");
        }
        return;
      }

      setSuccess("Registration successful!");
      console.log("Registered user:", result.user);
    } catch (err) {
      setError("Failed to register: " + err.message);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-12 flex flex-col items-center">
      <div className="max-w-lg text-center mb-8">
        <h1 className="text-4xl font-bold">THE NEXT GENERATION OF LEARNING</h1>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          {[
            { id: 'username', label: 'Username*' },
            { id: 'name', label: 'Name*' },
            { id: 'surname', label: 'Surname*' },
            { id: 'email', label: 'Email*', type: 'email' },
            { id: 'password', label: 'Password*', type: 'password' },
            { id: 'confirmPassword', label: 'Confirm Password*', type: 'password' },
          ].map(({ id, label, type = 'text' }) => (
            <div className="mb-4" key={id}>
              <label htmlFor={id} className="block mb-2">{label}</label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleChange}
                required
                className="w-full p-3 rounded bg-gray-700 text-white"
              />
            </div>
          ))}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
