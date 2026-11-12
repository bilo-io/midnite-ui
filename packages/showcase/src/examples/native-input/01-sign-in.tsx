import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Input } from '@bilo-io/ui-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  return (
    <View style={styles.form}>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Input label="Password" placeholder="••••••••" secureTextEntry autoComplete="password" />
      <Button disabled={!email.includes('@')}>Sign in</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
});
