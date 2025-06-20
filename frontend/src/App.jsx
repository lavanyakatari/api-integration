import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const userDetails = {
    name,
    email,
    password,
    role,
  };

  // useEffect(() => {
  //   if (registrationStatus === "pending") {
  //     const registerUser = async () => {
  //       try {
  //         const response = await fetch("http://localhost:3000/api/register", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(userDetails),
  //         });

  //         if (!response.ok) {
  //           throw new Error(`HTTP error! status: ${response.status}`);
  //         }

  //         const data = await response.json();
  //         console.log("User registered successfully:", data);
  //         setRegistrationStatus("success");
  //       } catch (err) {
  //         console.error("Error during registration:", err);
  //         setRegistrationStatus("error");
  //       }
  //     };

  //     registerUser();
  //   }
  // }, [registrationStatus, userDetails]);

  useEffect(() => {
    if (registrationStatus === "pending") {
      const registerUser = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userDetails),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("User register successfully:", data);
          setRegistrationStatus("success");
        } catch (err) {
          console.error("Error during registration:", err);
          setRegistrationStatus("error");
        }
      };
      registerUser();
    }
  }, [registrationStatus, userDetails]);

  const handleRegister = (e) => {
    e.preventDefault();
    setRegistrationStatus("pending");
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default App;
