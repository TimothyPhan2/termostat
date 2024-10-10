import { SignIn } from "@clerk/nextjs";
import "../../../../styles/signup.css";

export default function SignInPage() {
  return (
    <div className="flex justify-center my-20">
      <SignIn />
    </div>
  );
}
