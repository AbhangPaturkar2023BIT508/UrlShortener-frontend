import React, { useState } from "react";
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { LinkIcon } from "lucide-react";
import { registerUser } from "../services/UserService";
import { notifications } from "@mantine/notifications";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      username: (value) =>
        value.trim().length >= 2
          ? null
          : "Username must be at least 2 characters",
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email format",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);

    registerUser(values)
      .then((response) => {
        notifications.show({
          title: "Success",
          message: "Registered successfully. Redirecting to login...",
          color: "green",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        notifications.show({
          title: "Registration Failed",
          message:
            error?.response?.data?.message ||
            "Email already exists or registration failed.",
          color: "red",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container size={420} my={40}>
      <Group justify="center" mb="lg">
        <LinkIcon size={32} color="#1890FF" />
        <Title order={1} ta="center" c="brand.6" fw={700}>
          ShortLink
        </Title>
      </Group>

      <Paper withBorder radius="md" p={30} shadow="md">
        <Title order={2} ta="center" mb="lg">
          Create an account
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Username"
            placeholder="Your Username"
            required
            mb="md"
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mb="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mb="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mb="md"
            {...form.getInputProps("confirmPassword")}
          />

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Register
          </Button>
        </form>

        <Text ta="center" mt="md">
          Already have an account?{" "}
          <Anchor component={Link} to="/login">
            Login
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default Register;
