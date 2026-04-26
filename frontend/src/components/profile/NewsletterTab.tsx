"use client";
import { useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  useCheckSubscription,
  useSubscribe,
  useUnsubscribe,
} from "@/hooks/useNewsletter";

export default function NewsletterTab() {
  const { user } = useAuth();
  const defaultEmail = user?.email ?? "";
  const [email, setEmail] = useState(defaultEmail);

  const { data: subscribed, isLoading } = useCheckSubscription(email);
  const { mutate: subscribe, isPending: subscribing } = useSubscribe();
  const { mutate: unsubscribe, isPending: unsubscribing } = useUnsubscribe();

  const isPending = subscribing || unsubscribing;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-semibold text-lg">Newsletter Subscription</h2>
        <p className="text-sm text-muted-foreground">
          Manage your subscription to receive news, deals and new arrivals.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Email address</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking status…
        </div>
      ) : (
        <div className="rounded-xl border p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {subscribed ? (
              <Bell className="h-5 w-5 text-emerald-500" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-sm">
                {subscribed ? "You are subscribed" : "You are not subscribed"}
              </p>
              <p className="text-xs text-muted-foreground">
                {subscribed
                  ? "You receive our newsletters and exclusive deals."
                  : "Subscribe to stay updated with new arrivals and offers."}
              </p>
            </div>
          </div>
          {subscribed ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => unsubscribe(email)}
              className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/5"
            >
              {unsubscribing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Unsubscribe"
              )}
            </Button>
          ) : (
            <Button
              variant="luxury"
              size="sm"
              disabled={isPending || !email}
              onClick={() => subscribe(email)}
              className="shrink-0"
            >
              {subscribing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Subscribe"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
