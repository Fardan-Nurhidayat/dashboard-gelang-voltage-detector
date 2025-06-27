import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { cn } from "@/lib/utils";
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
import { useNavigate } from "react-router";
// import { getUser } from "@/utils/IndexDB";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (
      e.currentTarget.elements.namedItem("name") as HTMLInputElement
    )?.value;
    const password = (
      e.currentTarget.elements.namedItem("password") as HTMLInputElement
    )?.value;
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, password: password }),
    });
    const data = await res.json(); 
    console.log(data);
    // if (data.ok) {
    //   MySwal.fire({
    //     title: "Anda Berhasil Login",
    //     didOpen: () => {
    //       MySwal.isLoading();
    //     },
    //   }).then(() => {
    //     localStorage.setItem("user", JSON.stringify(data));
    //     navigate("/dashboard");
    //   });
    // } else {
    //   MySwal.fire({
    //     icon: "error",
    //     title: "Anda Gagal Login",
    //     text: "Username atau password salah",
    //     didOpen: () => {
    //       MySwal.isLoading();
    //     },
    //   });
    // }
  };
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='name'>name</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='admin'
                  required
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <a
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full'>
                  Login
                </Button>
                <Button
                  variant='outline'
                  className='w-full'>
                  Login with Google
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{" "}
              <a
                href='#'
                className='underline underline-offset-4'>
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
