import { Button, Card, CardContent, CardHeader, CardTitle } from '@bilo-io/ui';

export default function Composed() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Agent pool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>Three of four slots are busy. The next queued task starts as soon as a slot frees up.</p>
        <Button size="sm" variant="outline">
          View slots
        </Button>
      </CardContent>
    </Card>
  );
}
