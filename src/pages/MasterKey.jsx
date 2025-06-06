import React, { useEffect, useState } from "react";
import {
  PasswordInput,
  Button,
  Text,
  Alert,
  Modal,
  Checkbox,
} from "@mantine/core";

const MasterKey = ({ onMasterKeySet }) => {
  const [masterKey, setMasterKey] = useState("");
  const [error, setError] = useState(null);
  const [opened, setOpened] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const existingKey = localStorage.getItem("masterEncryptionKey");
    if (!existingKey) {
      setOpened(true);
    } else {
      if (onMasterKeySet) onMasterKeySet(existingKey);
    }
  }, [onMasterKeySet]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!masterKey || masterKey.length < 6) {
      setError("Master key must be at least 6 characters long");
      return;
    }

    localStorage.setItem("masterEncryptionKey", masterKey);

    if (onMasterKeySet) onMasterKeySet(masterKey);

    setOpened(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {} /* Disable closing modal by outside click */}
      withCloseButton={false}
      title="Set Your Master Key"
      styles={{
        title: {
          fontSize: "24px",
          fontWeight: 700,
          textAlign: "center",
        },
      }}
      centered
      closeOnClickOutside={false} // prevent closing on outside click
      closeOnEscape={false} // prevent closing on ESC key
      overlayProps={{
        style: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <>
        <Alert
          mb="md"
          color="red"
          style={{
            fontWeight: "600",
            fontSize: "16px",
            border: "1px solid black",
          }}
        >
          {acknowledged ? (
            <>
              This Master Key secures your links. <strong>Keep it safe</strong>{" "}
              — losing it means losing access.
            </>
          ) : (
            <>
              <strong>Warning:</strong> The Master Key is your private password
              used to lock and unlock all your encrypted links. <br />
              Without it, you won't be able to access your saved data. <br />
              Store it in a safe place — it cannot be recovered if lost.
            </>
          )}
        </Alert>

        {!acknowledged ? (
          <Checkbox
            label="I understand the importance of the Master Key"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.currentTarget.checked)}
            mb="md"
          />
        ) : (
          <form onSubmit={handleSubmit}>
            <PasswordInput
              label="Master Key"
              placeholder="Enter a secure master key"
              value={masterKey}
              onChange={(e) => {
                setMasterKey(e.target.value);
                setError(null);
              }}
              required
            />
            {error && (
              <Text color="red" size="sm" mt="xs">
                {error}
              </Text>
            )}
            <Button type="submit" fullWidth mt="xl" disabled={!masterKey}>
              Save Master Key
            </Button>
          </form>
        )}
      </>
    </Modal>
  );
};

export default MasterKey;
