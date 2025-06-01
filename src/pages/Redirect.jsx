import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Paper, Title, Text, Button, PasswordInput, Group, Alert, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { linkService } from '../services/linkService';
import { links } from '../data/mockData';
import { LinkIcon, AlertTriangle, KeyRound } from 'lucide-react';

const Redirect = () => {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decrypting, setDecrypting] = useState(false);

  const form = useForm({
    initialValues: {
      encryptionKey: '',
    },
    validate: {
      encryptionKey: (value) => (!value ? 'Encryption key is required' : null),
    },
  });

  useEffect(() => {
    if (!code) {
      setError('Invalid link');
      setLoading(false);
      return;
    }

    try {
      const foundLink = links.find((link) => link.shortCode === code);

      if (!foundLink) {
        setError('This link does not exist or has expired');
        setLoading(false);
        return;
      }

      setLink(foundLink);

      if (!foundLink.isEncrypted) {
        linkService.incrementClicks(foundLink.shortCode);
        window.location.href = foundLink.originalUrl;
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching link:', err);
      setError('An error occurred while retrieving this link');
      setLoading(false);
    }
  }, [code]);

  const handleDecrypt = (values) => {
    if (!link) return;

    try {
      setDecrypting(true);
      setError(null);

      // ✅ Pass user-entered key here
      const decryptedUrl = linkService.decryptUrl(link.originalUrl, values.encryptionKey);

      if (!decryptedUrl) {
        setError('Invalid encryption key');
        setDecrypting(false);
        return;
      }

      linkService.incrementClicks(link.shortCode);
      window.location.href = decryptedUrl;
    } catch (err) {
      console.error('Decryption error:', err);
      setError('Invalid encryption key');
      setDecrypting(false);
    }
  };

  if (loading) {
    return (
      <Container size={420} my={40} className="flex flex-col items-center justify-center">
        <Loader size="lg" />
        <Text mt="md">Redirecting...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size={420} my={40}>
        <Group justify="center" mb="lg">
          <LinkIcon size={32} color="#1890FF" />
          <Title order={1} ta="center" c="brand.6">
            ShortLink
          </Title>
        </Group>

        <Paper withBorder radius="md" p={30} mt={30} shadow="md">
          <Alert color="red" title="Link Error" icon={<AlertTriangle size={16} />} mb="md">
            {error}
          </Alert>

          <Text size="sm" mb="xl" ta="center">
            This link may have expired, been removed, or never existed.
          </Text>

          <Button component={Link} to="/" fullWidth>
            Go to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  if (link?.isEncrypted) {
    return (
      <Container size={420} my={40}>
        <Group justify="center" mb="lg">
          <LinkIcon size={32} color="#1890FF" />
          <Title order={1} ta="center" c="brand.6">
            ShortLink
          </Title>
        </Group>

        <Paper withBorder radius="md" p={30} mt={30} shadow="md">
          <Title order={3} ta="center" mb="md">
            Encrypted Link
          </Title>

          <Alert color="blue" title="Encryption Key Required" mb="xl">
            This link is encrypted and requires a key to access. If you received this link from someone, they should have provided you with the encryption key.
          </Alert>

          <form onSubmit={form.onSubmit(handleDecrypt)}>
            <PasswordInput
              label="Encryption Key"
              placeholder="Enter the encryption key"
              required
              mb="md"
              leftSection={<KeyRound size={16} />}
              {...form.getInputProps('encryptionKey')}
            />

            {error && (
              <Alert color="red" mb="md">
                {error}
              </Alert>
            )}

            <Button fullWidth mt="md" type="submit" loading={decrypting}>
              Access Link
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }

  return null;
};

export default Redirect;
