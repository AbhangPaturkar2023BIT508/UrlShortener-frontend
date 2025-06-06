import React, { useState } from "react";
import { Modal, TextInput, Button, Group, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

const ForgotPassword = ({ opened, onClose }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);

    // Simulate sending a reset request
    setTimeout(() => {
      notifications.show({
        title: "Password Reset",
        message: `Reset link sent to ${values.email}`,
        color: "green",
      });
      setLoading(false);
      onClose(); // close modal
    }, 2000);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Forgot Password"
      styles={{
        title: {
          fontSize: "24px", // or any size you want
          fontWeight: 700,
          textAlign: "center",
        },
      }}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Text size="sm" mb="xs">
          Enter your registered email address
        </Text>
        <TextInput
          placeholder="you@example.com"
          required
          {...form.getInputProps("email")}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Send Link
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ForgotPassword;
