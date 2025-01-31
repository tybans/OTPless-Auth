import React from "react";

const Home = ({ user }) => {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>Your Token: {user.token}</p>
    </div>
  );
};

export default Home;
