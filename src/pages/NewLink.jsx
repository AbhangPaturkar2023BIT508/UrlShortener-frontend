import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  TextInput,
  Button,
  Switch,
  Group,
  Paper,
  Box,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { Check, Clock, X } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { checkCodeExists, createLink } from "../services/LinkService";

const NewLink = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getTodayDate = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5); // HH:MM

  const form = useForm({
    initialValues: {
      originalUrl: "",
      customCode: "",
      useExpiry: false,
      notifyBeforeExpiry: false,
      expiryDate: "",
      expiryTime: "",
      scheduled: false,
      activationDate: "",
      activationTime: "",
    },

    validate: {
      originalUrl: (value) => {
        try {
          new URL(value);
          return null;
        } catch {
          return "Please enter a valid URL";
        }
      },
      customCode: (value) => {
        if (value && !/^[a-zA-Z0-9-_]{3,16}$/.test(value)) {
          return "Custom code must be 3–16 alphanumeric characters";
        }
        return null;
      },
      activationDate: (value, values) => {
        if (values.scheduled && !value) return "Please select a date";
        return null;
      },
      activationTime: (value, values) => {
        if (values.scheduled) {
          if (!value) return "Please select a time";
          if (
            values.activationDate === getTodayDate() &&
            value < getCurrentTime()
          ) {
            return "Time must be in the future for today";
          }
        }
        return null;
      },
      expiryDate: (value, values) => {
        if (values.useExpiry && !value) return "Please select expiry date";
        return null;
      },
      expiryTime: (value, values) => {
        if (values.useExpiry && !value) return "Please select expiry time";

        if (values.useExpiry) {
          const activation = values.scheduled
            ? new Date(`${values.activationDate}T${values.activationTime}`)
            : new Date();
          const expiry = new Date(`${values.expiryDate}T${values.expiryTime}`);
          if (expiry <= activation) {
            return "Expiry must be after activation time";
          }
        }

        return null;
      },
    },
  });

  useEffect(() => {
    if (form.values.useExpiry) {
      form.validateField("expiryTime");
    }
  }, [
    form.values.expiryDate,
    form.values.expiryTime,
    form.values.activationDate,
    form.values.activationTime,
    form.values.useExpiry,
    form.values.scheduled,
  ]);

  const getLocalISOString = (dateStr, timeStr) => {
    return `${dateStr}T${timeStr}:00`; // No conversion to UTC
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      if (values.customCode) {
        const isAvailable = await checkCodeExists(values.customCode);
        if (isAvailable) {
          notifications.show({
            title: "Custom code already used",
            message: `"${values.customCode}" is already taken.`,
            color: "red",
          });
          setLoading(false);
          return;
        }
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;

      // Always set createdAt to now
      const createdAt = new Date().toISOString();

      let activateAt = null;
      if (values.scheduled && values.activationDate && values.activationTime) {
        activateAt = getLocalISOString(
          values.activationDate,
          values.activationTime
        );
      }

      let expiresAt = null;
      if (values.useExpiry && values.expiryDate && values.expiryTime) {
        expiresAt = getLocalISOString(values.expiryDate, values.expiryTime);
      }
      await createLink({
        originalUrl: values.originalUrl,
        customCode: values.customCode || undefined,
        createdAt,
        activateAt,
        expiresAt,
        notifyOn:
          Boolean(values.useExpiry) && Boolean(values.notifyBeforeExpiry),
        userId,
      });

      notifications.show({
        title: "Link Created",
        message: "Your shortened link is ready!",
        color: "green",
      });

      navigate("/");
    } catch (error) {
      console.error("Link creation error:", error);
      notifications.show({
        title: "Error",
        message: "Something went wrong. Try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
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
            placeholder="https://example.com"
            required
            mb="md"
            {...form.getInputProps("originalUrl")}
          />

          <TextInput
            label="Custom Code (Optional)"
            placeholder="e.g., my-link"
            mb="xl"
            {...form.getInputProps("customCode")}
          />

          {/* Scheduled Activation */}
          <Stack mb="xl">
            <Switch
              label="Schedule Link Activation"
              checked={form.values.scheduled}
              onChange={(e) =>
                form.setFieldValue("scheduled", e.currentTarget.checked)
              }
              size="md"
              color="blue"
              onLabel={<Check size={14} />}
              offLabel={<X size={14} />}
            />

            {form.values.scheduled && (
              <>
                <TextInput
                  type="date"
                  label="Activation Date"
                  {...form.getInputProps("activationDate")}
                  min={getTodayDate()}
                  required
                />

                <TextInput
                  type="time"
                  label="Activation Time"
                  {...form.getInputProps("activationTime")}
                  min={
                    form.values.activationDate === getTodayDate()
                      ? getCurrentTime()
                      : undefined
                  }
                  required
                />
              </>
            )}
          </Stack>

          {/* Expiry Section */}
          <Stack mb="xl">
            <Switch
              label="Set Expiry Date"
              checked={form.values.useExpiry}
              onChange={(e) => {
                const checked = e.currentTarget.checked;
                form.setFieldValue("useExpiry", checked);
                if (!checked) {
                  form.setFieldValue("notifyBeforeExpiry", false);
                }
              }}
              size="md"
              color="blue"
              onLabel={<Check size={14} />}
              offLabel={<X size={14} />}
            />

            {form.values.useExpiry && (
              <>
                <TextInput
                  type="date"
                  label="Expiry Date"
                  {...form.getInputProps("expiryDate")}
                  min={
                    form.values.scheduled
                      ? form.values.activationDate || getTodayDate()
                      : getTodayDate()
                  }
                  required
                />

                <TextInput
                  type="time"
                  label="Expiry Time"
                  {...form.getInputProps("expiryTime")}
                  required
                />

                <Switch
                  label="Notify Me Before Expiry"
                  checked={form.values.notifyBeforeExpiry}
                  onChange={(e) =>
                    form.setFieldValue(
                      "notifyBeforeExpiry",
                      e.currentTarget.checked
                    )
                  }
                  size="md"
                  color="teal"
                  onLabel={<Check size={14} />}
                  offLabel={<X size={14} />}
                />
              </>
            )}
          </Stack>

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
