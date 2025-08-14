import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";

const SignIn = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <AdminLogin />
    </main>
  );
};

export default SignIn;