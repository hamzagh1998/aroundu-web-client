import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";

export function OauthSection({
  onOAuthSignup,
  isPending,
}: {
  onOAuthSignup: (provider: "google" | "facebook" | "twitter") => void;
  isPending: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-2 mt-4">
      <Button
        variant="outline"
        className="w-full p-4"
        onClick={() => onOAuthSignup("google")}
        disabled={isPending}
      >
        <FcGoogle size={20} />
      </Button>
      <Button
        variant="outline"
        className="w-full p-4"
        onClick={() => onOAuthSignup("facebook")}
        disabled={isPending}
      >
        <FaFacebook color="#4267B2" size={20} />
      </Button>
      <Button
        variant="outline"
        className="w-full p-4"
        onClick={() => onOAuthSignup("twitter")}
        disabled={isPending}
      >
        <FaXTwitter size={20} />
      </Button>
    </div>
  );
}
