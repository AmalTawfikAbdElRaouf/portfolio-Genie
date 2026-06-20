import React from "react";
import { Form } from "react-bootstrap";
import type { IconType } from "react-icons";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface Props {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: IconType;
  showPass?: boolean;
  onTogglePass?: () => void;
  extraLabel?: React.ReactNode;
}

const InputField: React.FC<Props> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  showPass,
  onTogglePass,
  extraLabel,
}) => {
  const inputType = type === "password" ? (showPass ? "text" : "password") : type;

  const autoCompleteValue =
    name === "email" ? "off" :
    name === "password" ? "new-password" :
    name === "confirmPassword" ? "new-password" :
    name === "fullName" ? "off" :
    "off";

  return (
    <Form.Group className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <Form.Label className="text-uppercase fw-semibold small text-muted-custom mb-0">
          {label}
        </Form.Label>
        {extraLabel}
      </div>

      <div className="position-relative">
        {Icon && (
          <Icon
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              color: error ? "#ef4444" : "#6c757d",
              pointerEvents: "none",
            }}
          />
        )}

        <input
          className={`auth-input rounded-3 w-100${error ? " input-error-state" : ""}`}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoCompleteValue}
          style={{
            paddingLeft: Icon ? "40px" : "14px",
            paddingRight: onTogglePass ? "40px" : "14px",
            paddingTop: "11px",
            paddingBottom: "11px",
            background: "rgba(255,255,255,0.04)",
            border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "0.9rem",
            outline: "none",
            width: "100%",
            transition: "border-color 0.2s",
          }}
        />

        {type === "password" && onTogglePass && (
          <span
            onClick={onTogglePass}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              zIndex: 10,
              color: "#6c757d",
              display: "flex",
              alignItems: "center",
            }}
          >
            {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            color: "#ef4444",
            fontSize: "0.78rem",
            marginTop: "5px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          ⚠ {error}
        </div>
      )}
    </Form.Group>
  );
};

export default InputField;
