"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle, signOutUser, useAuth, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, Music2 } from "lucide-react";
import * as React from "react";

/** Shown when nobody is signed in, or when the signed-in account is not an editor. */
export function AdminSignIn() {
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [busy, setBusy] = React.useState(false);

  const signedInElsewhere = !!user && !user.isAnonymous;

  const handleSignIn = async () => {
    setBusy(true);
    try {
      await signInWithGoogle(auth);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        toast({ variant: "destructive", title: "Sign-in failed", description: code || "Please try again." });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="bg-primary p-3 rounded-2xl w-fit mx-auto">
          <Music2 className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-headline font-bold text-primary">HarmonyForge</h1>
          <p className="text-sm text-muted-foreground">
            {signedInElsewhere
              ? `${user?.email ?? "This account"} is not allowed to edit the hymnal.`
              : "Sign in with an authorized Google account to edit the hymnal."}
          </p>
        </div>
        {signedInElsewhere ? (
          <Button variant="outline" onClick={() => signOutUser(auth)} className="w-full">
            Use another account
          </Button>
        ) : (
          <Button onClick={handleSignIn} disabled={busy} className="w-full">
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
            Sign in with Google
          </Button>
        )}
      </div>
    </div>
  );
}
