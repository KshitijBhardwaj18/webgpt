import { Card, CardContent, CardHeader } from "../ui/card";

interface AuthCardProps {
  subheading: string;
  children: React.ReactNode;
}

export const AuthCard = ({ subheading, children }: AuthCardProps) => {
  return (
    <Card className="min-w-xl">
      <CardHeader>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-bold text-xl ">WebGpt🤖</h2>
          <p className="text-neutral-400 text-lg font-semibold">
            Lets Get started.
          </p>
          <p className="text-neutral-400 text-lg font-semibold">{subheading}</p>
        </div>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
};
