import { SignUp } from "@clerk/nextjs";
import styles from "../../auth.module.css";

export default function SignUpPage() {
  return (
    <div className={styles.container}>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
      />
    </div>
  );
}
