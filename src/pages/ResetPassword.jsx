import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  PinInput,
  Group,
} from "@mantine/core";
import { AtSign, Lock } from "lucide-react";
import { useState } from "react";
import { changePass, sendOtp, verifyOtp } from "../services/UserService";
import { useInterval } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Modal } from "@mantine/core";

const ResetPassword = ({ opened, close }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passErr, setPassErr] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [seconds, setSeconds] = useState(60);

  const interval = useInterval(() => {
    if (seconds === 0) {
      setResendLoader(false);
      setSeconds(60);
      interval.stop();
    } else {
      setSeconds((s) => s - 1);
    }
  }, 1000);

  const resetState = () => {
    setEmail("");
    setPassword("");
    setPassErr("");
    setOtpSent(false);
    setOtpSending(false);
    setVerified(false);
    setResendLoader(false);
    setSeconds(60);
    interval.stop();
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter";
    if (!/[a-z]/.test(value)) return "Include at least one lowercase letter";
    if (!/[0-9]/.test(value)) return "Include at least one number";
    if (!/[!@#$%^&*]/.test(value))
      return "Include a special character (!@#$%^&*)";
    return null;
  };

  const handleSendOtp = () => {
    setOtpSending(true);
    sendOtp(email)
      .then(() => {
        notifications.show({
          title: "OTP Sent",
          message: "Enter the OTP to verify your identity.",
          color: "green",
        });
        setOtpSent(true);
        setOtpSending(false);
        setResendLoader(true);
        interval.start();
      })
      .catch((err) => {
        setOtpSending(false);
        notifications.show({
          title: "OTP Sending Failed",
          message: err?.response?.data?.message || "Something went wrong.",
          color: "red",
        });
      });
  };

  const handleVerifyOtp = (otp) => {
    verifyOtp(email, otp)
      .then(() => {
        notifications.show({
          title: "OTP Verified",
          message: "Now set your new password.",
          color: "green",
        });
        setVerified(true);
      })
      .catch((err) => {
        notifications.show({
          title: "OTP Verification Failed",
          message: err?.response?.data?.message || "Invalid OTP.",
          color: "red",
        });
      });
  };

  const handleResetPassword = () => {
    const error = validatePassword(password);
    if (error) {
      setPassErr(error);
      return;
    }

    changePass(email, password)
      .then(() => {
        notifications.show({
          title: "Password Changed",
          message: "You can now log in with your new password.",
          color: "green",
        });
        close();
        resetState();
      })
      .catch((err) => {
        notifications.show({
          title: "Password Reset Failed",
          message:
            err?.response?.data?.errorMessage || "Failed to change password.",
          color: "red",
        });
      });
  };

  const resendOtp = () => {
    if (!resendLoader) {
      handleSendOtp();
    }
  };

  const changeEmail = () => {
    setOtpSent(false);
    setVerified(false);
    setResendLoader(false);
    setSeconds(60);
    interval.stop();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        close();
        resetState();
      }}
      centered
      size="sm"
      withCloseButton
      title={
        <Text size="xl" fw={700}>
          Reset Password
        </Text>
      }
    >
      {!otpSent && (
        <TextInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          withAsterisk
          leftSection={<AtSign size={16} />}
          rightSection={
            <Button
              loading={otpSending && !otpSent}
              size="xs"
              variant="filled"
              disabled={!email || otpSent}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          }
          rightSectionWidth={100}
          mb="md"
        />
      )}

      {otpSent && (
        <>
          <Text ta="center" mb="sm">
            Enter the 6-digit OTP sent to your email
          </Text>

          <Group justify="center" mb="md">
            <PinInput
              onComplete={handleVerifyOtp}
              length={6}
              size="md"
              type="number"
              disabled={verified}
            />
          </Group>

          {!verified && (
            <Group grow mb="md">
              <Button
                loading={otpSending}
                variant="light"
                onClick={resendOtp}
                disabled={resendLoader}
              >
                {resendLoader ? `Resend in ${seconds}s` : "Resend OTP"}
              </Button>
              <Button variant="default" onClick={changeEmail}>
                Change Email
              </Button>
            </Group>
          )}
        </>
      )}

      {verified && (
        <>
          <PasswordInput
            label="New Password"
            placeholder="Enter strong password"
            withAsterisk
            value={password}
            error={passErr}
            onChange={(e) => {
              setPassword(e.target.value);
              setPassErr(validatePassword(e.target.value));
            }}
            leftSection={<Lock size={16} />}
            mb="md"
          />
          <Button fullWidth onClick={handleResetPassword}>
            Change Password
          </Button>
        </>
      )}
    </Modal>
  );
};

export default ResetPassword;
