"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { useNotification } from "@/hooks/useNotification";

const NotificationCard: React.FC = () => {
  const notification = useNotification();

  const handleNotification = () => {
    notification.showNotification("PWA Template", {
      body: "This is a test notification"
    });
  };

  return (
    <main className="grid grow place-content-center gap-4 text-center">
      <Card className="mx-auto w-full max-w-4xl text-center">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Permission granted: {notification.granted ? "Yes" : "No"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p>
            This card demonstrates how to request permission and show
            notifications using the Notification API.
          </p>
        </CardContent>

        <CardFooter className="flex flex-row justify-center gap-2">
          <Button
            onClick={notification.requestPermission}
            disabled={notification.granted}
          >
            Request Permission
          </Button>
          <Button onClick={handleNotification} disabled={!notification.granted}>
            Show Notification
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default NotificationCard;
