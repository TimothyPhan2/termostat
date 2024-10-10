import { SignUp } from '@clerk/nextjs'
import "../../../../styles/signup.css";


export default function SignUpPage() {
  return (
    <div className="flex justify-center my-20">

        <SignUp />
    </div>
)
}