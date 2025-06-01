import React, { useState } from "react";
import {
  Container,
  Title,
  TextInput,
  Button,
  Switch,
  Group,
  Text,
  Paper,
  Select,
  PasswordInput,
  Box,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { linkService } from "../services/linkService";
import { Calendar, Check, Clock, KeyRound, X } from "lucide-react";
import CryptoJS from "crypto-js";
import { notifications } from "@mantine/notifications";

const NewLink = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      originalUrl: "",
      customCode: "",
      useExpiry: false,
      expiryDuration: "30",
      useEncryption: false,
      encryptionKey: "",
    },
    validate: {
      originalUrl: (value) => {
        try {
          new URL(value);
          return null;
        } catch (e) {
          return "Please enter a valid URL";
        }
      },
      customCode: (value) => {
        if (value && !/^[a-zA-Z0-9-_]{3,16}$/.test(value)) {
          return "Custom code must be 3-16 alphanumeric characters";
        }
        return null;
      },
      encryptionKey: (value, values) => {
        if (values.useEncryption && (!value || value.length < 6)) {
          return "Encryption key must be at least 6 characters";
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values) => {
    if (!user) return;

    try {
      setLoading(true);

      let finalUrl = values.originalUrl;
      let expiresAt;

      if (values.useExpiry) {
        const days = parseInt(values.expiryDuration);
        const date = new Date();
        date.setDate(date.getDate() + days);
        expiresAt = date.toISOString();
      }

      if (values.useEncryption) {
        finalUrl = linkService.encryptUrl(
          values.originalUrl,
          values.encryptionKey
        );
      }

      await linkService.createLink(
        user.id,
        finalUrl,
        values.customCode || undefined,
        expiresAt,
        values.useEncryption,
        values.useEncryption ? values.encryptionKey : undefined
      );

      notifications.show({
        title: "Link created successfully",
        message: "Your shortened link is ready to use",
        color: "green",
      });

      navigate("/");
    } catch (error) {
      console.error("Error creating link:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create link. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomKey = () => {
    const randomKey = CryptoJS.lib.WordArray.random(16).toString();
    form.setFieldValue("encryptionKey", randomKey.slice(0, 12));
  };

  return (
    <Container size="md">
      <Title order={2} mb="xl">
        Create New Shortened Link
      </Title>

      <Paper withBorder p="xl" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="URL to Shorten"
            placeholder="https://example.com/your-long-url"
            required
            mb="md"
            {...form.getInputProps("originalUrl")}
          />

          <TextInput
            label="Custom Short Code (Optional)"
            description="Leave blank to generate automatically"
            placeholder="e.g., my-link"
            mb="xl"
            {...form.getInputProps("customCode")}
          />

          <Group mb="xl">
            <Switch
              label="Set Expiry Date"
              checked={form.values.useExpiry}
              onChange={(event) =>
                form.setFieldValue("useExpiry", event.currentTarget.checked)
              }
              size="md"
              color="blue"
              onLabel={<Check size={14} />}
              offLabel={<X size={14} />}
            />

            {form.values.useExpiry && (
              <Box ml="md" style={{ flexGrow: 1 }}>
                <Select
                  label="Expires After"
                  data={[
                    { value: "1", label: "1 day" },
                    { value: "7", label: "7 days" },
                    { value: "30", label: "30 days" },
                    { value: "90", label: "90 days" },
                    { value: "365", label: "1 year" },
                  ]}
                  leftSection={<Clock size={16} />}
                  {...form.getInputProps("expiryDuration")}
                />
              </Box>
            )}
          </Group>

          <Group mb="xl">
            <Switch
              label="Enable End-to-End Encryption"
              checked={form.values.useEncryption}
              onChange={(event) =>
                form.setFieldValue("useEncryption", event.currentTarget.checked)
              }
              size="md"
              color="green"
              onLabel={<Check size={14} />}
              offLabel={<X size={14} />}
            />
          </Group>

          {form.values.useEncryption && (
            <>
              <Alert color="blue" title="About End-to-End Encryption" mb="md">
                <Text size="sm">
                  Enabling encryption will protect your link content so only
                  those with the encryption key can access the original URL. The
                  key is <strong>never stored</strong> on our servers in plain
                  text.
                </Text>
              </Alert>

              <Group align="flex-end" mb="xl">
                <PasswordInput
                  label="Encryption Key"
                  description="This key will be needed to decrypt the URL"
                  placeholder="Enter a secure key"
                  style={{ flexGrow: 1 }}
                  leftSection={<KeyRound size={16} />}
                  {...form.getInputProps("encryptionKey")}
                />
                <Button variant="outline" onClick={generateRandomKey}>
                  Generate Key
                </Button>
              </Group>
            </>
          )}

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Shortened Link
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default NewLink;
