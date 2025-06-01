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
import { loginUser } from "../services/UserService"; // your login API call
import { notifications } from "@mantine/notifications";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email format",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleSubmit = (values) => {
    setLoading(true);

    loginUser(values)
      .then((response) => {
        notifications.show({
          title: "Success",
          message: "Logged in successfully. Redirecting...",
          color: "green",
          autoClose: 3000,
        });

        // Save token or user data here if needed, e.g. localStorage.setItem('token', response.token);

        setTimeout(() => {
          localStorage.setItem("user", JSON.stringify(response));
          navigate("/"); // redirect wherever after login
        }, 3000);
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || "Invalid email or password.";
        notifications.show({
          title: "Login Failed",
          message,
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
          Login to your account
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
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

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Login
          </Button>
        </form>

        <Text ta="center" mt="md">
          Don't have an account?{" "}
          <Anchor component={Link} to="/register">
            Register
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
};

export default Login;
