import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { Button } from "@/components/ui/Button";
import { colors, fontSize, spacing } from "@/constants/theme";
import { trackEvent } from "@/lib/analytics";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUp = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      trackEvent("signed_up", { method: "email" });
      Alert.alert(
        "Verify email",
        "Check your inbox for a verification code, then sign in.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/sign-in") }],
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signUp, email, password, router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>Join Dialed</Text>
        <Text style={styles.subtitle}>Start your productivity journey</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Create Account" onPress={onSignUp} loading={loading} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Link href="/(auth)/sign-in" style={styles.link}>
          Sign in
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  header: { alignItems: "center", marginBottom: spacing.xl },
  logo: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.primaryLight,
  },
  subtitle: { color: colors.textMuted, marginTop: spacing.sm },
  form: { gap: spacing.md },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  footerText: { color: colors.textMuted },
  link: { color: colors.primaryLight, fontWeight: "600" },
});
