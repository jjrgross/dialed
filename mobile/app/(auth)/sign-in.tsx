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
import { useSignIn } from "@clerk/clerk-expo";
import { Button } from "@/components/ui/Button";
import { colors, fontSize, spacing } from "@/constants/theme";
import { trackEvent } from "@/lib/analytics";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignIn = useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      await setActive({ session: result.createdSessionId });
      trackEvent("signed_in", { method: "email" });
      router.replace("/(tabs)/today");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signIn, setActive, email, password, router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>Dialed</Text>
        <Text style={styles.subtitle}>Focus. Grow. Achieve.</Text>
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
        <Button title="Sign In" onPress={onSignIn} loading={loading} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account?</Text>
        <Link href="/(auth)/sign-up" style={styles.link}>
          Sign up
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
    fontSize: fontSize.xxl,
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
