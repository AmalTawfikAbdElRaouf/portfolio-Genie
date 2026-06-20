import React from "react";

interface Props {
  centered?: boolean;
  children: React.ReactNode;
}

const AuthCard: React.FC<Props> = ({ centered = false, children }) => {
  return (
    <div className={`auth-card rounded-4 p-4 p-sm-5${centered ? " mx-auto" : ""}`}>
      {children}
    </div>
  );
};

export default AuthCard;
