import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn } from "../../../../../auth";
import { FcGoogle } from "react-icons/fc";

export default async function LoginPage() {
  return (
    <div
      className={
        "h-screen w-full flex flex-col items-center justify-center px-4"
      }
    >
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Sign in with your Google account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <div className="flex flex-col space-y-4">
              <Label>Sign in with Google</Label>
              <Button
                type="submit"
                variant={"secondary"}
                className="flex items-center gap-4"
              >
                <FcGoogle />
                Sign In With Google
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
