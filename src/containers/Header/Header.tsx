import React from 'react';
import {NavLink} from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <div className="container-fluid mt-3">
      <NavLink to={"/"} className="navbar-brand"><strong> Calorie Tracker </strong></NavLink>

    </div>
  );
};

export default Header;